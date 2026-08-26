import React from "react";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { useLang } from "@/loyalty/i18n";
import { priceLabel, track } from "@/loyalty/lib/api";
import { useApp } from "@/store/AppStore";
import { PRODUCTS } from "@/data/products";
import { lp } from "@/data/products.hu";
import { useEffect } from "react";

const GROUPS = ["coffee", "cold", "food", "sweet"];

export default function Menu() {
  const { t, lang } = useLang();
  const { openProduct, catalogVersion } = useApp();
  void catalogVersion; // re-render when the shared catalog hydrates

  useEffect(() => {
    track("page_view", { src: "menu" });
  }, []);

  return (
    <CustomerLayout>
      <h1 className="font-display text-4xl text-bros-ink">{t("menu_title")}</h1>
      <p className="mt-2 text-sm text-bros-muted">{t("menu_sub")}</p>

      <div className="mt-8 space-y-8" data-testid="menu-list">
        {GROUPS.map((g) => {
          const items = PRODUCTS.filter((p) => p.cat === g);
          if (!items.length) return null;
          return (
            <section key={g} className="animate-fade-up">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bros-olive">
                {t(`cat_${g}`)}
              </h2>
              <div className="mt-3 rounded-[1.75rem] border border-bros-border bg-white p-5 shadow-[0_8px_30px_rgba(102,115,74,0.06)]">
                {items.map((p, idx) => {
                  const l = lp(p, lang);
                  return (
                    <button
                      key={p.id}
                      onClick={() => openProduct(p.id)}
                      data-testid={`menu-item-${p.id}`}
                      className={`flex w-full items-baseline justify-between gap-4 py-3 text-left transition-all duration-300 hover:pl-2 ${idx > 0 ? "border-t border-bros-border/60" : ""}`}
                    >
                      <span className="font-display text-xl text-bros-ink">{l.name}</span>
                      <span className="whitespace-nowrap text-sm font-medium text-bros-olive">{priceLabel(Number(p.price))}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </CustomerLayout>
  );
}
