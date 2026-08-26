import React from "react";
import { useNavigate } from "react-router-dom";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { OpeningCountdown } from "@/loyalty/components/OpeningCountdown";
import { LoyaltyProgress } from "@/loyalty/components/LoyaltyProgress";
import { useCustomer } from "@/loyalty/context/CustomerAuthContext";
import { useLang } from "@/loyalty/i18n";
import { formatError } from "@/loyalty/lib/api";
import { Coffee, Gift, DeviceMobile, SignOut, PencilSimple, ArrowRight, Heart, Newspaper } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useApp } from "@/store/AppStore";
import { getProduct } from "@/data/products";
import { lp } from "@/data/products.hu";

export default function Account() {
  const navigate = useNavigate();
  const { member, changeEmail, logout } = useCustomer();
  const { t, lang } = useLang();
  const { favorites, openProduct } = useApp();
  if (!member) return null;

  const since = new Date(member.created_at).toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", { month: "long", year: "numeric" });
  const required = member.stamps_required || 4;
  const favs = favorites.map(getProduct).filter(Boolean);

  const doChangeEmail = async () => {
    const email = window.prompt(t("change_email_prompt"), member.email);
    if (!email || email === member.email) return;
    try { await changeEmail(email); toast.success(t("email_changed")); }
    catch (err) { toast.error(formatError(err.response?.data?.detail)); }
  };

  const Row = ({ title, children, testid }) => (
    <div data-testid={testid} className="rounded-3xl border border-bros-border bg-white p-6 shadow-[0_8px_30px_rgba(102,115,74,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );

  return (
    <CustomerLayout>
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-bros-olive/70">{t("account_greeting")}</p>
      <h1 className="mt-1 font-display text-5xl italic text-bros-ink">{member.name}.</h1>
      <p className="mt-2 text-sm text-bros-muted">{t("member_since")} {since}</p>

      <div className="mt-8 space-y-4">
        <button
          onClick={() => navigate("/loyalty")}
          data-testid="account-loyalty"
          className="block w-full rounded-3xl border border-bros-border bg-white p-6 text-left shadow-[0_8px_30px_rgba(102,115,74,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(102,115,74,0.1)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">{t("your_loyalty")}</p>
            <ArrowRight size={16} className="text-bros-muted" />
          </div>
          <p className="mt-3 font-display text-3xl text-bros-ink">
            <Coffee size={22} weight="fill" color="#66734A" className="mr-2 inline" />
            {member.stamps} / {required}
          </p>
          <div className="mt-3"><LoyaltyProgress stamps={member.stamps} required={required} size={20} /></div>
          {member.reward_ready && (
            <p className="mt-3 text-sm font-semibold text-bros-olive">{t("celebrate_title")}</p>
          )}
        </button>

        <Row title={t("opening_offer_title")} testid="account-opening">
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

        <Row title={t("rewards_title")} testid="account-rewards">
          <p className="flex items-center gap-2 text-bros-ink">
            <Gift size={20} weight="fill" color="#66734A" /> {t("rewards_available_n", { n: member.reward_ready ? 1 : 0 })}
          </p>
        </Row>

        {favs.length > 0 && (
          <Row title={t("account_picks")} testid="account-picks">
            <div className="flex flex-wrap gap-2.5">
              {favs.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openProduct(p.id)}
                  data-testid={`account-pick-${p.id}`}
                  className="flex items-center gap-2 rounded-xl bg-bros-cream px-3 py-2 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <img src={p.images[0]} alt="" className="h-8 w-8 rounded-lg object-cover" />
                  <span className="text-sm font-medium text-bros-ink">{lp(p, lang).name}</span>
                  <Heart size={11} weight="fill" color="#66734A" />
                </button>
              ))}
            </div>
          </Row>
        )}

        <Row title={t("account_whatsnew")} testid="account-news">
          <button onClick={() => navigate("/whats-new")} className="flex items-center gap-2 text-sm font-medium text-bros-olive">
            <Newspaper size={16} /> {t("account_whatsnew")}
            <ArrowRight size={14} />
          </button>
        </Row>

        <Row title={t("wallet_title")} testid="account-wallet">
          <div className="space-y-3">
            <button onClick={() => { window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/members/${member.code}/wallet/apple?lang=${lang}`; }} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-bros-olive font-semibold text-white">
              <DeviceMobile size={18} weight="fill" /> {t("add_apple")}
            </button>
            <button onClick={() => toast(t("google_soon"))} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-bros-olive bg-white font-semibold text-bros-olive">
              <DeviceMobile size={18} /> {t("add_google")}
            </button>
          </div>
        </Row>

        <Row title={t("account_title")} testid="account-settings">
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
