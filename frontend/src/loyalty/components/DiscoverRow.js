import { useApp } from "@/store/AppStore";
import { getProduct } from "@/data/products";
import { lp } from "@/data/products.hu";
import { STR } from "@/i18n";

const FEATURED = ["cappuccino", "croissant", "bros-mug"];

// "Discover something new" — same products, same modal as the main website.
export function DiscoverRow() {
  const { openProduct, lang } = useApp();
  const t = STR[lang].discoverRow;
  const picks = FEATURED.map(getProduct).filter(Boolean);

  return (
    <div className="mt-10" data-testid="loyalty-discover">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bros-olive">{t.title}</p>
      <p className="mt-1 font-serif-display text-lg italic text-bros-muted">{t.sub}</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {picks.map((p) => {
          const l = lp(p, lang);
          return (
            <button
              key={p.id}
              data-testid={`discover-${p.id}`}
              onClick={() => openProduct(p.id)}
              className="group text-left"
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={p.images[0]}
                  alt={l.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <p className="mt-2 font-serif-display text-sm font-medium leading-tight text-bros-ink">{l.name}</p>
              <p className="text-xs text-bros-muted">{l.price}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
