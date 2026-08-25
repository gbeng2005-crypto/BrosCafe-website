import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/SectionLabel";
import { LOYALTY_URL, IMAGES } from "@/config";
import { UPLOADS } from "@/data/products";
import { useApp } from "@/store/AppStore";
import { STR } from "@/i18n";

const PANELS = [
  { img: UPLOADS.coffeePoster, product: "espresso" },
  { img: UPLOADS.sweetsPoster, product: "croissant" },
  { img: IMAGES.about, product: null },
  { img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80", product: "bros-hoodie" },
];

export default function DiscoverBros() {
  const ref = useRef(null);
  const rowRef = useRef(null);
  const reduce = useReducedMotion();
  const { openProduct, lang } = useApp();
  const t = STR[lang].discover;
  const [shift, setShift] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);

  useEffect(() => {
    const measure = () => {
      if (rowRef.current) setShift(Math.max(0, rowRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const panels = (
    <>
      {PANELS.map((p, i) => (
        <button
          key={t.panels[i].label}
          data-testid={`discover-panel-${i}`}
          onClick={() => p.product && openProduct(p.product)}
          data-cursor={p.product ? "view" : undefined}
          className={`group relative h-[62vh] w-[80vw] shrink-0 overflow-hidden rounded-3xl text-left md:h-[70vh] md:w-[52vw] ${p.product ? "" : "cursor-default"}`}
        >
          <img
            src={p.img}
            alt={t.panels[i].label}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[#66734A]/25 transition-colors duration-500 group-hover:bg-[#66734A]/15" />
          <div className="absolute bottom-0 left-0 p-7 md:p-9">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-[#F5F0E6]/80">0{i + 1}</p>
            <p className="font-serif-display mt-1 text-4xl font-medium text-[#F5F0E6] md:text-6xl">{t.panels[i].label}</p>
            <p className="mt-2 text-sm italic text-[#F5F0E6]/85">{t.panels[i].caption}</p>
          </div>
        </button>
      ))}
      <div className="flex h-[62vh] w-[80vw] shrink-0 flex-col items-start justify-center rounded-3xl bg-[#66734A] p-8 md:h-[70vh] md:w-[52vw] md:p-14">
        <p className="font-serif-display text-4xl font-medium leading-tight text-[#F5F0E6] md:text-6xl">
          {t.end1}
          <br />
          {t.end2}<span className="italic">.</span>
        </p>
        <a
          data-testid="discover-loyalty-cta"
          href={LOYALTY_URL}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#F5F0E6] px-8 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#66734A] transition-all duration-300 hover:-translate-y-1"
        >
          {t.cta}
          <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </>
  );

  if (reduce) {
    return (
      <section id="discover" data-testid="discover-section" className="bg-white py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <SectionLabel number="05" title={t.label} />
        </div>
        <div className="no-scrollbar flex gap-6 overflow-x-auto px-6 md:px-12">{panels}</div>
      </section>
    );
  }

  return (
    <section id="discover" ref={ref} data-testid="discover-section" className="relative h-[340vh] bg-white">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-6 pb-8 md:px-12">
          <SectionLabel number="05" title={t.label} />
          <h2 className="font-serif-display text-4xl font-medium tracking-tight text-[#66734A] md:text-6xl">
            {t.title}<span className="italic">{t.punct}</span>
          </h2>
        </div>
        <motion.div ref={rowRef} style={{ x }} className="flex w-max gap-6 px-6 md:px-12">
          {panels}
        </motion.div>
        <div className="mx-auto mt-10 w-full max-w-[1440px] px-6 md:px-12">
          <div className="h-[3px] w-full max-w-xs rounded-full bg-[#66734A]/12">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left rounded-full bg-[#66734A]" />
          </div>
        </div>
      </div>
    </section>
  );
}
