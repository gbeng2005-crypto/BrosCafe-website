import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import MaskedImage from "@/components/MaskedImage";
import { useApp } from "@/store/AppStore";
import { IMAGES, VIDEOS } from "@/config";
import { STR } from "@/i18n";

const SHOTS = [
  { img: IMAGES.collageInterior, alt: "Inside Bros Cafe", cls: "col-span-2 row-span-2 h-full", variant: "left" },
  { img: VIDEOS.hero.poster, alt: "Espresso being pulled", cls: "col-span-1 row-span-1 h-full", variant: "up" },
  { img: IMAGES.collageFlatlay, alt: "Coffee flat lay", cls: "col-span-1 row-span-2 h-full", variant: "right" },
  { img: IMAGES.collageMagazine, alt: "Coffee and a magazine", cls: "col-span-1 row-span-1 h-full", variant: "up" },
  { img: VIDEOS.moment.poster, alt: "Cafe moment", cls: "col-span-2 row-span-1 h-full", variant: "left" },
];

function Shot({ shot, index, progress, reduce, onOpen }) {
  const speed = index % 2 === 0 ? 24 : -24;
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [speed, -speed]);
  return (
    <motion.div
      data-testid={`community-shot-${index}`}
      style={{ y }}
      className={`group cursor-pointer ${shot.cls}`}
      onClick={onOpen}
      data-cursor="explore"
    >
      <MaskedImage
        src={shot.img}
        alt={shot.alt}
        variant={shot.variant}
        delay={index * 0.08}
        className="h-full w-full rounded-3xl"
        imgClassName="h-full min-h-[180px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
    </motion.div>
  );
}

export default function Community() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { openLightbox, lang } = useApp();
  const t = STR[lang].community;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const images = SHOTS.map((s) => s.img);

  return (
    <section id="community" ref={ref} data-testid="community-section" className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
        <SectionLabel number="09" title={t.label} />
        <Reveal>
          <h2 className="font-serif-display text-5xl font-medium leading-[1.02] tracking-tight text-[#66734A] md:text-7xl">
            {t.title1}
            <br />
            {t.title2}<span className="italic">{t.punct}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#66734A]/75">
            {t.body}
          </p>
        </Reveal>

        <div className="mt-16 grid auto-rows-[170px] grid-cols-2 gap-4 md:auto-rows-[210px] md:grid-cols-4 md:gap-6">
          {SHOTS.map((s, i) => (
            <Shot key={i} shot={s} index={i} progress={scrollYProgress} reduce={reduce} onOpen={() => openLightbox(images, i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
