import React from "react";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { useLang } from "@/loyalty/i18n";
import { useApp } from "@/store/AppStore";
import { PRODUCTS } from "@/data/products";
import { lp } from "@/data/products.hu";
import { Coffee } from "@phosphor-icons/react";

export default function Shop() {
  const { t, lang } = useLang();
  const { openProduct, catalogVersion } = useApp();
  void catalogVersion;
  const merch = PRODUCTS.filter((p) => p.cat === "merch");

  return (
    <CustomerLayout>
      <div className="pt-2">
        <div className="steam mb-1 flex gap-1.5 text-bros-olive/60" aria-hidden="true">
          <span /><span /><span />
        </div>
        <Coffee size={32} weight="light" color="#66734A" />
        <h1 className="mt-4 font-display text-4xl text-bros-ink">{t("collection_title")}</h1>
        <p className="mt-5 font-display text-6xl italic leading-none text-bros-olive">{t("coming_soon")}</p>
        <p className="mt-4 text-sm text-bros-muted">{t("shop_not_ready")} {t("shop_brewing")}</p>
      </div>

      <div className="mt-10 space-y-5" data-testid="product-grid">
        {merch.map((p, i) => {
          const l = lp(p, lang);
          return (
            <button
              key={p.id}
              onClick={() => openProduct(p.id)}
              data-testid={`product-${p.id}`}
              className={`group block w-full overflow-hidden rounded-3xl border border-bros-border bg-white text-left shadow-[0_10px_30px_rgba(102,115,74,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(102,115,74,0.12)] ${i % 2 === 1 ? "md:ml-14" : ""}`}
            >
              <div className="overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={l.name}
                  loading="lazy"
                  className="h-52 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:h-64"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-display text-xl text-bros-ink">{l.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-bros-muted">{l.desc}</p>
                </div>
                <span className="shrink-0 rounded-full border border-bros-olive/40 px-3 py-1 text-[9px] font-semibold tracking-[0.2em] text-bros-olive">
                  {t("coming_soon")}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-8 text-center text-xs text-bros-muted">{t("collection_sub")}</p>
    </CustomerLayout>
  );
}
