import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { VIDEOS } from "@/config";

export default function BrosMoment() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const width = useTransform(scrollYProgress, [0, 0.55], ["52vw", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 0.55], ["46vh", "100vh"]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [28, 0]);
  const introOpacity = useTransform(scrollYProgress, [0.05, 0.35], [1, 0]);
  const introY = useTransform(scrollYProgress, [0.05, 0.35], [0, -40]);
  const captionOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.6, 0.8], [30, 0]);

  if (reduce) {
    return (
      <section id="moment" data-testid="bros-moment-section" className="relative">
        <div className="mx-auto max-w-[1440px] px-6 py-24 text-center md:px-12">
          <h2 className="font-serif-display text-5xl font-medium text-[#66734A] md:text-7xl">TAKE A MINUTE.</h2>
        </div>
        <div className="relative h-[70vh]">
          <video className="h-full w-full object-cover" src={VIDEOS.moment.src} poster={VIDEOS.moment.poster} autoPlay muted loop playsInline />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#66734A]/40 text-center">
            <p className="font-serif-display text-4xl italic text-[#F5F0E6] md:text-6xl">Coffee tastes better together.</p>
            <p className="mt-4 text-xs tracking-[0.3em] text-[#F5F0E6]/80">COME HANG OUT.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="moment" ref={ref} data-testid="bros-moment-section" className="relative h-[240vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <motion.h2
          style={{ opacity: introOpacity, y: introY }}
          className="font-serif-display pointer-events-none absolute top-[16vh] z-10 px-6 text-center text-[13vw] font-medium leading-none text-[#66734A] md:text-8xl"
        >
          TAKE A MINUTE.
        </motion.h2>

        <motion.div
          data-testid="bros-moment-video"
          style={{ width, height, borderRadius: radius }}
          className="relative overflow-hidden"
        >
          <video
            className="h-full w-full object-cover"
            src={VIDEOS.moment.src}
            poster={VIDEOS.moment.poster}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-[#66734A]/35" />
          <motion.div
            style={{ opacity: captionOpacity, y: captionY }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <p className="font-serif-display max-w-4xl text-4xl font-medium italic leading-tight text-[#F5F0E6] md:text-6xl">
              Coffee tastes better together.
            </p>
            <p className="mt-6 text-[11px] font-medium tracking-[0.4em] text-[#F5F0E6]/85">
              COME HANG OUT.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
