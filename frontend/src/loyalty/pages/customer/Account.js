import React from "react";
import { useNavigate } from "react-router-dom";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { OpeningCountdown } from "@/loyalty/components/OpeningCountdown";
import { useCustomer } from "@/loyalty/context/CustomerAuthContext";
import { useLang } from "@/loyalty/i18n";
import { formatError } from "@/loyalty/lib/api";
import { Coffee, Gift, DeviceMobile, SignOut, PencilSimple } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function Account() {
  const navigate = useNavigate();
  const { member, changeEmail, logout } = useCustomer();
  const { t, lang } = useLang();
  if (!member) return null;

  const since = new Date(member.created_at).toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", { month: "long", year: "numeric" });
  const required = member.stamps_required || 4;

  const doChangeEmail = async () => {
    const email = window.prompt(t("change_email_prompt"), member.email);
    if (!email || email === member.email) return;
    try { await changeEmail(email); toast.success(t("email_changed")); }
    catch (err) { toast.error(formatError(err.response?.data?.detail)); }
  };

  const Row = ({ title, children }) => (
    <div className="rounded-2xl border border-bros-border bg-white p-6 shadow-[0_8px_30px_rgba(102,115,74,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );

  return (
    <CustomerLayout>
      <h1 className="font-display text-4xl text-bros-ink">{member.name}</h1>
      <p className="mt-1 text-sm text-bros-muted">{t("member_since")} {since}</p>

      <div className="mt-6 space-y-4">
        <Row title={t("your_loyalty")}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-bros-ink"><Coffee size={20} weight="fill" color="#66734A" /> {member.stamps} / {required}</span>
            <button onClick={() => navigate(`/card/${member.code}`)} data-testid="account-open-card" className="rounded-xl border border-bros-olive px-4 py-2 text-sm font-semibold text-bros-olive">
              {t("open_my_card")}
            </button>
          </div>
        </Row>

        <Row title={t("opening_offer_title")}>
          {member.opening_status === "redeemed" ? (
            <p className="text-sm font-semibold text-bros-olive">{t("opening_redeemed")}</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-bros-olive">{t("opening_status_reserved")}</p>
              <p className="mt-1 text-xs text-bros-muted">{t("opening_reveal_date")}</p>
              <div className="mt-4" data-testid="account-countdown">
                <OpeningCountdown variant="compact" />
              </div>
              <button onClick={() => navigate(`/card/${member.code}`)} data-testid="show-opening-pass"
                className="mt-4 rounded-xl border border-bros-olive px-4 py-2 text-sm font-semibold text-bros-olive">
                {t("show_opening_pass")}
              </button>
            </>
          )}
        </Row>

        <Row title={t("rewards_title")}>
          <p className="flex items-center gap-2 text-bros-ink">
            <Gift size={20} weight="fill" color="#66734A" /> {t("rewards_available_n", { n: member.reward_ready ? 1 : 0 })}
          </p>
        </Row>

        <Row title={t("wallet_title")}>
          <div className="space-y-3">
            <button onClick={() => { window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/members/${member.code}/wallet/apple?lang=${lang}`; }} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-bros-olive font-semibold text-white">
              <DeviceMobile size={18} weight="fill" /> {t("add_apple")}
            </button>
            <button onClick={() => toast(t("google_soon"))} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-bros-olive bg-white font-semibold text-bros-olive">
              <DeviceMobile size={18} /> {t("add_google")}
            </button>
          </div>
        </Row>

        <Row title={t("account_title")}>
          <p className="text-sm text-bros-muted">{t("email_label")}: <span className="text-bros-ink">{member.email}</span></p>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={doChangeEmail} data-testid="change-email-btn" className="flex items-center gap-2 text-sm font-medium text-bros-olive">
              <PencilSimple size={16} /> {t("change_email")}
            </button>
            <button onClick={() => { logout(); toast(t("logged_out")); navigate("/"); }} data-testid="logout-btn" className="flex items-center gap-2 text-sm font-medium text-bros-muted hover:text-bros-ink">
              <SignOut size={16} /> {t("log_out")}
            </button>
          </div>
        </Row>
      </div>
    </CustomerLayout>
  );
}
