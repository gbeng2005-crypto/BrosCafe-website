import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Cinematic masked reveal: a cream panel slides away while the image settles from a slow scale.
// variant: "left" | "right" | "up"
export default function MaskedImage({ src, alt, className = "", imgClassName = "", variant = "left", onClick, cursor, delay = 0 }) {
  const reduce = useReducedMotion();
  const panel =
    variant === "up"
      ? { initial: { y: 0 }, animate: { y: "-101%" } }
      : variant === "right"
        ? { initial: { x: 0 }, animate: { x: "101%" } }
        : { initial: { x: 0 }, animate: { x: "-101%" } };

  if (reduce) {
    return (
      <div className={`relative overflow-hidden ${className}`} onClick={onClick} data-cursor={cursor}>
        <img src={src} alt={alt} loading="lazy" className={imgClassName} />
      </div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      data-cursor={cursor}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={imgClassName}
        variants={{ hidden: { scale: 1.18 }, show: { scale: 1 } }}
        transition={{ duration: 1.2, delay: delay + 0.25, ease: EASE }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[#F5F0E6]"
        variants={{ hidden: panel.initial, show: panel.animate }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      />
    </motion.div>
  );
}
