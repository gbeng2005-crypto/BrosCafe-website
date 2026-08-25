import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import MaskedImage from "@/components/MaskedImage";
import { useApp } from "@/store/AppStore";
import { IMAGES } from "@/config";

const CHAPTERS = [
  { n: "I", title: "Coffee first.", text: "If the coffee isn't right, nothing else matters. So we start there, every single morning." },
  { n: "II", title: "People always.", text: "Regulars, first-timers, the dog waiting outside — everyone's a bro here." },
  { n: "III", title: "No rush.", text: "Stay for one espresso or three hours. The chair is yours." },
];

export default function About() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { openLightbox } = useApp();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, -50]);

  return (
    <section id="about" ref={ref} data-testid="about-section" className="bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-6 py-28 md:grid-cols-2 md:px-12 md:py-40 lg:gap-24">
        <div>
          <SectionLabel number="03" title="ABOUT BROS" />
          <Reveal>
            <h2 className="font-serif-display text-5xl font-medium leading-[1.02] tracking-tight text-[#66734A] md:text-7xl">
              MORE THAN
              <br />
              COFFEE<span className="italic">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-[#66734A]/80">
              Bros Cafe started the way most good things do — two friends, a beaten-up
              espresso machine, and the feeling that the neighborhood deserved a better
              place to sit. No investors, no playbook. Just a room that smells like
              fresh grounds and sounds like people actually talking to each other.
            </p>
          </Reveal>

          <div className="mt-14 space-y-10">
            {CHAPTERS.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.08}>
                <div data-testid={`about-chapter-${i + 1}`} className="flex gap-6 border-t border-[#66734A]/15 pt-6">
                  <span className="font-serif-display w-10 shrink-0 text-2xl italic text-[#66734A]/50">{c.n}</span>
                  <div>
                    <h3 className="font-serif-display text-2xl font-medium text-[#66734A]">{c.title}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#66734A]/70">{c.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative flex items-start justify-center md:justify-end">
          <motion.div style={{ y: imgY }} className="relative w-full max-w-md md:mt-20">
            <MaskedImage
              src={IMAGES.about}
              alt="Friends gathered at Bros Cafe"
              variant="up"
              cursor="explore"
              onClick={() => openLightbox([IMAGES.about], 0)}
              className="aspect-[4/5] w-full cursor-pointer rounded-3xl"
              imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
            />
            <p className="mt-4 text-right text-[10px] tracking-[0.3em] text-[#66734A]/50">
              THE USUAL TABLE — EVERY MORNING
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
