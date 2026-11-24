import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { categories, productSeed } from "@/db/products-data";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "All eight Verde formulas — cleansers, serums, balms and SPF, pressed from Quetta valley apricot kernel oil.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const all = await db.select().from(products).orderBy(products.id);
  const active = categories.includes(c as (typeof categories)[number]) ? c! : "All";
  const shown = active === "All" ? all : all.filter((p) => p.category === active);

  return (
    <section className="mx-auto w-[min(1120px,calc(100%-2.5rem))] pb-28 pt-32 sm:pt-40">
      <Reveal>
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-fern">
          <span className="h-px w-8 bg-fern" />
          The whole apothecary
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.6rem)] font-light leading-[1.02] tracking-tight">
          Eight formulas,{" "}
          <em className="italic text-fern">nothing more</em> than skin needs.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-pine/65">
          We&apos;d rather make eight things properly than eighty things loudly.
          Every product below begins in the same Quetta grove — pick where your
          ritual is weakest.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? all.length
                : all.filter((p) => p.category === cat).length;
            const isActive = cat === active;
            return (
              <Link
                key={cat}
                href={cat === "All" ? "/shop" : `/shop?c=${cat}`}
                className={`rounded-full border px-5 py-2.5 text-[13px] font-semibold transition ${
                  isActive
                    ? "border-pine bg-pine text-paper"
                    : "border-pine/15 bg-paper text-pine/70 hover:border-pine/40 hover:text-pine"
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-[11px] ${isActive ? "text-paper/60" : "text-pine/40"}`}>
                  {count || productSeed.filter((p) => p.category === cat).length}
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((product, i) => (
          <Reveal key={product.slug} delay={0.06 * (i % 4)}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-20 text-center font-display text-2xl text-pine/50">
          This shelf is being restocked — check back after the next pressing.
        </p>
      )}
    </section>
  );
}
