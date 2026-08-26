import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, priceLabel, track } from "@/loyalty/lib/api";
import { CustomerLayout } from "@/loyalty/components/CustomerLayout";
import { OpeningCountdown } from "@/loyalty/components/OpeningCountdown";
import { BrosMoment } from "@/loyalty/components/BrosMoment";
import { useLang } from "@/loyalty/i18n";
import { Coffee, ArrowRight, Confetti, MapPin } from "@phosphor-icons/react";

const HERO = "https://images.unsplash.com/photo-1567880905822-56f8e06fe630?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";

export default function Home() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [news, setNews] = useState([]);
  const [products, setProducts] = useState([]);
  const [menu, setMenu] = useState([]);
  const [cafe, setCafe] = useState({});
  const [moment, setMoment] = useState(false);

  useEffect(() => {
    track("page_view", { src: "home" });
    api.get("/whats-new").then(({ data }) => setNews(data)).catch(() => {});
    api.get("/products").then(({ data }) => setProducts(data)).catch(() => {});
    api.get("/menu").then(({ data }) => setMenu(data)).catch(() => {});
    api.get("/cafe").then(({ data }) => setCafe(data)).catch(() => {});
  }, []);

  const featured = news[0];
  const previewItems = (menu[0]?.items || []).slice(0, 4);

  return (
    <CustomerLayout>
      {/* Hero */}
      <section className="animate-fade-up" data-testid="home-hero">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bros-olive">{t("home_hero_kicker")}</p>
        <h1 className="mt-2 font-display text-6xl leading-[0.95] tracking-tight text-bros-ink">BROS<br />CAFE</h1>
        <p className="mt-4 text-base text-bros-muted">{t("home_hero_sub")}</p>
        <div className="mt-6 overflow-hidden rounded-[2rem] shadow-[0_12px_44px_rgba(102,115,74,0.14)]">
          <img src={HERO} alt="Bros Cafe" className="h-56 w-full object-cover" />
        </div>
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setMoment(true)}
            data-testid="bros-moment-btn"
            className="flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-bros-olive py-3.5 font-semibold text-white transition-colors hover:bg-bros-olive-dark active:scale-[0.99]"
          >
            <Coffee size={20} weight="fill" /> {t("home_bros_moment")} ☕
          </button>
          <button
            onClick={() => navigate("/opening")}
            data-testid="home-opening-btn"
            className="flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl border border-bros-olive bg-white py-3.5 font-semibold text-bros-olive transition-colors hover:bg-bros-cream"
          >
            <Confetti size={20} weight="fill" /> {t("home_see_opening")}
          </button>
        </div>
      </section>

      {/* Grand Opening countdown */}
      <button
        onClick={() => navigate("/opening")}
        data-testid="home-countdown"
        className="mt-8 block w-full rounded-[2rem] border border-bros-olive/15 bg-white/60 p-6 text-left shadow-[0_12px_44px_rgba(102,115,74,0.10)] animate-fade-up"
      >
        <OpeningCountdown variant="hero" />
      </button>

      {/* Menu preview */}
      {previewItems.length > 0 && (
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl text-bros-ink">{t("home_menu_title")}</h2>
            <button onClick={() => navigate("/menu")} className="flex items-center gap-1 text-sm text-bros-olive" data-testid="home-view-menu">
              {t("home_view_full_menu")} <ArrowRight size={14} />
            </button>
          </div>
          <div className="rounded-[1.75rem] border border-bros-border bg-white p-5 shadow-[0_8px_30px_rgba(102,115,74,0.06)]">
            {previewItems.map((it, idx) => (
              <div key={it.name_en} className={`flex items-baseline justify-between gap-4 py-2.5 ${idx > 0 ? "border-t border-bros-border/60" : ""}`}>
                <span className="text-bros-ink">{lang === "hu" ? it.name_hu : it.name_en}</span>
                <span className="whitespace-nowrap text-sm text-bros-olive">{priceLabel(it.price)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Loyalty invite (subtle) */}
      <section className="mt-10 rounded-[2rem] border border-bros-olive/25 bg-white p-7 text-center shadow-[0_8px_30px_rgba(102,115,74,0.06)] animate-fade-up" data-testid="home-loyalty-invite">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bros-olive">{t("home_loyalty_kicker")}</p>
        <p className="mt-3 font-display text-2xl text-bros-ink">{t("home_loyalty_line")}</p>
        <p className="mt-2 text-sm text-bros-muted">{t("home_loyalty_explain")}</p>
        <button
          onClick={() => navigate("/loyalty")}
          data-testid="home-loyalty-btn"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-bros-olive px-6 py-3 text-sm font-semibold text-bros-olive transition-colors hover:bg-bros-cream"
        >
          {t("home_learn_more")} <ArrowRight size={16} />
        </button>
      </section>

      {/* What's New preview */}
      {featured && (
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl text-bros-ink">{t("whats_new_title")}</h2>
            <button onClick={() => navigate("/whats-new")} className="flex items-center gap-1 text-sm text-bros-olive">
              {t("home_explore")} <ArrowRight size={14} />
            </button>
          </div>
          <button onClick={() => navigate("/whats-new")} className="w-full overflow-hidden rounded-[1.75rem] border border-bros-border bg-white text-left shadow-[0_8px_30px_rgba(102,115,74,0.06)]">
            <img src={featured.image} alt="" className="h-44 w-full object-cover" />
            <div className="p-5">
              <p className="font-display text-xl text-bros-ink">{lang === "hu" ? featured.title_hu : featured.title_en}</p>
              <p className="mt-1 text-sm text-bros-muted">{lang === "hu" ? featured.body_hu : featured.body_en}</p>
            </div>
          </button>
        </section>
      )}

      {/* Collection preview */}
      {products.length > 0 && (
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl text-bros-ink">{t("collection_title")}</h2>
            <button onClick={() => navigate("/shop")} className="flex items-center gap-1 text-sm text-bros-olive">
              {t("home_explore")} <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 2).map((p) => (
              <button key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="overflow-hidden rounded-2xl border border-bros-border bg-white text-left">
                <img src={p.image} alt="" className="h-32 w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm font-medium text-bros-ink">{lang === "hu" ? p.name_hu : p.name_en}</p>
                  <p className="mt-0.5 text-xs text-bros-olive">{priceLabel(p.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Visit us */}
      <button
        onClick={() => navigate("/contact")}
        data-testid="home-visit"
        className="mt-10 flex w-full items-center gap-4 rounded-[1.75rem] border border-bros-border bg-white p-6 text-left shadow-[0_8px_30px_rgba(102,115,74,0.06)]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(102,115,74,0.12)]">
          <MapPin size={22} weight="fill" color="#66734A" />
        </span>
        <div>
          <p className="font-display text-lg text-bros-ink">{t("home_visit_title")}</p>
          <p className="mt-0.5 text-sm text-bros-muted">{cafe.address || t("home_visit_cta")}</p>
        </div>
      </button>

      <BrosMoment open={moment} onClose={() => setMoment(false)} />
    </CustomerLayout>
  );
}
