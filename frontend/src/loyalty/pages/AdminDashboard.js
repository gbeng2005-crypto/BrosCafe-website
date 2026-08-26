import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { api, formatError } from "@/loyalty/lib/api";
import { useAuth } from "@/loyalty/context/AuthContext";
import { BrosLogo } from "@/loyalty/components/BrosLogo";
import {
  Users, Coffee, Gift, ScanSmiley, SignOut, Plus, X, Gear, FunnelSimple, ChartLine,
  ArrowsClockwise, UsersThree, ListChecks, Wallet,
} from "@phosphor-icons/react";
import { toast } from "sonner";

const OLIVE = "#66734A";
const OLIVE_SOFT = "#A8B187";
const CREAM = "#F5F0E6";
const INK = "#2C3322";

const TABS = [
  { id: "overview", label: "Overview", icon: ChartLine },
  { id: "funnel", label: "Funnel", icon: FunnelSimple },
  { id: "customers", label: "Customers", icon: Users },
  { id: "coffee", label: "Coffee", icon: Coffee },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "retention", label: "Retention", icon: ArrowsClockwise },
  { id: "segments", label: "Segments", icon: UsersThree },
  { id: "transactions", label: "Transactions", icon: ListChecks },
  { id: "members", label: "Members", icon: UsersThree },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

const StatTile = ({ value, label, sub, testid }) => (
  <div className="rounded-2xl border border-bros-border bg-white p-5 shadow-[0_8px_30px_rgba(102,115,74,0.05)]" data-testid={testid}>
    <p className="font-display text-4xl leading-none text-bros-ink">{value}</p>
    <p className="mt-2 text-sm text-bros-muted">{label}</p>
    {sub && <p className="mt-0.5 text-xs text-bros-olive">{sub}</p>}
  </div>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div className={`rounded-2xl border border-bros-border bg-white p-6 shadow-[0_8px_30px_rgba(102,115,74,0.05)] ${className}`}>
    {title && <h3 className="mb-4 font-display text-xl text-bros-ink">{title}</h3>}
    {children}
  </div>
);

const chartTooltip = {
  contentStyle: { background: "#fff", border: `1px solid #E8E2D2`, borderRadius: 12, fontSize: 12 },
  cursor: { fill: "rgba(102,115,74,0.06)" },
};

// ---- individual tab panels ------------------------------------------------
function OverviewPanel() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/admin/analytics/overview").then((r) => setD(r.data)).catch(() => {}); }, []);
  if (!d) return <Loading />;
  const Block = ({ title, b, extra }) => (
    <SectionCard title={title}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile value={b.qr_scans} label="QR scans" />
        <StatTile value={b.new_customers} label="New customers" />
        <StatTile value={b.coffees} label="Coffees" />
        {extra ? <StatTile value={b.rewards_redeemed} label="Rewards redeemed" />
               : <StatTile value={b.rewards_redeemed} label="Rewards redeemed" />}
      </div>
    </SectionCard>
  );
  return (
    <div className="space-y-6" data-testid="overview-panel">
      <Block title="Today" b={d.today} />
      <Block title="This Week" b={d.week} />
      <Block title="This Month" b={d.month} />
      <SectionCard title="All-time Totals">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile value={d.totals.total_customers} label="Total customers" testid="total-customers" />
          <StatTile value={d.totals.active_customers} label="Active customers" />
          <StatTile value={d.totals.total_coffees} label="Coffees served" />
          <StatTile value={d.totals.total_rewards_redeemed} label="Free coffees given" />
        </div>
      </SectionCard>
    </div>
  );
}

function FunnelPanel() {
  const [rows, setRows] = useState(null);
  useEffect(() => { api.get("/admin/analytics/funnel").then((r) => setRows(r.data)).catch(() => {}); }, []);
  if (!rows) return <Loading />;
  return (
    <SectionCard title="Conversion Funnel" >
      <div className="space-y-3" data-testid="funnel-panel">
        {rows.map((s, i) => (
          <div key={s.stage} className="flex items-center gap-4">
            <div className="w-44 shrink-0 text-sm text-bros-ink">{s.stage}</div>
            <div className="relative h-9 flex-1 overflow-hidden rounded-lg bg-bros-cream">
              <div className="flex h-full items-center rounded-lg px-3 text-sm font-semibold text-white transition-all"
                   style={{ width: `${Math.max(s.pct, 6)}%`, backgroundColor: OLIVE, opacity: 1 - i * 0.06 }}>
                {s.count}
              </div>
            </div>
            <div className="w-14 shrink-0 text-right text-sm text-bros-muted">{s.pct}%</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function CustomersPanel() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/admin/analytics/customers").then((r) => setD(r.data)).catch(() => {}); }, []);
  if (!d) return <Loading />;
  const days = (h) => (h >= 48 ? `${Math.round(h / 24)}d` : `${h}h`);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-testid="customers-panel">
      <StatTile value={d.total} label="Total customers" />
      <StatTile value={d.new} label="New (recent)" />
      <StatTile value={d.returning} label="Returning" />
      <StatTile value={d.active} label="Active" />
      <StatTile value={d.inactive} label="Inactive" />
      <StatTile value={d.avg_coffees_per_customer} label="Avg coffees / customer" />
      <StatTile value={d.avg_visits} label="Avg visits" />
      <StatTile value={days(d.avg_hours_between_purchases)} label="Avg between visits" />
      <StatTile value={days(d.avg_hours_to_reward)} label="Avg time to reward" />
      <StatTile value={`${d.reward_redemption_rate}%`} label="Redemption rate" />
    </div>
  );
}

function CoffeePanel() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/admin/analytics/coffee").then((r) => setD(r.data)).catch(() => {}); }, []);
  if (!d) return <Loading />;
  return (
    <div className="space-y-6" data-testid="coffee-panel">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatTile value={d.today} label="Today" />
        <StatTile value={d.week} label="This week" />
        <StatTile value={d.month} label="This month" />
        <StatTile value={d.year} label="This year" />
        <StatTile value={d.total} label="All time" />
      </div>
      <SectionCard title="Daily trend (last 14 days)">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={d.trend_daily} margin={{ left: -20, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D2" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7A826E" }} />
            <YAxis tick={{ fontSize: 11, fill: "#7A826E" }} allowDecimals={false} />
            <Tooltip {...chartTooltip} />
            <Line type="monotone" dataKey="count" stroke={OLIVE} strokeWidth={2.5} dot={{ r: 3, fill: OLIVE }} />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>
      <SectionCard title="Purchases by hour of day">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={d.trend_hourly} margin={{ left: -20, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D2" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#7A826E" }} />
            <YAxis tick={{ fontSize: 11, fill: "#7A826E" }} allowDecimals={false} />
            <Tooltip {...chartTooltip} />
            <Bar dataKey="count" fill={OLIVE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
      <SectionCard title="Most active customers">
        <div className="space-y-2" data-testid="most-active">
          {d.most_active.length === 0 && <p className="text-sm text-bros-muted">No purchases yet.</p>}
          {d.most_active.map((m, i) => (
            <div key={i} className="flex items-center justify-between border-b border-bros-border py-2 last:border-0">
              <span className="text-sm text-bros-ink">{i + 1}. {m.name}</span>
              <span className="text-sm font-semibold text-bros-olive">{m.coffees} coffees</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function RewardsPanel() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/admin/analytics/rewards").then((r) => setD(r.data)).catch(() => {}); }, []);
  if (!d) return <Loading />;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" data-testid="rewards-panel">
      <StatTile value={d.earned} label="Rewards Earned" />
      <StatTile value={d.redeemed} label="Rewards Redeemed" />
      <StatTile value={d.waiting} label="Rewards Waiting" />
      <StatTile value={`${d.redemption_rate}%`} label="Redemption rate" />
      <StatTile value={d.avg_hours_to_earn >= 48 ? `${Math.round(d.avg_hours_to_earn / 24)}d` : `${d.avg_hours_to_earn}h`} label="Avg time to earn" />
    </div>
  );
}

function RetentionPanel() {
  const [rows, setRows] = useState(null);
  useEffect(() => { api.get("/admin/analytics/retention").then((r) => setRows(r.data)).catch(() => {}); }, []);
  if (!rows) return <Loading />;
  return (
    <SectionCard title="Customer retention">
      <div data-testid="retention-panel">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rows} margin={{ left: -20, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D2" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#7A826E" }} interval={0} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11, fill: "#7A826E" }} allowDecimals={false} />
            <Tooltip {...chartTooltip} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {rows.map((_, i) => <Cell key={i} fill={i % 2 ? OLIVE_SOFT : OLIVE} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

function SegmentsPanel() {
  const [rows, setRows] = useState(null);
  useEffect(() => { api.get("/admin/analytics/segments").then((r) => setRows(r.data)).catch(() => {}); }, []);
  if (!rows) return <Loading />;
  return (
    <div className="space-y-6" data-testid="segments-panel">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {rows.map((s) => <StatTile key={s.segment} value={s.count} label={s.segment} />)}
      </div>
      <p className="text-xs text-bros-muted">
        Segments can overlap (a customer may be both Active and Almost Reward). Adjust thresholds in Settings.
      </p>
    </div>
  );
}

function TransactionsPanel() {
  const [rows, setRows] = useState(null);
  useEffect(() => { api.get("/admin/transactions?limit=150").then((r) => setRows(r.data)).catch(() => {}); }, []);
  if (!rows) return <Loading />;
  const LABEL = {
    registration: ["Registration", "#7A826E"], coffee_added: ["Coffee added", OLIVE],
    reward_earned: ["Reward earned", "#B8860B"], reward_redeemed: ["Reward redeemed", "#8B5E3C"],
    manual_adjustment: ["Manual adjust", "#7A826E"],
  };
  return (
    <SectionCard title="Staff transaction history">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" data-testid="transactions-table">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-bros-muted">
              <th className="py-2 pr-4 font-semibold">When</th>
              <th className="py-2 pr-4 font-semibold">Customer</th>
              <th className="py-2 pr-4 font-semibold">Type</th>
              <th className="py-2 pr-4 font-semibold">Balance</th>
              <th className="py-2 pr-4 font-semibold">By</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-bros-muted">No transactions yet.</td></tr>}
            {rows.map((t) => {
              const [lbl, color] = LABEL[t.type] || [t.type, INK];
              return (
                <tr key={t.id} className="border-t border-bros-border">
                  <td className="py-3 pr-4 text-bros-muted">{new Date(t.at).toLocaleString()}</td>
                  <td className="py-3 pr-4 text-bros-ink">{t.customer_name}</td>
                  <td className="py-3 pr-4"><span className="font-medium" style={{ color }}>{lbl}</span></td>
                  <td className="py-3 pr-4 text-bros-ink">{t.prev_stamps} → {t.new_stamps}</td>
                  <td className="py-3 pr-4 text-bros-muted">{t.employee}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function MembersPanel() {
  const [members, setMembers] = useState(null);
  useEffect(() => { api.get("/admin/members").then((r) => setMembers(r.data)).catch(() => {}); }, []);
  if (!members) return <Loading />;
  return (
    <SectionCard title={`Members (${members.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" data-testid="members-table">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-bros-muted">
              <th className="py-2 pr-4 font-semibold">Name</th>
              <th className="py-2 pr-4 font-semibold">Email</th>
              <th className="py-2 pr-4 font-semibold">Progress</th>
              <th className="py-2 pr-4 font-semibold">Coffees</th>
              <th className="py-2 pr-4 font-semibold">Rewards</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.code} className="border-t border-bros-border">
                <td className="py-3 pr-4 font-medium text-bros-ink">{m.name}</td>
                <td className="py-3 pr-4 text-bros-muted">{m.email}</td>
                <td className="py-3 pr-4">
                  {m.reward_ready
                    ? <span className="rounded-full bg-[rgba(102,115,74,0.12)] px-3 py-1 text-xs font-semibold text-bros-olive">Reward ready</span>
                    : <span className="text-bros-ink">{m.stamps} / {m.stamps_required}</span>}
                </td>
                <td className="py-3 pr-4 text-bros-ink">{m.total_coffees}</td>
                <td className="py-3 pr-4 text-bros-ink">{m.rewards_redeemed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

const Loading = () => (
  <div className="flex items-center justify-center py-20">
    <Coffee size={34} weight="fill" color={OLIVE} className="animate-pulse" />
  </div>
);

function WalletPanel() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/admin/wallet/status").then((r) => setD(r.data)).catch(() => {}); }, []);
  if (!d) return <Loading />;
  const c = d.config;
  const badge = c.configured ? ["Live", "#66734A"] : ["Not configured", "#8B5E3C"];
  return (
    <div className="space-y-6" data-testid="wallet-panel">
      <SectionCard title="Apple Wallet integration">
        <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: badge[1] }}>
          {badge[0]}
        </span>
        {!c.configured && (
          <div className="mt-4 rounded-xl bg-bros-cream p-4 text-sm">
            <p className="font-semibold text-bros-ink">Add these secrets to enable native passes:</p>
            <ul className="mt-2 list-disc pl-5 text-bros-muted">
              {c.missing.map((m) => (<li key={m}><code className="text-bros-ink">{m}</code></li>))}
            </ul>
            <p className="mt-3 text-xs text-bros-muted">See APPLE_WALLET_SETUP.md. Never paste private keys here — use backend secrets.</p>
          </div>
        )}
      </SectionCard>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile value={d.passes_issued} label="Passes issued" />
        <StatTile value={d.active_registrations} label="Device registrations" />
        <StatTile value={d.generation_failures} label="Generation failures" />
        <StatTile value={d.push_failures} label="Push failures" />
      </div>
      <SectionCard title="Last pass update">
        <p className="text-sm text-bros-ink">{d.last_update ? new Date(d.last_update).toLocaleString() : "—"}</p>
      </SectionCard>
    </div>
  );
}

// ---- main -----------------------------------------------------------------
export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [showStaff, setShowStaff] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: "", email: "", password: "", role: "staff" });
  const [settings, setSettings] = useState(null);

  const openSettings = async () => {
    try { const { data } = await api.get("/admin/settings"); setSettings(data); setShowSettings(true); }
    catch (err) { toast.error(formatError(err.response?.data?.detail)); }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put("/admin/settings", {
        active_days: Number(settings.active_days), inactive_days: Number(settings.inactive_days),
        new_days: Number(settings.new_days), loyal_cycles: Number(settings.loyal_cycles),
        almost_reward_stamps: Number(settings.almost_reward_stamps),
      });
      toast.success("Settings saved");
      setShowSettings(false);
    } catch (err) { toast.error(formatError(err.response?.data?.detail)); }
  };

  const createStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post("/staff", staffForm);
      toast.success("Staff member added");
      setShowStaff(false);
      setStaffForm({ name: "", email: "", password: "", role: "staff" });
    } catch (err) { toast.error(formatError(err.response?.data?.detail)); }
  };

  const PANELS = {
    overview: <OverviewPanel />, funnel: <FunnelPanel />, customers: <CustomersPanel />,
    coffee: <CoffeePanel />, rewards: <RewardsPanel />, retention: <RetentionPanel />,
    segments: <SegmentsPanel />, transactions: <TransactionsPanel />, members: <MembersPanel />,
    wallet: <WalletPanel />,
  };

  return (
    <div className="min-h-screen bg-bros-cream">
      <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <BrosLogo />
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/staff")} className="flex items-center gap-2 text-sm font-medium text-bros-olive hover:underline" data-testid="go-scanner-btn">
              <ScanSmiley size={18} weight="light" /> Scanner
            </button>
            <button onClick={openSettings} data-testid="open-settings-btn" className="text-bros-muted hover:text-bros-olive"><Gear size={20} weight="light" /></button>
            <button onClick={logout} data-testid="admin-logout-btn" className="text-bros-muted hover:text-bros-olive"><SignOut size={20} weight="light" /></button>
          </div>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bros-olive">Bros Cafe</p>
            <h1 className="mt-1 font-display text-4xl text-bros-ink">Loyalty Analytics</h1>
          </div>
          <button onClick={() => setShowStaff(true)} data-testid="add-staff-btn"
                  className="flex w-fit items-center gap-2 rounded-xl bg-bros-olive px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-bros-olive-dark">
            <Plus size={18} weight="bold" /> Add Staff
          </button>
        </div>

        {/* tab bar */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} data-testid={`tab-${t.id}`}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-bros-olive text-white" : "bg-white text-bros-ink border border-bros-border hover:border-bros-olive"}`}>
                <Icon size={16} weight={active ? "fill" : "light"} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">{PANELS[tab]}</div>
      </div>

      {showStaff && (
        <Modal onClose={() => setShowStaff(false)} title="Add Staff">
          <form onSubmit={createStaff} className="space-y-4">
            {["name", "email", "password"].map((f) => (
              <input key={f} type={f === "password" ? "password" : f === "email" ? "email" : "text"}
                value={staffForm[f]} onChange={(e) => setStaffForm({ ...staffForm, [f]: e.target.value })}
                placeholder={f[0].toUpperCase() + f.slice(1)} data-testid={`staff-${f}-input`} required
                className="h-12 w-full rounded-xl border border-bros-border bg-white px-4 text-bros-ink outline-none focus:border-bros-olive focus:ring-2 focus:ring-bros-olive/30" />
            ))}
            <select value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} data-testid="staff-role-select"
              className="h-12 w-full rounded-xl border border-bros-border bg-white px-4 text-bros-ink outline-none focus:border-bros-olive">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" data-testid="staff-submit-btn" className="h-14 w-full rounded-2xl bg-bros-olive font-semibold text-white hover:bg-bros-olive-dark">Create</button>
          </form>
        </Modal>
      )}

      {showSettings && settings && (
        <Modal onClose={() => setShowSettings(false)} title="Analytics Settings">
          <form onSubmit={saveSettings} className="space-y-4" data-testid="settings-form">
            {[
              ["active_days", "Active if purchased within (days)"],
              ["inactive_days", "Inactive if no purchase for (days)"],
              ["new_days", "New customer window (days)"],
              ["almost_reward_stamps", "'Almost reward' at (stamps)"],
              ["loyal_cycles", "Loyal after (rewards redeemed)"],
            ].map(([k, lbl]) => (
              <div key={k}>
                <label className="text-xs font-semibold uppercase tracking-wide text-bros-muted">{lbl}</label>
                <input type="number" min="1" value={settings[k]} data-testid={`setting-${k}`}
                  onChange={(e) => setSettings({ ...settings, [k]: e.target.value })}
                  className="mt-1 h-12 w-full rounded-xl border border-bros-border bg-white px-4 text-bros-ink outline-none focus:border-bros-olive focus:ring-2 focus:ring-bros-olive/30" />
              </div>
            ))}
            <button type="submit" data-testid="settings-save-btn" className="h-14 w-full rounded-2xl bg-bros-olive font-semibold text-white hover:bg-bros-olive-dark">Save</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={onClose}>
    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[2rem] bg-white p-8" onClick={(e) => e.stopPropagation()}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-bros-ink">{title}</h2>
        <button onClick={onClose} className="text-bros-muted"><X size={22} /></button>
      </div>
      {children}
    </div>
  </div>
);
