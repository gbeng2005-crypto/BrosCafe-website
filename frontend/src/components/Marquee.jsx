import { useApp } from "@/store/AppStore";
import { STR } from "@/i18n";

export default function Marquee() {
  const { lang } = useApp();
  const PHRASES = STR[lang].marquee;
  const row = [...PHRASES, ...PHRASES];
  return (
    <div
      data-testid="marquee"
      className="overflow-hidden border-y border-[#66734A]/15 bg-[#F5F0E6] py-6"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-10">
            {row.map((p, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-10">
                <span className="font-serif-display text-2xl italic text-[#66734A] md:text-3xl">
                  {p}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#66734A]/40" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
