import React, { useEffect, useState } from "react";
import { api } from "@/loyalty/lib/api";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { useLang } from "@/loyalty/i18n";

export default function WhatsNew() {
  const { t, lang } = useLang();
  const [news, setNews] = useState([]);
  useEffect(() => { api.get("/whats-new").then(({ data }) => setNews(data)).catch(() => {}); }, []);

  return (
    <CustomerLayout>
      <h1 className="font-display text-4xl text-bros-ink">{t("whats_new_title")}</h1>
      <div className="mt-6 space-y-8" data-testid="whats-new-list">
        {news.map((n) => (
          <article key={n.id} className="overflow-hidden rounded-[1.75rem] border border-bros-border bg-white shadow-[0_8px_30px_rgba(102,115,74,0.06)] animate-fade-up">
            <img src={n.image} alt="" className="h-52 w-full object-cover" />
            <div className="p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bros-olive">
                {n.kind === "drink" ? t("nav_new") : t("nav_new")}
              </p>
              <h2 className="mt-1 font-display text-2xl text-bros-ink">{lang === "hu" ? n.title_hu : n.title_en}</h2>
              <p className="mt-2 text-sm leading-relaxed text-bros-muted">{lang === "hu" ? n.body_hu : n.body_en}</p>
            </div>
          </article>
        ))}
      </div>
    </CustomerLayout>
  );
}
