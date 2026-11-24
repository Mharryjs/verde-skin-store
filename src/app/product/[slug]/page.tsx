import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { eq, ne } from "drizzle-orm";
import { ChevronRight, Leaf, RotateCcw, Star, Truck } from "lucide-react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { pkr } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";
import { Accordion } from "@/components/accordion";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return product ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await db
    .select()
    .from(products)
    .where(ne(products.slug, slug))
    .limit(4);
  const sameCategory = related
    .sort((a, b) =>
      a.category === product.category ? -1 : b.category === product.category ? 1 : 0
    )
    .slice(0, 3);

  return (
    <>
      <section className="mx-auto w-[min(1120px,calc(100%-2.5rem))] pb-24 pt-28 sm:pt-36">
        <Reveal>
          <nav className="flex items-center gap-1.5 text-[12px] text-pine/50">
            <Link href="/" className="transition hover:text-pine">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="transition hover:text-pine">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/shop?c=${product.category}`} className="transition hover:text-pine">
              {product.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-pine">{product.name}</span>
          </nav>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* gallery */}
          <div className="relative lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2.5rem] rounded-t-[12rem] bg-mist">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="animate-float-slow object-cover"
                />
                {product.badge && (
                  <span className="glass absolute left-6 top-6 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
                    {product.badge}
                  </span>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="glass absolute -right-3 bottom-8 max-w-[220px] rounded-2xl p-4 shadow-lg sm:-right-6">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-fern">
                  <Leaf className="h-3 w-3" />
                  From the orchard
                </p>
                <p className="mt-1.5 font-display text-sm italic leading-snug">
                  “Pressed within 48 hours of harvest — the grove doesn&apos;t wait.”
                </p>
              </div>
            </Reveal>
          </div>

          {/* details */}
          <div>
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage">
                {product.category} · {product.size}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] font-light leading-[1.02] tracking-tight">
                {product.name}
              </h1>
              <p className="mt-2 font-display text-lg italic text-fern">
                {product.tagline}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.rating)
                          ? "fill-gold text-gold"
                          : "text-pine/20"
                      }`}
                    />
                  ))}
                </span>
                <span className="text-[13px] text-pine/55">
                  <b className="text-pine">{product.rating.toFixed(1)}</b> ·{" "}
                  {product.reviewsCount} reviews
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-6 flex items-baseline gap-3">
                <p className="font-display text-3xl">{pkr(product.price)}</p>
                {product.compareAt && (
                  <>
                    <p className="text-lg text-pine/40 line-through">
                      {pkr(product.compareAt)}
                    </p>
                    <span className="rounded-full bg-mist px-3 py-1 text-[11px] font-bold text-forest">
                      Save {pkr(product.compareAt - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-pine/70">
                {product.description}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8">
                <AddToCart
                  product={{
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  }}
                />
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-6 grid grid-cols-2 gap-3 text-[12px] text-pine/60">
                <p className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-3.5">
                  <Truck className="h-4 w-4 shrink-0 text-fern" />
                  Ships from Quetta in 1–2 days · COD nationwide
                </p>
                <p className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-3.5">
                  <RotateCcw className="h-4 w-4 shrink-0 text-fern" />
                  14-day calm guarantee — used jars accepted
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="mt-10">
                <Accordion
                  items={[
                    { title: "Story from the orchard", body: product.story },
                    { title: "Full ingredients", body: product.ingredients },
                    { title: "How to use", body: product.howTo },
                  ]}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-pine/10 bg-cream">
        <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-20">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                Sits well <em className="italic text-fern">next to</em>
              </h2>
              <Link
                href="/shop"
                className="link-line hidden text-sm font-semibold text-pine/75 sm:block"
              >
                View all
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-3">
            {sameCategory.map((p, i) => (
              <Reveal key={p.slug} delay={0.08 * i}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
