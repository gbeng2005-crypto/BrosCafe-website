import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, priceLabel } from "@/loyalty/lib/api";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { useLang } from "@/loyalty/i18n";

export default function Shop() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [products, setProducts] = useState([]);
  useEffect(() => { api.get("/products").then(({ data }) => setProducts(data)).catch(() => {}); }, []);

  return (
    <CustomerLayout>
      <h1 className="font-display text-4xl text-bros-ink">{t("collection_title")}</h1>
      <p className="mt-2 text-sm text-bros-muted">{t("collection_sub")}</p>
      <div className="mt-6 grid grid-cols-2 gap-4" data-testid="product-grid">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
            data-testid={`product-${p.id}`}
            className="overflow-hidden rounded-2xl border border-bros-border bg-white text-left transition-transform active:scale-[0.98]"
          >
            <img src={p.image} alt="" className="h-40 w-full object-cover" />
            <div className="p-4">
              <p className="text-sm font-medium text-bros-ink">{lang === "hu" ? p.name_hu : p.name_en}</p>
              <p className="mt-1 text-sm text-bros-olive">{priceLabel(p.price)}</p>
            </div>
          </button>
        ))}
      </div>
    </CustomerLayout>
  );
}
