import { Sprout } from "lucide-react";

const phrases = [
  "Cold-pressed in small batches",
  "Apricot kernel oil · Quetta valley",
  "No fragrance, ever",
  "Dermatologically reviewed",
  "Vegan & cruelty-free",
  "Ships across Pakistan",
];

export function Marquee() {
  const row = [...phrases, ...phrases];
  return (
    <div className="overflow-hidden border-y border-pine/10 bg-cream py-4">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8">
        {row.map((phrase, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.26em] text-forest"
          >
            {phrase}
            <Sprout className="h-4 w-4 text-sage" />
          </span>
        ))}
      </div>
    </div>
  );
}
