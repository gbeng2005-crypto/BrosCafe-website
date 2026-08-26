import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatError, track } from "@/loyalty/lib/api";
import { BrosLogo } from "@/loyalty/components/BrosLogo";
import { LangToggle } from "@/loyalty/components/LangToggle";
import { LoyaltyCardVisual } from "@/loyalty/components/LoyaltyCardVisual";
import { useLang } from "@/loyalty/i18n";
import { Coffee, Check, InstagramLogo, MapPin, ShieldCheck } from "@phosphor-icons/react";
import { toast } from "sonner";

const HERO_IMG =
  "https://images.unsplash.com/photo-1567880905822-56f8e06fe630?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwc2NhbmRpbmF2aWFuJTIwY2FmZSUyMGludGVyaW9yJTIwd29vZCUyMG5hdHVyYWwlMjBsaWdodHxlbnwwfHx8fDE3ODcxNzQwMzZ8MA&ixlib=rb-4.1.0&q=85";

const PREVIEW = { name: "Jordan", stamps: 3, stamps_required: 4, reward_ready: false, code: "preview" };

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [cafe, setCafe] = useState({ name: "Bros Cafe", address: "", instagram: "" });
  const [open, setOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [findEmail, setFindEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savedCode, setSavedCode] = useState("");
  const trackedRef = useRef(false);

  useEffect(() => {
    api.get("/cafe").then(({ data }) => setCafe(data)).catch(() => {});
    if (!trackedRef.current) {
      trackedRef.current = true;
      track("page_view");
      if (!sessionStorage.getItem("bros_scan_tracked")) {
        sessionStorage.setItem("bros_scan_tracked", "1");
        const src = new URLSearchParams(window.location.search).get("src") || "direct";
        track("qr_scan", { src });
      }
    }
    // If a saved card exists, verify it still exists before showing "view my card".
    const saved = localStorage.getItem("bros_member_code");
    if (saved) {
      api
        .get(`/members/${saved}`)
        .then(() => setSavedCode(saved))
        .catch(() => localStorage.removeItem("bros_member_code"));
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/members", { name, email });
      localStorage.setItem("bros_member_code", data.code);
      track("registration_completed", { code: data.code });
      toast.success(t("toast_card_ready"));
      navigate(`/card/${data.code}`);
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  const findCard = async (e) => {
    e.preventDefault();
    if (!findEmail.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.get(`/find-card`, { params: { email: findEmail } });
      localStorage.setItem("bros_member_code", data.code);
      toast.success(t("toast_welcome_back", { name: data.name }));
      navigate(`/card/${data.code}`);
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bros-cream">
      <div className="mx-auto max-w-md px-6 pb-16">
        {/* top bar */}
        <header className="flex items-center justify-between py-6">
          <BrosLogo />
          <LangToggle />
        </header>

        {/* hero */}
        <section className="animate-fade-up">
          <div className="mb-6 rounded-2xl border border-bros-olive/30 bg-white p-5 text-center" data-testid="opening-teaser">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">{t("opening_badge")}</p>
            <p className="mt-2 font-display text-xl text-bros-ink">{t("opening_teaser")}</p>
            <p className="mt-1 text-sm text-bros-muted">{t("opening_join")}</p>
          </div>
          <div className="overflow-hidden rounded-[2rem] shadow-[0_12px_44px_rgba(102,115,74,0.14)]">
            <img src={HERO_IMG} alt="Bros Cafe interior" className="h-52 w-full object-cover" />
          </div>
          <h1 className="mt-8 font-display text-5xl leading-[1.05] tracking-tight text-bros-ink">
            {t("hero_title_1")}
            <br />
            {t("hero_title_2")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-bros-muted">
            {t("hero_sub_pre")}{" "}
            <span className="font-semibold text-bros-olive">{t("hero_free")}</span>
            {t("hero_sub_post")}
          </p>
        </section>

        {/* card preview */}
        <section className="mt-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <LoyaltyCardVisual member={PREVIEW} showQR={false} />
        </section>

        {/* returning-customer banner */}
        {savedCode && (
          <button
            onClick={() => navigate(`/card/${savedCode}`)}
            data-testid="view-my-card-btn"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-bros-olive bg-white py-3 text-sm font-semibold text-bros-olive transition-colors hover:bg-bros-cream"
          >
            <Coffee size={18} weight="fill" /> {t("view_my_card")}
          </button>
        )}

        {/* CTA */}
        <button
          onClick={() => {
            track("registration_started");
            setOpen(true);
          }}
          data-testid="get-card-btn"
          className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive text-base font-semibold text-white transition-colors hover:bg-bros-olive-dark active:scale-[0.99]"
        >
          <Coffee size={20} weight="fill" /> {t("get_card")}
        </button>

        {/* find existing card */}
        <button
          onClick={() => setFindOpen(true)}
          data-testid="find-card-btn"
          className="mt-3 w-full text-center text-sm font-medium text-bros-olive hover:underline"
        >
          {t("find_card_link")}
        </button>

        {/* trust markers */}
        <ul className="mt-6 space-y-3">
          {[t("trust_1"), t("trust_2"), t("trust_3")].map((tx) => (
            <li key={tx} className="flex items-center gap-3 text-sm text-bros-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(102,115,74,0.12)]">
                <Check size={14} weight="bold" color="#66734A" />
              </span>
              {tx}
            </li>
          ))}
        </ul>

        {/* trust footer */}
        <footer className="mt-12 rounded-2xl border border-bros-border bg-white p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-bros-olive">
            <ShieldCheck size={18} weight="fill" /> {t("official")}
          </div>
          {cafe.address && (
            <p className="mt-3 flex items-center gap-2 text-sm text-bros-muted">
              <MapPin size={16} weight="light" /> {cafe.address}
            </p>
          )}
          {cafe.instagram && (
            <a
              href={cafe.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-2 text-sm text-bros-olive hover:underline"
              data-testid="instagram-link"
            >
              <InstagramLogo size={16} weight="light" /> {t("follow_instagram")}
            </a>
          )}
          <a
            href="/login"
            className="mt-4 inline-block text-xs text-bros-muted hover:text-bros-olive"
            data-testid="staff-login-link"
          >
            {t("staff_login")}
          </a>
        </footer>
      </div>

      {/* signup sheet */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-[2rem] bg-white p-7 sm:rounded-[2rem] animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl text-bros-ink">{t("signup_title")}</h2>
            <p className="mt-1 text-sm text-bros-muted">{t("signup_sub")}</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-bros-muted">
                  {t("label_name")}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jordan"
                  data-testid="signup-name-input"
                  className="mt-1 h-12 w-full rounded-xl border border-bros-border bg-white px-4 text-bros-ink outline-none focus:border-bros-olive focus:ring-2 focus:ring-bros-olive/30"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-bros-muted">
                  {t("label_email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  data-testid="signup-email-input"
                  className="mt-1 h-12 w-full rounded-xl border border-bros-border bg-white px-4 text-bros-ink outline-none focus:border-bros-olive focus:ring-2 focus:ring-bros-olive/30"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                data-testid="signup-submit-btn"
                className="h-14 w-full rounded-2xl bg-bros-olive text-base font-semibold text-white transition-colors hover:bg-bros-olive-dark disabled:opacity-60"
              >
                {submitting ? t("creating") : t("create_card")}
              </button>
              <p className="text-center text-xs leading-relaxed text-bros-muted">
                {t("privacy_note")}
              </p>
            </form>
          </div>
        </div>
      )}
      {/* find-card sheet */}
      {findOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-6"
          onClick={() => setFindOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-[2rem] bg-white p-7 sm:rounded-[2rem] animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl text-bros-ink">{t("find_title")}</h2>
            <p className="mt-1 text-sm text-bros-muted">
              {t("find_sub")}
            </p>
            <form onSubmit={findCard} className="mt-6 space-y-4">
              <input
                type="email"
                value={findEmail}
                onChange={(e) => setFindEmail(e.target.value)}
                placeholder="you@email.com"
                data-testid="find-email-input"
                className="h-12 w-full rounded-xl border border-bros-border bg-white px-4 text-bros-ink outline-none focus:border-bros-olive focus:ring-2 focus:ring-bros-olive/30"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                data-testid="find-submit-btn"
                className="h-14 w-full rounded-2xl bg-bros-olive text-base font-semibold text-white transition-colors hover:bg-bros-olive-dark disabled:opacity-60"
              >
                {submitting ? t("finding") : t("find_card")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
