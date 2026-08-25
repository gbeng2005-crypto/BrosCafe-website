import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, Coffee, Plus, Check, ChevronDown } from "lucide-react";
import { useApp } from "@/store/AppStore";
import { getProduct, getRelated } from "@/data/products";
import { lp } from "@/data/products.hu";
import { STR } from "@/i18n";

const EASE = [0.22, 1, 0.36, 1];

const FLAVOR_KEYS = ["bitterSweet", "lightBold", "milkyCreamy", "hotIced"];

function FlavorBar({ left, right, value, testid }) {
  return (
    <div data-testid={testid}>
      <div className="flex justify-between text-[9px] font-semibold tracking-[0.25em] text-[#66734A]/55">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <div className="relative mt-2 h-[3px] rounded-full bg-[#66734A]/15">
        <motion.span
          initial={{ left: "50%", opacity: 0 }}
          animate={{ left: `${value}%`, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F5F0E6] bg-[#66734A] shadow"
        />
      </div>
    </div>
  );
}

function BehindTheCup({ steps, label }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[#66734A]/12 pt-5">
      <button
        data-testid="behind-cup-toggle"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-[11px] font-semibold tracking-[0.3em] text-[#66734A]"
      >
        {label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ol
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-0 border-l border-[#66734A]/25 pl-5">
              {steps.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.45, ease: EASE }}
                  className="relative pb-4 text-sm text-[#66734A]/80 last:pb-1"
                >
                  <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#F5F0E6] bg-[#66734A]" />
                  {s}
                </motion.li>
              ))}
            </div>
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniCard({ id, testid }) {
  const { openProduct, lang } = useApp();
  const p = lp(getProduct(id), lang);
  if (!p) return null;
  return (
    <button
      data-testid={testid}
      onClick={() => openProduct(id)}
      className="group flex items-center gap-3 rounded-2xl bg-white p-2.5 text-left shadow-[0_8px_20px_rgba(102,115,74,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(102,115,74,0.12)]"
    >
      <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-xl object-cover" />
      <div>
        <p className="font-serif-display text-sm font-medium text-[#66734A]">{p.name}</p>
        <p className="text-[11px] text-[#66734A]/55">{p.price}</p>
      </div>
    </button>
  );
}

function ModalBody({ product: raw }) {
  const { favorites, toggleFavorite, day, addToDay, lang } = useApp();
  const t = STR[lang].modal;
  const product = lp(raw, lang);
  const [slide, setSlide] = useState(0);
  const [added, setAdded] = useState(false);
  const fav = favorites.includes(product.id);

  const media = [
    ...(product.video ? [{ type: "video", src: product.video }] : []),
    ...product.images.map((src) => ({ type: "img", src })),
  ];
  const current = media[Math.min(slide, media.length - 1)];
  const inDay = day.includes(product.id) || added;

  useEffect(() => setAdded(false), [product.id]);

  const onDragEnd = (e, info) => {
    if (info.offset.x < -60 && slide < media.length - 1) setSlide(slide + 1);
    else if (info.offset.x > 60 && slide > 0) setSlide(slide - 1);
  };

  return (
    <div className="grid h-full grid-rows-[45svh_1fr] md:grid-cols-2 md:grid-rows-1">
      {/* Gallery */}
      <div className="relative overflow-hidden bg-white md:h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id + slide}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="group/gal h-full w-full"
            data-cursor={current.type === "video" ? "play" : undefined}
          >
            {current.type === "video" ? (
              <video src={current.src} autoPlay muted loop playsInline className="h-full w-full cursor-grab object-cover" />
            ) : (
              <motion.img
                layoutId={slide === 0 || !product.video ? `pm-${product.id}` : undefined}
                src={current.src}
                alt={product.name}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={onDragEnd}
                className="h-full w-full cursor-grab object-cover transition-transform duration-500 group-hover/gal:scale-[1.03] active:cursor-grabbing"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-[#F5F0E6]/85 p-2 backdrop-blur">
            {media.map((m, i) => (
              <button
                key={i}
                data-testid={`modal-thumb-${i}`}
                aria-label={`View image ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-10 w-10 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                  i === slide ? "border-[#66734A]" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {m.type === "video" ? (
                  <span className="flex h-full w-full items-center justify-center bg-[#66734A] text-[8px] font-bold text-[#F5F0E6]">PLAY</span>
                ) : (
                  <img src={m.src} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
        {product.cat === "merch" && product.images.length > 2 && (
          <p className="absolute left-4 top-4 rounded-full bg-[#66734A]/85 px-4 py-1.5 text-[9px] font-semibold tracking-[0.25em] text-[#F5F0E6]">
            {t.drag}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="no-scrollbar overflow-y-auto bg-[#F5F0E6] px-6 pb-24 pt-6 md:h-full md:px-9 md:pb-10 md:pt-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.55, ease: EASE }}>
              <p className="text-[10px] font-semibold tracking-[0.35em] text-[#66734A]/50">{t.cats[product.cat] || product.cat.toUpperCase()}</p>
              <div className="mt-1 flex items-start justify-between gap-4">
                <h2 className="font-serif-display text-4xl font-medium tracking-tight text-[#66734A] md:text-5xl">{product.name}</h2>
                <span className="font-serif-display mt-2 text-2xl italic text-[#66734A]/80">{product.price}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#66734A]/75">{product.desc}</p>
            </motion.div>

            {product.flavor && (
              <motion.div
                variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.55, ease: EASE }}
                className="mt-7 space-y-4 rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(102,115,74,0.06)]"
              >
                <p className="text-[10px] font-semibold tracking-[0.3em] text-[#66734A]/50">{t.flavor}</p>
                {FLAVOR_KEYS.map((key, i) => (
                  <FlavorBar key={key} testid={`flavor-${key}`} left={t.pairs_scale[i][0]} right={t.pairs_scale[i][1]} value={product.flavor[key]} />
                ))}
              </motion.div>
            )}

            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.55, ease: EASE }} className="mt-7 space-y-4">
              {product.sizes && product.sizes.length > 1 && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-[#66734A]/50">{t.size}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <span key={s} className="rounded-full border border-[#66734A]/25 px-4 py-1.5 text-xs text-[#66734A]">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {product.temp && product.temp !== "hot" && (
                <div className="flex gap-2">
                  {(product.temp === "both" ? ["hot", "iced"] : [product.temp]).map((k) => (
                    <span key={k} className="rounded-full bg-[#66734A]/10 px-4 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-[#66734A]">{k === "hot" ? t.hot : t.iced}</span>
                  ))}
                </div>
              )}
              {product.material && <p className="text-xs text-[#66734A]/65">{product.material}</p>}
              {product.ingredients && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-[#66734A]/50">{t.inside}</p>
                  <p className="mt-1.5 text-sm text-[#66734A]/75">{product.ingredients.join(" · ")}</p>
                </div>
              )}
              {product.allergens && product.allergens.length > 0 && (
                <p className="text-[11px] text-[#66734A]/55">{t.allergens} {product.allergens.map((a) => (t.allergenMap && t.allergenMap[a]) || a).join(", ")}</p>
              )}
            </motion.div>

            {product.tip && (
              <motion.div
                variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.55, ease: EASE }}
                className="mt-7 rounded-2xl border border-dashed border-[#66734A]/30 p-5"
              >
                <p className="text-[10px] font-semibold tracking-[0.3em] text-[#66734A]/50">{t.tip}</p>
                <p className="font-serif-display mt-2 text-xl italic text-[#66734A]">"{product.tip}"</p>
              </motion.div>
            )}

            {product.behind && (
              <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.55, ease: EASE }} className="mt-7">
                <BehindTheCup steps={product.behind} label={t.behind} />
              </motion.div>
            )}

            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.55, ease: EASE }} className="mt-7 flex gap-3">
              <button
                data-testid="modal-fav"
                onClick={() => toggleFavorite(product.id)}
                aria-label={fav ? "Remove from favorites" : "Save as favorite"}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  fav ? "border-[#66734A] bg-[#66734A] text-[#F5F0E6]" : "border-[#66734A]/30 text-[#66734A] hover:border-[#66734A]"
                }`}
              >
                <motion.span key={fav ? "f" : "u"} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }} className="flex">
                  <Heart size={18} fill={fav ? "#F5F0E6" : "none"} strokeWidth={1.7} />
                </motion.span>
              </button>
              <button
                data-testid="modal-add-day"
                onClick={() => { addToDay(product.id); setAdded(true); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full text-[11px] font-semibold tracking-[0.2em] transition-all duration-300 ${
                  inDay ? "bg-[#66734A]/15 text-[#66734A]" : "bg-[#66734A] text-[#F5F0E6] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(102,115,74,0.3)]"
                }`}
              >
                {inDay ? <><Check size={14} /> {t.inDay}</> : <><Plus size={14} /> {t.addDay}</>}
              </button>
            </motion.div>

            {product.pairings && product.pairings.length > 0 && (
              <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.55, ease: EASE }} className="mt-8">
                <p className="text-[10px] font-semibold tracking-[0.3em] text-[#66734A]/50">{t.pairs}</p>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {product.pairings.slice(0, 2).map((id) => (
                    <MiniCard key={id} id={id} testid={`pairing-${id}`} />
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.55, ease: EASE }} className="mt-8 border-t border-[#66734A]/12 pt-6">
              <p className="text-[10px] font-semibold tracking-[0.3em] text-[#66734A]/50">{t.more}</p>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                {getRelated(product).map((p) => (
                  <MiniCard key={p.id} id={p.id} testid={`related-${p.id}`} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProductModal() {
  const { activeProductId, closeProduct } = useApp();
  const product = activeProductId ? getProduct(activeProductId) : null;

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && closeProduct();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [closeProduct]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          data-testid="product-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#66734A]/45 p-0 backdrop-blur-md md:p-6"
          onClick={closeProduct}
        >
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative h-[100svh] w-full overflow-hidden bg-[#F5F0E6] md:h-[min(780px,92vh)] md:max-w-6xl md:rounded-[2rem] md:shadow-[0_40px_100px_rgba(45,52,32,0.45)]"
          >
            <button
              data-testid="modal-close"
              aria-label="Close product"
              onClick={closeProduct}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F0E6]/90 text-[#66734A] shadow-md transition-transform duration-300 hover:scale-110"
            >
              <X size={18} />
            </button>
            <ModalBody key={product.id} product={product} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
