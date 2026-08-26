from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import secrets
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
from typing import List, Optional

import jwt
import bcrypt
import hashlib
import hmac
import httpx
from html import escape
from collections import defaultdict
from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

import apple_wallet

# ---------------------------------------------------------------- config
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"
STAMPS_REQUIRED = int(os.environ.get("STAMPS_REQUIRED", "4"))

CAFE = {
    "name": os.environ.get("CAFE_NAME", "Bros Cafe"),
    "address": os.environ.get("CAFE_ADDRESS", ""),
    "instagram": os.environ.get("CAFE_INSTAGRAM", ""),
    "phone": os.environ.get("CAFE_PHONE", ""),
    "email": os.environ.get("CAFE_EMAIL", ""),
    "hours_weekdays": os.environ.get("CAFE_HOURS_WEEKDAYS", "Mon–Fri · 7:30–19:00"),
    "hours_weekend": os.environ.get("CAFE_HOURS_WEEKEND", "Sat–Sun · 9:00–18:00"),
    "stamps_required": STAMPS_REQUIRED,
}

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------- auth utils
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id, "email": email, "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------------------------------------------------------------- models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class StaffCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "staff"


class MemberCreate(BaseModel):
    name: str
    email: EmailStr


def member_public(doc: dict) -> dict:
    return {
        "code": doc["code"],
        "name": doc["name"],
        "email": doc["email"],
        "stamps": doc["stamps"],
        "stamps_required": STAMPS_REQUIRED,
        "total_coffees": doc["total_coffees"],
        "rewards_redeemed": doc["rewards_redeemed"],
        "reward_ready": doc["reward_ready"],
        "opening_status": doc.get("opening_status", "reserved"),
        "created_at": doc["created_at"],
    }


# ---------------------------------------------------------------- analytics helpers
DEFAULT_SETTINGS = {
    "active_days": 30,
    "inactive_days": 30,
    "new_days": 14,
    "loyal_cycles": 2,
    "almost_reward_stamps": max(STAMPS_REQUIRED - 1, 1),
    "cafe_lat": None,
    "cafe_lng": None,
}


async def get_settings() -> dict:
    doc = await db.settings.find_one({"_id": "config"})
    if not doc:
        return dict(DEFAULT_SETTINGS)
    doc.pop("_id", None)
    return {**DEFAULT_SETTINGS, **doc}


def _parse(ts):
    try:
        return datetime.fromisoformat(ts)
    except Exception:
        return None


def _since(days):
    return datetime.now(timezone.utc) - timedelta(days=days)


def _today_start():
    return datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)


def _pct(n, d):
    return round((n / d) * 100, 1) if d else 0.0


def parse_ua(ua: str):
    ua = (ua or "").lower()
    if "ipad" in ua or "tablet" in ua:
        device = "tablet"
    elif "mobi" in ua or "iphone" in ua or "android" in ua:
        device = "mobile"
    else:
        device = "desktop"
    if "edg" in ua:
        browser = "Edge"
    elif "chrome" in ua or "crios" in ua:
        browser = "Chrome"
    elif "firefox" in ua:
        browser = "Firefox"
    elif "safari" in ua:
        browser = "Safari"
    else:
        browser = "Other"
    return device, browser


async def record_transaction(code, name, employee, ttype, prev_stamps, new_stamps,
                             prev_reward, new_reward):
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "code": code, "customer_name": name, "employee": employee, "type": ttype,
        "prev_stamps": prev_stamps, "new_stamps": new_stamps,
        "prev_reward": prev_reward, "new_reward": new_reward,
        "at": datetime.now(timezone.utc).isoformat(),
    })


# ---------------------------------------------------------------- routes: meta
@api_router.get("/")
async def root():
    return {"message": "Bros Cafe Loyalty API"}


@api_router.get("/cafe")
async def cafe_info():
    return {**CAFE, "apple_wallet_configured": apple_wallet.is_configured()}


# ---------------------------------------------------------------- routes: auth
@api_router.post("/auth/login")
async def login(body: LoginRequest):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"], user["role"])
    return {
        "token": token,
        "user": {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]},
    }


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]}


@api_router.post("/staff")
async def create_staff(body: StaffCreate, admin: dict = Depends(require_admin)):
    email = body.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    doc = {
        "id": str(uuid.uuid4()), "name": body.name, "email": email,
        "password_hash": hash_password(body.password),
        "role": body.role if body.role in ("staff", "admin") else "staff",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    return {"id": doc["id"], "name": doc["name"], "email": doc["email"], "role": doc["role"]}


@api_router.get("/staff")
async def list_staff(admin: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(500)
    return users


# ---------------------------------------------------------------- routes: members (public)
@api_router.post("/members")
async def create_member(body: MemberCreate):
    email = body.email.lower().strip()
    existing = await db.members.find_one({"email": email})
    if existing:
        return member_public(existing)
    doc = {
        "code": uuid.uuid4().hex[:10],
        "name": body.name.strip(),
        "email": email,
        "stamps": 0,
        "total_coffees": 0,
        "rewards_redeemed": 0,
        "reward_ready": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.members.insert_one(doc)
    await record_transaction(doc["code"], doc["name"], "customer", "registration",
                             0, 0, False, False)
    return member_public(doc)


@api_router.get("/find-card")
async def find_card(email: str):
    doc = await db.members.find_one({"email": email.lower().strip()})
    if not doc:
        raise HTTPException(status_code=404, detail="No loyalty card found for that email")
    return member_public(doc)


@api_router.get("/members/{code}")
async def get_member(code: str):
    doc = await db.members.find_one({"code": code})
    if not doc:
        raise HTTPException(status_code=404, detail="Loyalty card not found")
    return member_public(doc)


# ---------------------------------------------------------------- routes: staff scan actions
async def find_member_by_scan(value: str):
    """Resolve a scanned/looked-up value to a member by code, wallet serial, or loyalty token."""
    return await db.members.find_one({"$or": [
        {"code": value}, {"wallet_serial": value}, {"loyalty_token": value}]})


async def notify_wallet_update(member_code: str):
    """Best-effort: mark pass changed + push to any registered Apple Wallet devices."""
    if not apple_wallet.is_configured():
        return
    m = await db.members.find_one({"code": member_code})
    serial = m.get("wallet_serial") if m else None
    if not serial:
        return
    now = datetime.now(timezone.utc).isoformat()
    await db.members.update_one({"code": member_code}, {"$set": {"wallet_updated_at": now}})
    regs = await db.wallet_registrations.find({"serial": serial}, {"_id": 0}).to_list(500)
    tokens = [r["push_token"] for r in regs if r.get("push_token")]
    try:
        sent = await apple_wallet.push_to_devices(tokens)
        logger.info("Wallet push: %s/%s for %s", sent, len(tokens), serial)
    except Exception as e:
        await db.wallet_stats.update_one({"_id": "stats"},
                                         {"$inc": {"push_failures": 1}}, upsert=True)
        logger.warning("Wallet push failed: %s", e)


@api_router.get("/scan/{code}")
async def scan_member(code: str, user: dict = Depends(get_current_user)):
    doc = await find_member_by_scan(code)
    if not doc:
        raise HTTPException(status_code=404, detail="Customer not found")
    return member_public(doc)


@api_router.post("/scan/{code}/add-coffee")
async def add_coffee(code: str, user: dict = Depends(get_current_user)):
    doc = await find_member_by_scan(code)
    if not doc:
        raise HTTPException(status_code=404, detail="Customer not found")
    code = doc["code"]
    if doc["reward_ready"]:
        raise HTTPException(status_code=400, detail="Reward is ready — redeem the free coffee first")
    prev_stamps = doc["stamps"]
    stamps = prev_stamps + 1
    total = doc["total_coffees"] + 1
    reward_ready = stamps >= STAMPS_REQUIRED
    await db.members.update_one(
        {"code": code},
        {"$set": {"stamps": stamps, "total_coffees": total, "reward_ready": reward_ready}},
    )
    doc.update({"stamps": stamps, "total_coffees": total, "reward_ready": reward_ready})
    await record_transaction(code, doc["name"], user["email"], "coffee_added",
                             prev_stamps, stamps, False, reward_ready)
    if reward_ready:
        await record_transaction(code, doc["name"], user["email"], "reward_earned",
                                 stamps, stamps, False, True)
        try:
            await send_reward_email(doc["name"], doc["email"])
        except Exception as e:
            logger.warning("Reward email failed: %s", e)
    await notify_wallet_update(code)
    return member_public(doc)


@api_router.post("/scan/{code}/redeem")
async def redeem_reward(code: str, user: dict = Depends(get_current_user)):
    doc = await find_member_by_scan(code)
    if not doc:
        raise HTTPException(status_code=404, detail="Customer not found")
    code = doc["code"]
    if not doc["reward_ready"]:
        raise HTTPException(status_code=400, detail="No reward available to redeem")
    prev_stamps = doc["stamps"]
    rewards = doc["rewards_redeemed"] + 1
    await db.members.update_one(
        {"code": code},
        {"$set": {"stamps": 0, "reward_ready": False, "rewards_redeemed": rewards}},
    )
    doc.update({"stamps": 0, "reward_ready": False, "rewards_redeemed": rewards})
    await record_transaction(code, doc["name"], user["email"], "reward_redeemed",
                             prev_stamps, 0, True, False)
    await notify_wallet_update(code)
    return member_public(doc)


class AdjustRequest(BaseModel):
    delta: int


@api_router.post("/scan/{code}/adjust")
async def manual_adjust(code: str, body: AdjustRequest, user: dict = Depends(get_current_user)):
    doc = await find_member_by_scan(code)
    if not doc:
        raise HTTPException(status_code=404, detail="Customer not found")
    code = doc["code"]
    prev_stamps = doc["stamps"]
    prev_reward = doc["reward_ready"]
    stamps = max(0, min(STAMPS_REQUIRED, prev_stamps + body.delta))
    reward_ready = stamps >= STAMPS_REQUIRED
    await db.members.update_one(
        {"code": code}, {"$set": {"stamps": stamps, "reward_ready": reward_ready}})
    doc.update({"stamps": stamps, "reward_ready": reward_ready})
    await record_transaction(code, doc["name"], user["email"], "manual_adjustment",
                             prev_stamps, stamps, prev_reward, reward_ready)
    await notify_wallet_update(code)
    return member_public(doc)


# ---------------------------------------------------------------- routes: grand opening offer
OPENING_OFFER = ["\u2615 Coffee", "\U0001F36A Cookie", "\u2728 Exclusive BrosCafé Sticker"]
OPENING_DATETIME = datetime(2026, 9, 16, 8, 0, 0, tzinfo=ZoneInfo("Europe/Budapest"))


@api_router.get("/opening/status")
async def opening_status():
    now = datetime.now(timezone.utc)
    opening_utc = OPENING_DATETIME.astimezone(timezone.utc)
    return {
        "server_time": now.isoformat(),
        "opening_time": opening_utc.isoformat(),
        "is_open": now >= opening_utc,
    }


@api_router.post("/scan/{code}/opening/reveal")
async def opening_reveal(code: str, user: dict = Depends(get_current_user)):
    doc = await find_member_by_scan(code)
    if not doc:
        raise HTTPException(status_code=404, detail="Customer not found")
    status = doc.get("opening_status", "reserved")
    if status != "redeemed":
        status = "revealed"
        await db.members.update_one({"code": doc["code"]}, {"$set": {"opening_status": status}})
    return {"status": status, "offer": OPENING_OFFER}


@api_router.post("/scan/{code}/opening/redeem")
async def opening_redeem(code: str, user: dict = Depends(get_current_user)):
    doc = await find_member_by_scan(code)
    if not doc:
        raise HTTPException(status_code=404, detail="Customer not found")
    if doc.get("opening_status") == "redeemed":
        raise HTTPException(status_code=400, detail="Opening offer already redeemed")
    await db.members.update_one({"code": doc["code"]}, {"$set": {
        "opening_status": "redeemed",
        "opening_redeemed_at": datetime.now(timezone.utc).isoformat()}})
    await record_transaction(doc["code"], doc["name"], user["email"], "opening_redeemed",
                             doc["stamps"], doc["stamps"], doc["reward_ready"], doc["reward_ready"])
    return {"status": "redeemed", "offer": OPENING_OFFER}


# ---------------------------------------------------------------- routes: analytics tracking (public)
class TrackEvent(BaseModel):
    type: str
    session_id: str
    code: Optional[str] = None
    src: Optional[str] = None


@api_router.post("/track")
async def track_event(body: TrackEvent, request: Request):
    allowed = {"qr_scan", "page_view", "registration_started",
               "registration_completed", "wallet_added"}
    if body.type not in allowed:
        raise HTTPException(status_code=400, detail="Unknown event type")
    device, browser = parse_ua(request.headers.get("user-agent", ""))
    await db.analytics_events.insert_one({
        "id": str(uuid.uuid4()), "type": body.type, "session_id": body.session_id,
        "code": body.code, "src": body.src or "direct",
        "device": device, "browser": browser,
        "at": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


# ---------------------------------------------------------------- routes: admin
@api_router.get("/admin/stats")
async def admin_stats(admin: dict = Depends(require_admin)):
    members = await db.members.count_documents({})
    agg = await db.members.aggregate([
        {"$group": {"_id": None,
                    "coffees": {"$sum": "$total_coffees"},
                    "rewards": {"$sum": "$rewards_redeemed"}}}
    ]).to_list(1)
    coffees = agg[0]["coffees"] if agg else 0
    rewards = agg[0]["rewards"] if agg else 0
    return {"members": members, "coffees": coffees, "rewards_redeemed": rewards}


@api_router.get("/admin/members")
async def admin_members(admin: dict = Depends(require_admin)):
    docs = await db.members.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [member_public(d) for d in docs]


# ---------------------------------------------------------------- routes: settings
class SettingsUpdate(BaseModel):
    active_days: Optional[int] = None
    inactive_days: Optional[int] = None
    new_days: Optional[int] = None
    loyal_cycles: Optional[int] = None
    almost_reward_stamps: Optional[int] = None
    cafe_lat: Optional[float] = None
    cafe_lng: Optional[float] = None


@api_router.get("/admin/settings")
async def read_settings(admin: dict = Depends(require_admin)):
    return await get_settings()


@api_router.put("/admin/settings")
async def write_settings(body: SettingsUpdate, admin: dict = Depends(require_admin)):
    upd = {k: v for k, v in body.model_dump().items() if v is not None}
    if upd:
        await db.settings.update_one({"_id": "config"}, {"$set": upd}, upsert=True)
    return await get_settings()


# ---------------------------------------------------------------- routes: transactions
@api_router.get("/admin/transactions")
async def admin_transactions(admin: dict = Depends(require_admin),
                             limit: int = 200, type: Optional[str] = None,
                             code: Optional[str] = None):
    q = {}
    if type:
        q["type"] = type
    if code:
        q["code"] = code
    return await db.transactions.find(q, {"_id": 0}).sort("at", -1).to_list(limit)


# ---------------------------------------------------------------- routes: analytics
async def _load():
    txs = await db.transactions.find({}, {"_id": 0}).to_list(100000)
    members = await db.members.find({}, {"_id": 0}).to_list(100000)
    events = await db.analytics_events.find({}, {"_id": 0}).to_list(100000)
    return txs, members, events


def _coffee_by_code(txs):
    by = defaultdict(list)
    for t in txs:
        if t["type"] == "coffee_added":
            dt = _parse(t["at"])
            if dt:
                by[t["code"]].append(dt)
    return by


@api_router.get("/admin/analytics/overview")
async def analytics_overview(admin: dict = Depends(require_admin)):
    txs, members, events = await _load()
    settings = await get_settings()

    def in_since(items, key, since, **filt):
        c = 0
        for it in items:
            dt = _parse(it.get(key, ""))
            if dt and dt >= since and all(it.get(k) == v for k, v in filt.items()):
                c += 1
        return c

    def block(since):
        return {
            "qr_scans": in_since(events, "at", since, type="qr_scan"),
            "new_customers": in_since(members, "created_at", since),
            "coffees": in_since(txs, "at", since, type="coffee_added"),
            "rewards_earned": in_since(txs, "at", since, type="reward_earned"),
            "rewards_redeemed": in_since(txs, "at", since, type="reward_redeemed"),
        }

    active_since = _since(settings["active_days"])
    active = {c for c, ds in _coffee_by_code(txs).items() if any(d >= active_since for d in ds)}
    return {
        "today": block(_today_start()),
        "week": block(_since(7)),
        "month": block(_since(30)),
        "totals": {
            "total_customers": len(members),
            "active_customers": len(active),
            "total_coffees": sum(m["total_coffees"] for m in members),
            "total_rewards_redeemed": sum(m["rewards_redeemed"] for m in members),
        },
    }


@api_router.get("/admin/analytics/funnel")
async def analytics_funnel(admin: dict = Depends(require_admin)):
    txs, members, events = await _load()

    def uniq(t):
        return len({e["session_id"] for e in events if e["type"] == t})

    def reached(n):
        return sum(1 for m in members if m["total_coffees"] >= n)

    stages = [
        ("QR Scanned", sum(1 for e in events if e["type"] == "qr_scan")),
        ("Loyalty Page Viewed", uniq("page_view")),
        ("Registration Started", uniq("registration_started")),
        ("Registration Completed", len(members)),
        ("Wallet Card Added", len({e.get("code") for e in events
                                    if e["type"] == "wallet_added" and e.get("code")})),
        ("1st Coffee", reached(1)),
        ("2nd Coffee", reached(2)),
        ("3rd Coffee", reached(3)),
        ("4th Coffee", reached(4)),
        ("Free Coffee Redeemed", sum(1 for m in members if m["rewards_redeemed"] >= 1)),
    ]
    top = max((c for _, c in stages), default=1) or 1
    return [{"stage": s, "count": c, "pct": _pct(c, top)} for s, c in stages]


@api_router.get("/admin/analytics/customers")
async def analytics_customers(admin: dict = Depends(require_admin)):
    txs, members, events = await _load()
    settings = await get_settings()
    now = datetime.now(timezone.utc)
    active_since = now - timedelta(days=settings["active_days"])
    by_code = _coffee_by_code(txs)
    total = len(members)
    new_since = now - timedelta(days=settings["new_days"])
    new = sum(1 for m in members if (_parse(m["created_at"]) or now) >= new_since)
    returning = sum(1 for ds in by_code.values() if len({d.date() for d in ds}) > 1)
    active = len({c for c, ds in by_code.items() if any(d >= active_since for d in ds)})
    inactive = total - active
    total_coffees = sum(m["total_coffees"] for m in members)
    total_visits = sum(len(ds) for ds in by_code.values())
    diffs = []
    for ds in by_code.values():
        ds = sorted(ds)
        diffs += [(ds[i] - ds[i - 1]).total_seconds() / 3600 for i in range(1, len(ds))]
    reg_time = {m["code"]: _parse(m["created_at"]) for m in members}
    ttr = []
    for t in txs:
        if t["type"] == "reward_earned":
            rt, st = _parse(t["at"]), reg_time.get(t["code"])
            if rt and st:
                ttr.append((rt - st).total_seconds() / 3600)
    earned = sum(1 for t in txs if t["type"] == "reward_earned")
    redeemed = sum(1 for t in txs if t["type"] == "reward_redeemed")
    return {
        "total": total, "new": new, "returning": returning,
        "active": active, "inactive": inactive,
        "avg_coffees_per_customer": round(total_coffees / total, 1) if total else 0,
        "avg_visits": round(total_visits / total, 1) if total else 0,
        "avg_hours_between_purchases": round(sum(diffs) / len(diffs), 1) if diffs else 0,
        "avg_hours_to_reward": round(sum(ttr) / len(ttr), 1) if ttr else 0,
        "reward_redemption_rate": _pct(redeemed, earned),
    }


@api_router.get("/admin/analytics/coffee")
async def analytics_coffee(admin: dict = Depends(require_admin)):
    txs, members, events = await _load()
    coffee_tx = [t for t in txs if t["type"] == "coffee_added"]
    now = datetime.now(timezone.utc)

    def cnt(since):
        return sum(1 for t in coffee_tx if (_parse(t["at"]) or now) >= since)

    ncust = len(members) or 1
    daily = []
    for i in range(13, -1, -1):
        day = (now - timedelta(days=i)).date()
        daily.append({"date": day.isoformat()[5:],
                      "count": sum(1 for t in coffee_tx if _parse(t["at"]) and _parse(t["at"]).date() == day)})
    hourly = [{"hour": h, "count": 0} for h in range(24)]
    for t in coffee_tx:
        dt = _parse(t["at"])
        if dt:
            hourly[dt.hour]["count"] += 1
    most = sorted(members, key=lambda m: m["total_coffees"], reverse=True)[:5]
    return {
        "total": len(coffee_tx),
        "today": cnt(_today_start()), "week": cnt(_since(7)),
        "month": cnt(_since(30)), "year": cnt(_since(365)),
        "avg_per_customer": round(len(coffee_tx) / ncust, 1),
        "most_active": [{"name": m["name"], "coffees": m["total_coffees"]}
                        for m in most if m["total_coffees"] > 0],
        "trend_daily": daily, "trend_hourly": hourly,
    }


@api_router.get("/admin/analytics/rewards")
async def analytics_rewards(admin: dict = Depends(require_admin)):
    txs, members, events = await _load()
    earned = sum(1 for t in txs if t["type"] == "reward_earned")
    redeemed = sum(1 for t in txs if t["type"] == "reward_redeemed")
    waiting = sum(1 for m in members if m["reward_ready"])
    reg_time = {m["code"]: _parse(m["created_at"]) for m in members}
    ttr = []
    for t in txs:
        if t["type"] == "reward_earned":
            rt, st = _parse(t["at"]), reg_time.get(t["code"])
            if rt and st:
                ttr.append((rt - st).total_seconds() / 3600)
    return {
        "earned": earned, "redeemed": redeemed, "waiting": waiting,
        "redemption_rate": _pct(redeemed, earned),
        "avg_hours_to_earn": round(sum(ttr) / len(ttr), 1) if ttr else 0,
    }


@api_router.get("/admin/analytics/retention")
async def analytics_retention(admin: dict = Depends(require_admin)):
    txs, members, events = await _load()
    settings = await get_settings()
    now = datetime.now(timezone.utc)
    active_since = now - timedelta(days=settings["active_days"])
    by_code = _coffee_by_code(txs)

    def reached(n):
        return sum(1 for m in members if m["total_coffees"] >= n)

    new_since = now - timedelta(days=settings["new_days"])
    return [
        {"label": "New", "count": sum(1 for m in members if (_parse(m["created_at"]) or now) >= new_since)},
        {"label": "Returning", "count": sum(1 for ds in by_code.values() if len({d.date() for d in ds}) > 1)},
        {"label": "Visited Once", "count": sum(1 for ds in by_code.values() if len(ds) == 1)},
        {"label": "Reached 2", "count": reached(2)},
        {"label": "Reached 4", "count": reached(4)},
        {"label": "Redeemed", "count": sum(1 for m in members if m["rewards_redeemed"] >= 1)},
        {"label": "Churned", "count": sum(1 for ds in by_code.values() if ds and max(ds) < active_since)},
    ]


@api_router.get("/admin/analytics/segments")
async def analytics_segments(admin: dict = Depends(require_admin)):
    txs, members, events = await _load()
    settings = await get_settings()
    now = datetime.now(timezone.utc)
    active_since = now - timedelta(days=settings["active_days"])
    inactive_since = now - timedelta(days=settings["inactive_days"])
    new_since = now - timedelta(days=settings["new_days"])
    almost = settings["almost_reward_stamps"]
    loyal_cycles = settings["loyal_cycles"]
    last_coffee = {}
    for c, ds in _coffee_by_code(txs).items():
        last_coffee[c] = max(ds)
    segs = defaultdict(int)
    for m in members:
        lc = last_coffee.get(m["code"])
        created = _parse(m["created_at"])
        if m["reward_ready"]:
            segs["Reward Available"] += 1
        if m["stamps"] >= almost and not m["reward_ready"]:
            segs["Almost Reward"] += 1
        if m["rewards_redeemed"] >= loyal_cycles:
            segs["Loyal"] += 1
        if lc and lc >= active_since:
            segs["Active"] += 1
        last_activity = lc or created
        if last_activity and last_activity < inactive_since:
            segs["Inactive"] += 1
        if created and created >= new_since and m["total_coffees"] <= 1:
            segs["New"] += 1
    order = ["New", "Active", "Almost Reward", "Reward Available", "Inactive", "Loyal"]
    return [{"segment": k, "count": segs.get(k, 0)} for k in order]


# ---------------------------------------------------------------- email (Emergent-managed Resend)
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "BrosCafé")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "").rstrip("/")


def _assert_safe_email(subject: str, html: str) -> None:
    low = html.lower()
    if any(tag in low for tag in ("<form", "<input", "<textarea", "<select")):
        raise ValueError("No forms/inputs allowed in email (G2)")
    import re as _re
    for m in _re.finditer(r'(?:href|src)\s*=\s*["\']([^"\']+)', html, _re.I):
        u = m.group(1).strip().lower()
        if u.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not u.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https (G3): {u}")


async def send_email(to: str, subject: str, html: str):
    _assert_safe_email(subject, html)
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY missing; email to %s skipped", to)
        return None
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(f"{EMAIL_BASE_URL}/api/v1/email/send",
                         headers={"X-Email-Key": EMAIL_KEY}, json=payload)
    r.raise_for_status()
    return r.json().get("id")


def _email_shell(title, body_html, button_label=None, button_url=None):
    btn = ""
    if button_label and button_url:
        btn = (f'<tr><td style="padding:8px 24px 24px"><a href="{button_url}" '
               f'style="display:inline-block;background:#66734A;color:#F5F0E6;text-decoration:none;'
               f'padding:14px 28px;border-radius:14px;font-weight:600">{escape(button_label)}</a></td></tr>')
    return (f'<table role="presentation" width="100%" style="background:#F5F0E6;padding:24px 0">'
            f'<tr><td align="center"><table role="presentation" width="480" '
            f'style="background:#ffffff;border-radius:20px;font-family:Arial,Helvetica,sans-serif;overflow:hidden">'
            f'<tr><td style="padding:28px 24px 6px;font-size:22px;font-weight:700;color:#2C3322">{escape(title)}</td></tr>'
            f'<tr><td style="padding:0 24px 8px;font-size:15px;line-height:1.6;color:#5b614f">{body_html}</td></tr>'
            f'{btn}'
            f'<tr><td style="padding:16px 24px 24px;font-size:12px;color:#9aa08c">'
            f'Sent by {escape(EMAIL_FROM_NAME)}. We never ask for your password or card details by email. '
            f'You are receiving this because you joined the BrosCafé loyalty program.'
            f'</td></tr></table></td></tr></table>')


async def send_reward_email(name, email):
    body = ('<p>Great news — you have earned a <strong>free coffee</strong> at BrosCafé! 🎉</p>'
            '<p>Open your loyalty card and show it at the counter on your next visit.</p>')
    await send_email(email, "Your BrosCafé reward is ready ☕",
                     _email_shell("Your reward is ready", body))


# ---------------------------------------------------------------- passwordless customer auth
def _hash_token(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()


def create_customer_token(code: str, email: str) -> str:
    payload = {"sub": code, "email": email, "type": "customer",
               "exp": datetime.now(timezone.utc) + timedelta(days=30)}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_customer(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        p = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if p.get("type") != "customer":
            raise HTTPException(status_code=401, detail="Invalid token type")
        m = await db.members.find_one({"code": p["sub"]})
        if not m:
            raise HTTPException(status_code=401, detail="Member not found")
        return m
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class LinkRequest(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None


@api_router.post("/auth/request-link")
async def request_link(body: LinkRequest):
    email = body.email.lower().strip()
    member = await db.members.find_one({"email": email})
    is_new = member is None
    if is_new and not (body.first_name or "").strip():
        return {"ok": True, "is_new": True, "needs_name": True}
    if is_new:
        doc = {"code": uuid.uuid4().hex[:10], "name": (body.first_name or "Friend").strip(),
               "email": email, "stamps": 0, "total_coffees": 0, "rewards_redeemed": 0,
               "reward_ready": False, "created_at": datetime.now(timezone.utc).isoformat()}
        await db.members.insert_one(doc)
        await record_transaction(doc["code"], doc["name"], "customer", "registration", 0, 0, False, False)
        member = doc
    elif body.first_name and member.get("name") in (None, "", "Friend"):
        await db.members.update_one({"email": email}, {"$set": {"name": body.first_name.strip()}})
    raw = secrets.token_urlsafe(32)
    expire_dt = datetime.now(timezone.utc) + timedelta(minutes=20)
    await db.magic_tokens.insert_one({
        "token_hash": _hash_token(raw), "email": email,
        "expires_at": expire_dt.timestamp(), "expire_dt": expire_dt,
        "used": False, "created_at": datetime.now(timezone.utc).isoformat()})
    link = f"{FRONTEND_URL}/auth/verify?token={raw}"
    logger.info("Magic link for %s: %s", email, link)
    subject = "Welcome to BrosCafé ☕" if is_new else "Sign in to your BrosCafé account"
    intro = ("Welcome to BrosCafé! Your loyalty card is ready." if is_new
             else "Here is your secure sign-in link.")
    body_html = (f'<p>{intro}</p><p>Tap the button below to open your BrosCafé account and loyalty '
                 f'card. No password required — this link is valid for 20 minutes.</p>')
    try:
        await send_email(email, subject,
                         _email_shell("Your BrosCafé account", body_html,
                                      "Open My BrosCafé Account", link))
    except Exception as e:
        logger.error("Magic link email failed: %s", e)
    return {"ok": True, "is_new": is_new}


class VerifyRequest(BaseModel):
    token: str


@api_router.post("/auth/verify")
async def verify_link(body: VerifyRequest):
    th = _hash_token(body.token)
    now = datetime.now(timezone.utc).timestamp()
    rec = await db.magic_tokens.find_one({"token_hash": th, "used": False})
    if not rec or rec.get("expires_at", 0) < now:
        raise HTTPException(status_code=400, detail="This link is invalid or has expired. Please request a new one.")
    await db.magic_tokens.update_one({"_id": rec["_id"]}, {"$set": {"used": True}})
    member = await db.members.find_one({"email": rec["email"]})
    if not member:
        raise HTTPException(status_code=404, detail="Account not found")
    token = create_customer_token(member["code"], member["email"])
    return {"token": token, "member": member_public(member)}


@api_router.get("/customer/me")
async def customer_me(member: dict = Depends(get_current_customer)):
    return member_public(member)


class ChangeEmail(BaseModel):
    email: EmailStr


@api_router.post("/customer/change-email")
async def change_email(body: ChangeEmail, member: dict = Depends(get_current_customer)):
    new = body.email.lower().strip()
    other = await db.members.find_one({"email": new})
    if other and other["code"] != member["code"]:
        raise HTTPException(status_code=400, detail="That email is already in use.")
    await db.members.update_one({"code": member["code"]}, {"$set": {"email": new}})
    m = await db.members.find_one({"code": member["code"]})
    return member_public(m)


# ---------------------------------------------------------------- content & products (public)
@api_router.get("/whats-new")
async def whats_new():
    return await db.content.find({}, {"_id": 0}).sort("order", 1).to_list(50)


@api_router.get("/products")
async def list_products():
    return await db.products.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.get("/products/{pid}")
async def get_product(pid: str):
    doc = await db.products.find_one({"id": pid}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc


# Placeholder café menu (editable later). Prices are EUR; HUF shown client-side.
MENU = [
    {"category_en": "Espresso Bar", "category_hu": "Espresso Bár", "items": [
        {"name_en": "Espresso", "name_hu": "Espresso", "price": 2.20},
        {"name_en": "Double Espresso", "name_hu": "Dupla Espresso", "price": 2.80},
        {"name_en": "Cappuccino", "name_hu": "Cappuccino", "price": 3.20},
        {"name_en": "Flat White", "name_hu": "Flat White", "price": 3.50},
        {"name_en": "Caffè Latte", "name_hu": "Caffè Latte", "price": 3.50},
        {"name_en": "Cortado", "name_hu": "Cortado", "price": 3.00},
        {"name_en": "Americano", "name_hu": "Americano", "price": 2.80},
    ]},
    {"category_en": "Filter & Brew", "category_hu": "Filter & Brew", "items": [
        {"name_en": "Batch Brew", "name_hu": "Batch Brew", "price": 2.80},
        {"name_en": "V60 Pour Over", "name_hu": "V60 Kézi Filter", "price": 4.00},
        {"name_en": "Cold Brew", "name_hu": "Cold Brew", "price": 3.80},
    ]},
    {"category_en": "Not Coffee", "category_hu": "Nem Kávé", "items": [
        {"name_en": "Matcha Latte", "name_hu": "Matcha Latte", "price": 3.80},
        {"name_en": "Chai Latte", "name_hu": "Chai Latte", "price": 3.60},
        {"name_en": "Hot Chocolate", "name_hu": "Forró Csokoládé", "price": 3.40},
    ]},
    {"category_en": "Pastries", "category_hu": "Péksütemények", "items": [
        {"name_en": "Butter Croissant", "name_hu": "Vajas Croissant", "price": 2.50},
        {"name_en": "Pain au Chocolat", "name_hu": "Csokis Croissant", "price": 2.80},
        {"name_en": "Cinnamon Roll", "name_hu": "Fahéjas Csiga", "price": 3.20},
        {"name_en": "Banana Bread", "name_hu": "Banánkenyér", "price": 3.00},
    ]},
]


@api_router.get("/menu")
async def get_menu():
    return MENU


# ---------------------------------------------------------------- routes: apple wallet
import secrets as _secrets


async def ensure_wallet_identity(member: dict) -> dict:
    """Provision stable serial, auth token and loyalty token for a member (once)."""
    updates = {}
    if not member.get("wallet_serial"):
        updates["wallet_serial"] = "bros_customer_" + uuid.uuid4().hex[:12]
    if not member.get("wallet_auth_token"):
        updates["wallet_auth_token"] = _secrets.token_urlsafe(24)
    if not member.get("loyalty_token"):
        updates["loyalty_token"] = _secrets.token_urlsafe(24)
    if updates:
        await db.members.update_one({"code": member["code"]}, {"$set": updates})
        member.update(updates)
    return member


def _web_service_url() -> str:
    return f"{FRONTEND_URL}/api/wallet"


async def _build_member_pkpass(doc: dict, lang: str = None) -> bytes:
    await ensure_wallet_identity(doc)
    settings = await get_settings()
    lang = lang or doc.get("wallet_lang", "en")
    return apple_wallet.build_pkpass(
        member_public(doc) | {"name": doc["name"]}, CAFE, settings,
        serial=doc["wallet_serial"], auth_token=doc["wallet_auth_token"],
        barcode_msg=doc["loyalty_token"], web_service_url=_web_service_url(), lang=lang)


@api_router.get("/wallet/config")
async def wallet_config(admin: dict = Depends(require_admin)):
    return apple_wallet.config_status()


@api_router.get("/members/{code}/wallet/apple")
async def apple_wallet_pass(code: str, lang: str = "en"):
    doc = await db.members.find_one({"code": code})
    if not doc:
        raise HTTPException(status_code=404, detail="Loyalty card not found")
    if not apple_wallet.is_configured():
        return {
            "configured": False,
            "message": "Apple Wallet passes are not yet configured. Add your Apple credentials "
                       "(APPLE_TEAM_ID, APPLE_PASS_TYPE_ID, APPLE_CERTIFICATE, APPLE_PRIVATE_KEY, "
                       "APPLE_WWDR_CERTIFICATE) to the backend secrets. See APPLE_WALLET_SETUP.md.",
            "missing": apple_wallet.config_status()["missing"],
        }
    lang = "hu" if str(lang).lower().startswith("hu") else "en"
    await db.members.update_one({"code": code}, {"$set": {"wallet_lang": lang}})
    doc["wallet_lang"] = lang
    try:
        pkpass = await _build_member_pkpass(doc, lang)
    except Exception as e:
        logger.exception("Failed to build pkpass")
        await db.wallet_stats.update_one({"_id": "stats"}, {"$inc": {"gen_failures": 1}}, upsert=True)
        raise HTTPException(status_code=500,
                            detail="We're having trouble creating your Wallet card right now.")
    await db.wallet_stats.update_one({"_id": "stats"}, {"$inc": {"passes_issued": 1}}, upsert=True)
    return Response(
        content=pkpass, media_type="application/vnd.apple.pkpass",
        headers={"Content-Disposition": f'attachment; filename="broscafe-{doc["wallet_serial"]}.pkpass"'})


# ---- Apple PassKit Web Service (spec: /v1/...) --------------------------------
def _apple_pass_auth(request: Request, member: dict):
    header = request.headers.get("Authorization", "")
    token = header[len("ApplePass "):] if header.startswith("ApplePass ") else None
    if not token or not hmac.compare_digest(token, member.get("wallet_auth_token", "")):
        raise HTTPException(status_code=401, detail="Unauthorized")


@api_router.post("/wallet/v1/devices/{device_id}/registrations/{pass_type}/{serial}")
async def wallet_register(device_id: str, pass_type: str, serial: str, request: Request):
    member = await db.members.find_one({"wallet_serial": serial})
    if not member:
        raise HTTPException(status_code=404, detail="Not found")
    _apple_pass_auth(request, member)
    try:
        body = await request.json()
    except Exception:
        body = {}
    existing = await db.wallet_registrations.find_one({"device_id": device_id, "serial": serial})
    await db.wallet_registrations.update_one(
        {"device_id": device_id, "serial": serial},
        {"$set": {"device_id": device_id, "serial": serial, "pass_type": pass_type,
                  "push_token": body.get("pushToken"),
                  "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True)
    return Response(status_code=200 if existing else 201)


@api_router.delete("/wallet/v1/devices/{device_id}/registrations/{pass_type}/{serial}")
async def wallet_unregister(device_id: str, pass_type: str, serial: str, request: Request):
    member = await db.members.find_one({"wallet_serial": serial})
    if member:
        _apple_pass_auth(request, member)
    await db.wallet_registrations.delete_one({"device_id": device_id, "serial": serial})
    return Response(status_code=200)


@api_router.get("/wallet/v1/devices/{device_id}/registrations/{pass_type}")
async def wallet_serials(device_id: str, pass_type: str, passesUpdatedSince: Optional[str] = None):
    regs = await db.wallet_registrations.find(
        {"device_id": device_id, "pass_type": pass_type}, {"_id": 0}).to_list(500)
    serials = [r["serial"] for r in regs]
    if not serials:
        return Response(status_code=204)
    return {"lastUpdated": datetime.now(timezone.utc).isoformat(), "serialNumbers": serials}


@api_router.get("/wallet/v1/passes/{pass_type}/{serial}")
async def wallet_latest_pass(pass_type: str, serial: str, request: Request):
    member = await db.members.find_one({"wallet_serial": serial})
    if not member:
        raise HTTPException(status_code=404, detail="Not found")
    _apple_pass_auth(request, member)
    if not apple_wallet.is_configured():
        raise HTTPException(status_code=503, detail="Wallet not configured")
    pkpass = await _build_member_pkpass(member)
    return Response(content=pkpass, media_type="application/vnd.apple.pkpass",
                    headers={"Last-Modified": member.get("wallet_updated_at",
                             datetime.now(timezone.utc).isoformat())})


@api_router.post("/wallet/v1/log")
async def wallet_log(request: Request):
    try:
        body = await request.json()
        logger.info("Apple Wallet log: %s", str(body)[:500])
    except Exception:
        pass
    return {"ok": True}


@api_router.get("/admin/wallet/status")
async def admin_wallet_status(admin: dict = Depends(require_admin)):
    stats = await db.wallet_stats.find_one({"_id": "stats"}) or {}
    issued = await db.members.count_documents({"wallet_serial": {"$exists": True}})
    registrations = await db.wallet_registrations.count_documents({})
    last = await db.members.find({"wallet_updated_at": {"$exists": True}},
                                 {"_id": 0, "wallet_updated_at": 1}).sort(
        "wallet_updated_at", -1).to_list(1)
    return {
        "config": apple_wallet.config_status(),
        "passes_issued": issued,
        "active_registrations": registrations,
        "last_update": last[0]["wallet_updated_at"] if last else None,
        "generation_failures": stats.get("gen_failures", 0),
        "push_failures": stats.get("push_failures", 0),
    }


# ---------------------------------------------------------------- startup
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id")
    await db.members.create_index("code", unique=True)
    await db.members.create_index("email", unique=True)
    await db.transactions.create_index("at")
    await db.transactions.create_index("code")
    await db.analytics_events.create_index("at")
    await db.analytics_events.create_index("type")
    await db.magic_tokens.create_index("token_hash")
    await db.magic_tokens.create_index("expire_dt", expireAfterSeconds=0)
    await db.members.create_index("wallet_serial")
    await db.members.create_index("loyalty_token")
    await db.wallet_registrations.create_index([("device_id", 1), ("serial", 1)])
    admin_email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if admin_email and admin_password:
        existing = await db.users.find_one({"email": admin_email})
        if existing is None:
            await db.users.insert_one({
                "id": str(uuid.uuid4()), "name": "Bros Cafe Admin",
                "email": admin_email, "password_hash": hash_password(admin_password),
                "role": "admin", "created_at": datetime.now(timezone.utc).isoformat(),
            })
            logger.info("Seeded admin user %s", admin_email)
        elif not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one({"email": admin_email},
                                      {"$set": {"password_hash": hash_password(admin_password)}})
            logger.info("Updated admin password for %s", admin_email)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
