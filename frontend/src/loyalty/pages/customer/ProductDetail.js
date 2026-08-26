import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, priceLabel } from "@/loyalty/lib/api";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { useLang } from "@/loyalty/i18n";
import { ArrowLeft, ShoppingBag } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [p, setP] = useState(null);
  const [option, setOption] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => {
      setP(data);
      setOption((data.options && data.options[0]) || "");
    }).catch(() => setP(false));
  }, [id]);

  if (p === false)
    return <CustomerLayout><p className="mt-10 text-center text-bros-muted">—</p></CustomerLayout>;
  if (!p) return <CustomerLayout><div className="mt-10" /></CustomerLayout>;

  return (
    <CustomerLayout>
      <button onClick={() => navigate("/shop")} className="mb-4 flex items-center gap-2 text-sm text-bros-olive">
        <ArrowLeft size={16} /> {t("collection_title")}
      </button>
      <div className="overflow-hidden rounded-[1.75rem] border border-bros-border bg-white shadow-[0_8px_30px_rgba(102,115,74,0.06)]">
        <img src={p.image} alt="" className="h-72 w-full object-cover" />
        <div className="p-6">
          <h1 className="font-display text-3xl text-bros-ink" data-testid="product-name">{lang === "hu" ? p.name_hu : p.name_en}</h1>
          <p className="mt-1 text-lg font-semibold text-bros-olive">{priceLabel(p.price)}</p>
          <p className="mt-3 text-sm leading-relaxed text-bros-muted">{lang === "hu" ? p.desc_hu : p.desc_en}</p>

          {p.options && p.options.length > 1 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-bros-muted">{t("options_label")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.options.map((o) => (
                  <button
                    key={o}
                    onClick={() => setOption(o)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      option === o ? "border-bros-olive bg-bros-olive text-white" : "border-bros-border bg-white text-bros-ink"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => toast(t("cart_soon"))}
            data-testid="add-to-cart"
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive font-semibold text-white transition-colors hover:bg-bros-olive-dark"
          >
            <ShoppingBag size={20} weight="fill" /> {t("add_to_cart")}
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
