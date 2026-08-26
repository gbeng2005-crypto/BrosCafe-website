import React from "react";
import { useNavigate } from "react-router-dom";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { OpeningCountdown } from "@/loyalty/components/OpeningCountdown";
import { useCustomer } from "@/loyalty/context/CustomerAuthContext";
import { useLang } from "@/loyalty/i18n";
import { Coffee, ArrowRight, Lock } from "@phosphor-icons/react";

export default function Opening() {
  const navigate = useNavigate();
  const { member } = useCustomer();
  const { t } = useLang();

  return (
    <CustomerLayout>
      <section className="text-center animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bros-olive">{t("opening_grand_title")}</p>
        <h1 className="mt-2 font-display text-5xl leading-[1.05] tracking-tight text-bros-ink">BROS CAFE</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-bros-muted">{t("opening_date_line")}</p>
      </section>

      <div className="mt-8 rounded-[2rem] border border-bros-olive/15 bg-white/60 p-6 shadow-[0_12px_44px_rgba(102,115,74,0.10)] animate-fade-up">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-bros-olive">{t("opening_opens_in")}</p>
        <OpeningCountdown variant="hero" showHeader={false} />
      </div>

      {/* Mystery teaser (never reveals contents) */}
      <div className="mt-6 rounded-[1.5rem] border border-bros-olive/30 bg-white p-6 text-center animate-fade-up" data-testid="opening-mystery-teaser">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bros-olive">{t("opening_teaser_headline")}</p>
        <p className="mt-2 text-sm text-bros-muted">{t("opening_teaser_body")}</p>
      </div>

      {member && member.opening_status !== "redeemed" ? (
        <div className="mt-6 rounded-[1.75rem] border border-bros-olive/40 bg-white p-6 text-center animate-fade-up" data-testid="opening-pass">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bros-olive">🎟️ {t("opening_pass_title")}</p>
          <p className="mt-2 font-display text-2xl text-bros-ink">September 16, 2026 · 8:00 AM</p>
          <p className="mt-2 text-sm font-semibold text-bros-olive">{t("opening_badge")}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-bros-olive"><Lock size={15} weight="fill" /> {t("opening_status_reserved")}</p>
          <p className="mt-2 text-sm text-bros-muted">{t("opening_come_discover")}</p>
        </div>
      ) : member && member.opening_status === "redeemed" ? (
        <div className="mt-6 rounded-[1.75rem] border border-bros-olive/40 bg-white p-6 text-center animate-fade-up" data-testid="opening-redeemed">
          <p className="font-semibold text-bros-olive">{t("opening_redeemed")}</p>
        </div>
      ) : (
        <div className="mt-6 rounded-[1.75rem] border border-bros-border bg-white p-6 text-center shadow-[0_8px_30px_rgba(102,115,74,0.06)] animate-fade-up" data-testid="opening-join">
          <p className="font-display text-2xl text-bros-ink">{t("opening_join_list")}</p>
          <p className="mt-1 text-sm text-bros-muted">{t("opening_join_sub")}</p>
          <button
            onClick={() => navigate("/loyalty")}
            data-testid="opening-join-btn"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-bros-olive px-6 py-3.5 font-semibold text-white transition-colors hover:bg-bros-olive-dark"
          >
            <Coffee size={20} weight="fill" /> {t("loyalty_get_card")} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </CustomerLayout>
  );
}
