import React, { useEffect, useState } from "react";
import { api, track } from "@/loyalty/lib/api";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { useLang } from "@/loyalty/i18n";
import { MapPin, Clock, InstagramLogo, ArrowUpRight } from "@phosphor-icons/react";

export default function Contact() {
  const { t } = useLang();
  const [cafe, setCafe] = useState({});

  useEffect(() => {
    track("page_view", { src: "contact" });
    api.get("/cafe").then(({ data }) => setCafe(data)).catch(() => {});
  }, []);

  const mapsUrl = cafe.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.address)}`
    : "#";
  const igUrl = cafe.instagram
    ? `https://instagram.com/${cafe.instagram.replace(/^@/, "")}`
    : null;

  return (
    <CustomerLayout>
      <h1 className="font-display text-4xl text-bros-ink">{t("contact_title")}</h1>

      <div className="mt-8 space-y-4" data-testid="contact-info">
        <div className="rounded-[1.75rem] border border-bros-border bg-white p-6 shadow-[0_8px_30px_rgba(102,115,74,0.06)]">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(102,115,74,0.12)]">
              <MapPin size={20} weight="fill" color="#66734A" />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">{t("contact_address_title")}</p>
              <p className="mt-1 text-bros-ink">{cafe.address || "1132 Budapest, Csanády u. 4.b"}</p>
              <a href={mapsUrl} target="_blank" rel="noreferrer" data-testid="contact-directions" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-bros-olive hover:underline">
                {t("contact_find_us")} <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-bros-border bg-white p-6 shadow-[0_8px_30px_rgba(102,115,74,0.06)]">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(102,115,74,0.12)]">
              <Clock size={20} weight="fill" color="#66734A" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">{t("contact_hours_title")}</p>
              <p className="mt-1 text-bros-ink">{cafe.hours_weekdays || "Mon–Fri · 7:30–19:00"}</p>
              <p className="text-bros-ink">{cafe.hours_weekend || "Sat–Sun · 9:00–18:00"}</p>
            </div>
          </div>
        </div>

        {igUrl && (
          <a href={igUrl} target="_blank" rel="noreferrer" data-testid="contact-instagram" className="flex items-center gap-4 rounded-[1.75rem] border border-bros-border bg-white p-6 shadow-[0_8px_30px_rgba(102,115,74,0.06)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(102,115,74,0.12)]">
              <InstagramLogo size={20} weight="fill" color="#66734A" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">{t("contact_follow")}</p>
              <p className="mt-1 text-bros-ink">{cafe.instagram}</p>
            </div>
          </a>
        )}
      </div>
    </CustomerLayout>
  );
}
