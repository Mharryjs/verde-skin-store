import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { ProductCard } from "@/components/product-card";
import { Reveal, SectionHeading } from "@/components/reveal";

export const dynamic = "force-dynamic";

const ritualSteps = [
  {
    n: "01",
    name: "Silk Milk Cleanser",
    doing: "Cleanse",
    note: "Take the day off, gently. One full minute — that's where the magic hides.",
    image: "/images/products/milk-cleanser.png",
    slug: "silk-milk-cleanser",
  },
  {
    n: "02",
    name: "Dawn Serum",
    doing: "Hydrate",
    note: "Three drops on damp skin, every morning. The slow kind of glow.",
    image: "/images/products/dawn-serum.png",
    slug: "dawn-serum",
  },
  {
    n: "03",
    name: "Day Shield SPF 50",
    doing: "Protect",
    note: "The Pakistani sun does not negotiate. Neither does this.",
    image: "/images/products/day-shield.png",
    slug: "day-shield-spf-50",
  },
  {
    n: "04",
    name: "Midnight Oil No. 9",
    doing: "Restore",
    note: "Nine oils for the quiet hour, when skin does its own repairs.",
    image: "/images/products/night-oil.png",
    slug: "midnight-oil-no-9",
  },
];

const reviews = [
  {
    quote:
      "Two weeks of Dawn Serum and my mother asked if I'd started sleeping properly. I had not. I'd just found the orchard.",
    name: "Mahnoor R.",
    city: "Lahore",
  },
  {
    quote:
      "I've repurchased the Day Shield four times. Invisible on my skin, invisible on my wife's, invisible on everyone I force it onto.",
    name: "Zubair A.",
    city: "Islamabad",
  },
  {
    quote:
      "Ordered on Tuesday, arrived from Quetta by Friday with a handwritten note. The balm itself? My winter skin is gone.",
    name: "Fatima S.",
    city: "Karachi",
  },
];

const stats = [
  { value: "01", label: "orchard, one family grove above Quetta" },
  { value: "48h", label: "from pressing the kernels to sealing the bottle" },
  { value: "0", label: "fragrances, dyes or filler ingredients" },
  { value: "12k", label: "bottles shipped across Pakistan" },
];

export default async function HomePage() {
  const all = await db.select().from(products).orderBy(products.id);
  const featured = all.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <Hero />
      <Marquee />

      {/* ——— Bestsellers ——— */}
      <section className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The quiet four"
            title={
              <>
                Loved slowly,{" "}
                <em className="italic text-fern">reordered often</em>
              </>
            }
            copy="The four bottles that empties-bin first. No loud claims — just formulas people quietly finish and quietly buy again."
          />
          <Reveal delay={0.2}>
            <Link
              href="/shop"
              className="group flex items-center gap-2 rounded-full border border-pine/20 px-6 py-3.5 text-sm font-semibold transition hover:border-pine hover:bg-mist/60"
            >
              All eight formulas
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.slug} delay={0.08 * i}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Orchard story band ——— */}
      <section className="relative overflow-hidden bg-forest text-paper">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sage/20 blur-3xl" />
        <div className="mx-auto grid w-[min(1120px,calc(100%-2.5rem))] items-center gap-14 py-24 sm:py-32 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2rem] rounded-t-[10rem]">
                <Image
                  src="/images/orchard.png"
                  alt="Apricot orchard in spring blossom above Quetta, Balochistan"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="glass-dark absolute -bottom-6 right-4 max-w-[240px] rounded-2xl p-5 sm:right-8">
                <p className="font-display text-lg italic leading-snug">
                  “The trees taught us everything. Shade is love.”
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-moss">
                  — The Kakar family, growers
                </p>
              </div>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              dark
              eyebrow="Where it begins"
              title={
                <>
                  One grove. One harvest.{" "}
                  <em className="italic text-moss">Nothing rushed.</em>
                </>
              }
              copy="High above Quetta, in a valley the maps mostly ignore, sits a grove of apricot trees tended by the same family for four generations. Verde exists because of what they do with the fruit — and what they refuse to do. The kernels are cracked by hand, cold-pressed within two days, and sent down the mountain in small steel drums. We build every formula around that oil, and we never ask the orchard to hurry."
            />

            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10">
              {stats.map((stat, i) => (
                <Reveal key={stat.value + stat.label} delay={0.08 * i}>
                  <p className="font-display text-4xl text-moss sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 max-w-[22ch] text-[13px] leading-relaxed text-paper/60">
                    {stat.label}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <Link
                href="/about"
                className="group mt-12 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-4 text-sm font-semibold text-pine transition hover:bg-moss"
              >
                Read the whole story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— The ritual ——— */}
      <section id="ritual" className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-24 sm:py-32">
        <SectionHeading
          align="center"
          eyebrow="The ritual"
          title={
            <>
              Four steps. <em className="italic text-fern">Sixty seconds each.</em>
            </>
          }
          copy="Skincare shouldn't read like homework. This is the whole practice — morning and night, nothing more complicated than chai."
        />

        <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {ritualSteps.map((step, i) => (
            <Reveal key={step.n} delay={0.1 * i}>
              <Link href={`/product/${step.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-full bg-mist">
                  <Image
                    src={step.image}
                    alt={step.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-3"
                  />
                  <span className="glass absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-forest">
                    {step.doing}
                  </span>
                </div>
                <div className="mt-5 text-center">
                  <p className="font-display text-sm italic text-sage">{step.n}</p>
                  <h3 className="mt-1 font-display text-xl tracking-tight">{step.name}</h3>
                  <p className="mx-auto mt-2 max-w-[30ch] text-[13px] leading-relaxed text-pine/60">
                    {step.note}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Reviews ——— */}
      <section id="reviews" className="border-y border-pine/10 bg-cream">
        <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-24 sm:py-32">
          <SectionHeading
            align="center"
            eyebrow="Word of mouth"
            title={
              <>
                Quiet customers,{" "}
                <em className="italic text-fern">loud opinions</em>
              </>
            }
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.name} delay={0.1 * i}>
                <figure className="flex h-full flex-col rounded-[2rem] border border-pine/10 bg-paper p-7">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 font-display text-lg leading-snug">
                    “{review.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-[13px] text-pine/55">
                    <b className="text-pine">{review.name}</b> · {review.city}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Closing CTA ——— */}
      <section className="relative overflow-hidden">
        <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-28 text-center sm:py-36">
          <p
            aria-hidden
            className="text-outline pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[clamp(4rem,16vw,13rem)] font-semibold"
          >
            the valley
          </p>
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-fern">
              Begin where it began
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.6rem)] font-light leading-[1.02] tracking-tight">
              Your skin already knows the way.{" "}
              <em className="italic text-fern">Start in the valley.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/shop"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-pine px-8 py-4.5 text-sm font-semibold text-paper shadow-[0_16px_40px_-16px_rgba(21,39,29,0.6)] transition hover:bg-forest"
            >
              Shop all eight formulas
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
