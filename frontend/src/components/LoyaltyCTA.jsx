import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Coffee, Gift, ArrowUpRight, QrCode } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { LOYALTY_URL } from "@/config";

function LoyaltyCardVisual() {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 16 });
  const sry = useSpring(ry, { stiffness: 120, damping: 16 });

  const onMove = (e) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 14);
    rx.set(-py * 14);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div style={{ perspective: 900 }} className="flex justify-center lg:justify-end">
      <motion.div
        data-testid="loyalty-card-visual"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={reduce ? {} : { rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        whileHover={reduce ? {} : { y: -6 }}
        className="relative w-full max-w-sm rounded-3xl bg-[#F5F0E6] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.28)] transition-shadow duration-500 hover:shadow-[0_44px_90px_rgba(0,0,0,0.34)]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[#FFFFFF]/25 [mask-image:linear-gradient(135deg,white,transparent_55%)]" />
        <div className="flex items-start justify-between">
          <div>
            <p className="font-serif-display text-lg font-semibold tracking-[0.14em] text-[#66734A]">BROS CAFE</p>
            <p className="mt-1 text-[10px] tracking-[0.3em] text-[#66734A]/60">LOYALTY CLUB</p>
          </div>
          <div className="group/cup relative flex h-8 w-8 items-end justify-center">
            <div
              className="steam absolute -top-2 left-1/2 -translate-x-1/2 text-[#66734A]/70 opacity-0 transition-opacity duration-300 group-hover/cup:opacity-100"
              aria-hidden="true"
            >
              <span /><span /><span />
            </div>
            <Coffee size={20} className="text-[#66734A]/70" strokeWidth={1.5} />
          </div>
        </div>
        <div className="mt-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#66734A]/50">MEMBER</p>
            <p className="font-serif-display mt-1 text-2xl italic text-[#66734A]">Your name here</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#66734A]">
            <QrCode size={30} className="text-[#F5F0E6]" strokeWidth={1.5} />
          </div>
        </div>
        <div className="mt-8 flex items-center gap-2 border-t border-[#66734A]/15 pt-5">
          {[0, 1, 2, 3].map((i) => (
            <Coffee key={i} size={16} className="text-[#66734A]" strokeWidth={1.5} />
          ))}
          <span className="mx-1 text-[#66734A]/40">→</span>
          <Gift size={16} className="text-[#66734A]" strokeWidth={1.5} />
        </div>
      </motion.div>
    </div>
  );
}

export default function LoyaltyCTA() {
  return (
    <section id="loyalty" data-testid="loyalty-section" className="grain relative overflow-hidden bg-[#66734A]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 py-28 md:px-12 md:py-40 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionLabel number="07" title="LOYALTY" light />
          <Reveal>
            <h2 className="font-serif-display text-5xl font-medium leading-[1.02] tracking-tight text-[#F5F0E6] md:text-7xl">
              YOUR COFFEE
              <br />
              SHOULD COUNT<span className="italic">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-serif-display mt-8 text-3xl font-medium italic leading-snug text-[#F5F0E6]/90 md:text-4xl">
              Buy 4 coffees.
              <br />
              Your next one is FREE.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#F5F0E6]/70">
              One card, on your phone. Every cup counts — no apps to download,
              no forms longer than your name.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <a
              data-testid="loyalty-cta-button"
              href={LOYALTY_URL}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#F5F0E6] px-9 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#66734A] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.3)]"
            >
              GET MY LOYALTY CARD
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <LoyaltyCardVisual />
        </Reveal>
      </div>
    </section>
  );
}
