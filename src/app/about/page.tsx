import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FlaskConical, HandHeart, Leaf, MountainSnow } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Verde Skin began in a single apricot orchard above Quetta, Balochistan. This is how a grove became a skincare house.",
};

const values = [
  {
    icon: MountainSnow,
    title: "One valley",
    note: "Every kernel comes from a single family grove above Quetta — 6,500 feet up, snow-fed, never rushed.",
  },
  {
    icon: Leaf,
    title: "Pressed in 48 hours",
    note: "Kernels are cracked by hand and cold-pressed within two days of harvest, before the oil can tire.",
  },
  {
    icon: FlaskConical,
    title: "Quiet chemistry",
    note: "Reviewed by dermatologists in Lahore, built without fragrance, dyes or anything that shouts.",
  },
  {
    icon: HandHeart,
    title: "Honest pricing",
    note: "We buy the whole harvest at a fixed price every year, so the orchard never depends on our margins.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "The winter the orchard almost didn't fruit",
    note: "A small harvest forced a small idea: make much from little. The first balm was stirred in a steel pot over a gas flame in Quetta.",
  },
  {
    year: "2022",
    title: "Forty-one cleansers later",
    note: "We tested until cleansing felt like nothing happened. Silk Milk shipped. The word-of-mouth started doing the marketing.",
  },
  {
    year: "2024",
    title: "The SPF two years in the making",
    note: "Day Shield took one very patient formulator and every skin tone we could find across the country.",
  },
  {
    year: "Today",
    title: "Eight formulas, twelve thousand bottles",
    note: "Still one grove. Still hand-cracked kernels. Still nothing loud.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ——— valley hero ——— */}
      <section className="relative overflow-hidden">
        <div className="relative h-[68vh] min-h-[480px]">
          <Image
            src="/images/orchard.png"
            alt="Apricot orchard in spring blossom above Quetta, Balochistan"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine/85 via-pine/25 to-pine/10" />
          <div className="absolute inset-x-0 bottom-0 pb-16">
            <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))]">
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-moss">
                  Quetta valley · Balochistan · 6,500 ft
                </p>
                <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.6rem,6.5vw,5rem)] font-light leading-[1.02] tracking-tight text-paper">
                  Grown in Quetta.{" "}
                  <em className="italic text-moss">Bottled with patience.</em>
                </h1>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ——— the long version ——— */}
      <section className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-24 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="The long version"
            title={
              <>
                A grove, a winter,{" "}
                <em className="italic text-fern">a steel pot</em>
              </>
            }
          />
          <div className="space-y-5 text-[15px] leading-relaxed text-pine/70">
            <Reveal>
              <p>
                Verde Skin began the winter the orchard almost didn&apos;t fruit.
                The Kakar family had grown apricots above Quetta for four
                generations, and for four generations the kernels — the softest,
                most oil-rich part of the harvest — were simply left behind.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                That year, we cracked them. The oil that came out was the kind the
                family had quietly used on their own skin for decades: light,
                faintly sweet, gone in seconds. The first night balm was stirred
                in a steel pot over a gas flame, poured into thirty recycled jars,
                and sold out of a boot at the Quetta bazaar on a Friday.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p>
                We&apos;re bigger now — a proper lab in Lahore, dermatologists on
                call, twelve thousand bottles shipped. But the oil still comes
                from the same grove, pressed within forty-eight hours of harvest,
                bought whole at a fixed price every year. When people ask what
                makes Verde different, the honest answer is boring:{" "}
                <em className="font-display italic text-forest">
                  we never learned to hurry.
                </em>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— values ——— */}
      <section className="border-y border-pine/10 bg-cream">
        <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-24">
          <SectionHeading
            align="center"
            eyebrow="What we hold to"
            title={
              <>
                Four promises, <em className="italic text-fern">kept quietly</em>
              </>
            }
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={0.08 * i}>
                <div className="group h-full rounded-[2rem] border border-pine/10 bg-paper p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(21,39,29,0.35)]">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-mist text-forest transition-colors duration-500 group-hover:bg-pine group-hover:text-paper">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl tracking-tight">{value.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-pine/60">
                    {value.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— timeline ——— */}
      <section className="bg-pine text-paper">
        <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-24 sm:py-28">
          <SectionHeading
            dark
            eyebrow="From the diary"
            title={
              <>
                The years, <em className="italic text-moss">as they pressed</em>
              </>
            }
          />
          <div className="mt-16 space-y-0">
            {timeline.map((entry, i) => (
              <Reveal key={entry.year} delay={0.05 * i}>
                <div className="grid gap-3 border-t border-paper/10 py-8 sm:grid-cols-[160px_260px_1fr] sm:gap-8">
                  <p className="font-display text-3xl italic text-moss">{entry.year}</p>
                  <h3 className="font-display text-xl leading-snug">{entry.title}</h3>
                  <p className="max-w-[54ch] text-sm leading-relaxed text-paper/60">
                    {entry.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— cta ——— */}
      <section className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-24 text-center sm:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(2.2rem,5.5vw,4rem)] font-light leading-[1.05] tracking-tight">
            Taste the valley —{" "}
            <em className="italic text-fern">well, almost.</em>
          </h2>
          <Link
            href="/shop"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-pine px-8 py-4 text-sm font-semibold text-paper transition hover:bg-forest"
          >
            Shop the eight formulas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
