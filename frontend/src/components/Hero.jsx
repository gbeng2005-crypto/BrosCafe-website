import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LOYALTY_URL, VIDEOS } from "@/config";
import { scrollToSection } from "@/hooks/useLenis";

const EASE = [0.22, 1, 0.36, 1];

function MaskedLine({ children, delay, className }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "112%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });

  const onMove = (e) => {
    if (reduce) return;
    mx.set((e.clientX / window.innerWidth - 0.5) * 18);
    my.set((e.clientY / window.innerHeight - 0.5) * 12);
  };

  return (
    <section
      id="home"
      data-testid="hero-section"
      onMouseMove={onMove}
      className="grain relative flex h-[100svh] min-h-[620px] items-end overflow-hidden bg-[#66734A]"
    >
      <motion.div className="absolute inset-[-3%]" style={reduce ? {} : { x: sx, y: sy }}>
        <motion.video
          data-testid="hero-video"
          className="h-full w-full object-cover"
          src={VIDEOS.hero.src}
          poster={VIDEOS.hero.poster}
          autoPlay
          muted
          loop
          playsInline
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.04 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#66734A]/45" />
      <div className="absolute inset-0 bg-[#F5F0E6]/10 mix-blend-overlay" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-24 md:px-12 md:pb-28">
        <motion.p
          data-testid="hero-eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="mb-6 text-[11px] font-medium tracking-[0.4em] text-[#F5F0E6]/80"
        >
          BROS CAFE — SPECIALTY COFFEE
        </motion.p>

        <h1
          data-testid="hero-title"
          className="font-serif-display text-[#F5F0E6] text-[16vw] leading-[0.92] tracking-tight sm:text-[13vw] lg:text-[9.5rem]"
        >
          <MaskedLine delay={0.7} className="font-medium">Good coffee.</MaskedLine>
          <MaskedLine delay={0.88} className="font-medium italic">Good people.</MaskedLine>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            data-testid="hero-explore-button"
            onClick={() => scrollToSection("coffee")}
            className="group inline-flex items-center gap-3 rounded-full bg-[#F5F0E6] px-8 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#66734A] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
          >
            EXPLORE
            <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
          <a
            data-testid="hero-loyalty-button"
            href={LOYALTY_URL}
            className="group inline-flex items-center gap-3 rounded-full border border-[#F5F0E6]/70 px-8 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#F5F0E6] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F5F0E6]/10"
          >
            GET LOYALTY CARD
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 text-[10px] tracking-[0.35em] text-[#F5F0E6]/70 md:right-12 md:flex"
        aria-hidden="true"
      >
        SCROLL
        <motion.span
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown size={12} />
        </motion.span>
      </motion.div>
    </section>
  );
}
