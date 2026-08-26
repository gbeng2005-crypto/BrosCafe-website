import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { LoyaltyProgress } from "@/loyalty/components/LoyaltyProgress";
import { Coffee } from "@phosphor-icons/react";
import markOlive from "@/loyalty/assets/mark-olive.png";
import { useLang } from "@/loyalty/i18n";

// The visual loyalty / wallet card. Used on the customer card page and previews.
export const LoyaltyCardVisual = ({ member, showQR = true, animateLast = false }) => {
  const { t } = useLang();
  const required = member.stamps_required || 4;
  const remaining = required - member.stamps;
  const reward = member.reward_ready;

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-bros-border bg-white p-7 text-center shadow-[0_10px_40px_rgba(102,115,74,0.10)] ${
        reward ? "animate-reward-glow" : ""
      }`}
      data-testid="loyalty-card-visual"
    >
      {/* header band */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <img src={markOlive} alt="" className="h-6 w-auto" />
          <span className="font-display text-lg tracking-tight text-bros-ink">BrosCafé</span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">
          <Coffee size={14} weight="fill" /> {t("loyalty_club")}
        </span>
      </div>

      <div className="mt-6">
        {reward ? (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bros-olive">
              {t("card_reward_ready")}
            </p>
            <h3 className="mt-1 font-display text-3xl leading-tight text-bros-ink">{t("card_free_coffee")}</h3>
            <p className="mt-1 text-sm text-bros-muted">{t("card_show_counter")}</p>
          </>
        ) : (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bros-muted">
              {t("card_member")}
            </p>
            <h3 className="mt-1 font-display text-3xl leading-tight text-bros-ink" data-testid="card-member-name">
              {member.name}
            </h3>
            <p className="mt-1 text-sm text-bros-muted" data-testid="card-progress-text">
              {member.stamps} / {required} ·{" "}
              {remaining === 1 ? t("card_remaining_one") : t("card_remaining_many", { n: remaining })}
            </p>
          </>
        )}
      </div>

      <div className="mt-6">
        <LoyaltyProgress stamps={member.stamps} required={required} animateLast={animateLast} size={28} />
      </div>

      {showQR && (
        <div className="mt-7 flex flex-col items-center">
          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_18px_rgba(44,51,34,0.08)] ring-1 ring-bros-border">
            <QRCodeSVG
              value={member.code}
              size={148}
              level="M"
              fgColor="#2C3322"
              bgColor="#FFFFFF"
              data-testid="member-qr-code"
            />
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-bros-muted">
            {t("card_scan_counter")}
          </p>
        </div>
      )}
    </div>
  );
};

export default LoyaltyCardVisual;
