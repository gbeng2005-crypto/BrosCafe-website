import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { LoyaltyProgress } from "@/loyalty/components/LoyaltyProgress";
import { DiscoverRow } from "@/loyalty/components/DiscoverRow";
import { useCustomer } from "@/loyalty/context/CustomerAuthContext";
import { useLang } from "@/loyalty/i18n";
import { formatError } from "@/loyalty/lib/api";
import { Coffee, EnvelopeSimple, Gift, DeviceMobile, ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function Loyalty() {
  const navigate = useNavigate();
  const { member, requestLink } = useCustomer();
  const { t, lang } = useLang();
  const [params] = useSearchParams();
  const isWelcome = params.get("welcome") === "1";

  const [mode, setMode] = useState("register"); // register | login
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      await requestLink(email.trim(), mode === "register" ? firstName.trim() : undefined);
      setSentTo(email.trim());
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  // checking session
  if (member === null) {
    return <CustomerLayout><div className="flex h-64 items-center justify-center"><Coffee size={36} weight="fill" color="#66734A" className="animate-pulse" /></div></CustomerLayout>;
  }

  // ---- authenticated: personalized loyalty ----
  if (member) {
    const required = member.stamps_required || 4;
    const remaining = required - member.stamps;
    const openApple = () => { window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/members/${member.code}/wallet/apple?lang=${lang}`; };
    return (
      <CustomerLayout>
        {isWelcome && (
          <div className="mb-6 rounded-[1.75rem] border border-bros-olive/30 bg-white p-6 text-center animate-fade-up" data-testid="loyalty-welcome-banner">
            <CheckCircle size={34} weight="fill" color="#66734A" className="mx-auto" />
            <h1 className="mt-3 font-display text-3xl text-bros-ink">{t("welcome_new_title")}</h1>
            <p className="mt-1 text-sm text-bros-muted">{t("welcome_new_sub")}</p>
          </div>
        )}

        <p className="font-display text-3xl text-bros-ink animate-fade-up" data-testid="loyalty-welcome-back">
          {t("loyalty_welcome_back", { name: member.name })} ☕
        </p>

        <div className="mt-6 rounded-[2rem] border border-bros-border bg-white p-7 text-center shadow-[0_10px_40px_rgba(102,115,74,0.08)] animate-fade-up">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bros-olive">{t("loyalty_your_loyalty")}</p>
          <p className="mt-2 font-display text-5xl text-bros-ink" data-testid="loyalty-stamps">{member.stamps} / {required}</p>
          <div className="mt-5"><LoyaltyProgress stamps={member.stamps} required={required} size={26} /></div>

          {member.reward_ready ? (
            <div className="mt-5" data-testid="loyalty-free-ready">
              <p className="font-display text-2xl text-bros-olive">{t("loyalty_free_ready")}</p>
              <p className="mt-1 text-sm text-bros-muted">{t("loyalty_free_ready_sub")}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-bros-muted">
              {remaining === 1 ? t("loyalty_one_more") : t("loyalty_n_more", { n: remaining })}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button onClick={() => navigate(`/card/${member.code}`)} data-testid="loyalty-open-wallet-card" className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive font-semibold text-white transition-colors hover:bg-bros-olive-dark">
            <Coffee size={20} weight="fill" /> {t("loyalty_open_wallet_card")}
          </button>
          <button onClick={openApple} data-testid="loyalty-add-apple" className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-bros-olive bg-white font-semibold text-bros-olive transition-colors hover:bg-bros-cream">
            <DeviceMobile size={18} weight="fill" /> {t("add_apple")}
          </button>
          <button onClick={() => toast(t("google_soon"))} data-testid="loyalty-add-google" className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-bros-border bg-white font-semibold text-bros-muted">
            <DeviceMobile size={18} /> {t("add_google")}
          </button>
        </div>

        <DiscoverRow />
      </CustomerLayout>
    );
  }

  // ---- guest: link sent confirmation ----
  if (sentTo) {
    return (
      <CustomerLayout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(102,115,74,0.12)]">
            <EnvelopeSimple size={30} weight="fill" color="#66734A" />
          </span>
          <h1 className="mt-6 font-display text-3xl text-bros-ink">{t("check_inbox_title")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-bros-muted" data-testid="loyalty-check-inbox">{t("check_inbox_body", { email: sentTo })}</p>
          <button onClick={() => setSentTo("")} className="mt-8 text-sm font-medium text-bros-olive hover:underline">← {t("back_to_register")}</button>
        </div>
      </CustomerLayout>
    );
  }

  // ---- guest: pitch + signup / login ----
  return (
    <CustomerLayout>
      <section className="animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-bros-olive">{t("home_loyalty_kicker")}</p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] text-bros-ink">{t("loyalty_hero_title")}</h1>
      </section>

      <section className="mt-8 rounded-[1.75rem] border border-bros-border bg-white p-6 shadow-[0_8px_30px_rgba(102,115,74,0.06)] animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">{t("loyalty_how_title")}</p>
        <ol className="mt-4 space-y-3">
          {[t("loyalty_step_1"), t("loyalty_step_2"), t("loyalty_step_3"), t("loyalty_step_4")].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-bros-olive text-xs font-semibold text-white">{i + 1}</span>
              <span className="text-sm text-bros-ink">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <form onSubmit={submit} className="mt-8 space-y-4" data-testid="loyalty-form">
        <p className="font-display text-2xl text-bros-ink">{mode === "register" ? t("loyalty_form_title") : t("loyalty_login_title")}</p>
        <p className="-mt-2 text-sm text-bros-muted">{mode === "register" ? t("loyalty_form_sub") : t("loyalty_login_sub")}</p>
        {mode === "register" && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-bros-muted">{t("label_first_name")}</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jordan" required data-testid="loyalty-firstname"
              className="mt-1 h-12 w-full rounded-xl border border-bros-border bg-white px-4 outline-none focus:border-bros-olive focus:ring-2 focus:ring-bros-olive/30" />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-bros-muted">{t("label_email")}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required data-testid="loyalty-email"
            className="mt-1 h-12 w-full rounded-xl border border-bros-border bg-white px-4 outline-none focus:border-bros-olive focus:ring-2 focus:ring-bros-olive/30" />
        </div>
        <button type="submit" disabled={busy} data-testid="loyalty-submit"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive text-base font-semibold text-white transition-colors hover:bg-bros-olive-dark disabled:opacity-60">
          <Coffee size={20} weight="fill" /> {mode === "register" ? t("loyalty_create_cta") : t("loyalty_login_cta")}
        </button>
      </form>

      <button onClick={() => setMode(mode === "register" ? "login" : "register")} data-testid="loyalty-toggle-mode"
        className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-medium text-bros-olive hover:underline">
        {mode === "register" ? <><Gift size={14} /> {t("loyalty_already_member")}</> : <><ArrowLeft size={14} /> {t("back_to_register")}</>}
      </button>

      <p className="mt-8 text-center text-xs leading-relaxed text-bros-muted">{t("privacy_note")}</p>
    </CustomerLayout>
  );
}
