import Reveal from "@/components/Reveal";

export default function SectionLabel({ number, title, light = false }) {
  return (
    <Reveal>
      <p
        data-testid={`section-label-${number}`}
        className={`mb-6 flex items-center gap-4 text-[11px] font-medium tracking-[0.4em] ${
          light ? "text-[#F5F0E6]/70" : "text-[#66734A]/60"
        }`}
      >
        <span className="font-serif-display text-base italic tracking-normal">{number}</span>
        <span className={`h-px w-10 ${light ? "bg-[#F5F0E6]/40" : "bg-[#66734A]/30"}`} />
        {title}
      </p>
    </Reveal>
  );
}
