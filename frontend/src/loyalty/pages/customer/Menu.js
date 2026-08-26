import React, { useEffect, useState } from "react";
import { api, priceLabel, track } from "@/loyalty/lib/api";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { useLang } from "@/loyalty/i18n";

export default function Menu() {
  const { t, lang } = useLang();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    track("page_view", { src: "menu" });
    api.get("/menu").then(({ data }) => setMenu(data)).catch(() => {});
  }, []);

  return (
    <CustomerLayout>
      <h1 className="font-display text-4xl text-bros-ink">{t("menu_title")}</h1>
      <p className="mt-2 text-sm text-bros-muted">{t("menu_sub")}</p>

      <div className="mt-8 space-y-8" data-testid="menu-list">
        {menu.map((cat) => (
          <section key={cat.category_en} className="animate-fade-up">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bros-olive">
              {lang === "hu" ? cat.category_hu : cat.category_en}
            </h2>
            <div className="mt-3 rounded-[1.75rem] border border-bros-border bg-white p-5 shadow-[0_8px_30px_rgba(102,115,74,0.06)]">
              {cat.items.map((it, idx) => (
                <div key={it.name_en} className={`flex items-baseline justify-between gap-4 py-3 ${idx > 0 ? "border-t border-bros-border/60" : ""}`}>
                  <span className="text-bros-ink">{lang === "hu" ? it.name_hu : it.name_en}</span>
                  <span className="whitespace-nowrap text-sm font-medium text-bros-olive">{priceLabel(it.price)}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </CustomerLayout>
  );
}
