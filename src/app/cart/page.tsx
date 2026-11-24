"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, X, Leaf } from "lucide-react";
import { useCart } from "@/components/cart";
import { pkr, shippingFor, FREE_SHIPPING_OVER } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, setQty, removeItem } = useCart();
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_OVER - subtotal;

  return (
    <section className="mx-auto w-[min(1120px,calc(100%-2.5rem))] pb-28 pt-32 sm:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-fern">
          <span className="h-px w-8 bg-fern" />
          Your bag
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-light leading-none tracking-tight">
          Chosen <em className="italic text-fern">well.</em>
        </h1>
      </motion.div>

      {items.length === 0 ? (
        <div className="mx-auto mt-16 flex max-w-md flex-col items-center py-16 text-center">
          <span className="rounded-full bg-mist p-6">
            <ShoppingBag className="h-8 w-8 text-fern" />
          </span>
          <h2 className="mt-6 font-display text-3xl">Nothing here yet</h2>
          <p className="mt-3 text-sm leading-relaxed text-pine/60">
            Eight quiet formulas are waiting one shelf over.
          </p>
          <Link
            href="/shop"
            className="mt-8 rounded-full bg-pine px-7 py-4 text-sm font-semibold text-paper transition hover:bg-forest"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:gap-14">
          <ul className="divide-y divide-pine/10 border-y border-pine/10">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.slug}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="flex gap-5 py-6"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative h-32 w-24 shrink-0 overflow-hidden rounded-3xl bg-mist"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-display text-xl leading-tight tracking-tight transition hover:text-fern"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-pine/55">{pkr(item.price)} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.slug)}
                        aria-label={`Remove ${item.name}`}
                        className="p-1.5 text-pine/40 transition hover:text-pine"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-pine/15">
                        <button
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="p-3 transition hover:text-fern"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="p-3 transition hover:text-fern"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-display text-lg">{pkr(item.price * item.qty)}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-pine/10 bg-cream p-7">
              <h2 className="font-display text-2xl tracking-tight">Summary</h2>

              <div className="mt-5 rounded-2xl bg-mist/70 p-4">
                <p className="flex items-center gap-2 text-xs font-medium text-forest">
                  <Leaf className="h-3.5 w-3.5" />
                  {remaining > 0
                    ? `Add ${pkr(remaining)} more for free shipping`
                    : "Free shipping unlocked"}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full bg-fern transition-all duration-700"
                    style={{
                      width: `${Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2.5 text-sm">
                <div className="flex justify-between text-pine/65">
                  <span>Subtotal</span>
                  <span className="font-semibold text-pine">{pkr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-pine/65">
                  <span>Shipping</span>
                  <span className="font-semibold text-pine">
                    {shipping === 0 ? "Free" : pkr(shipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-pine/10 pt-3.5">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-display text-2xl">{pkr(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-pine py-4 text-sm font-semibold text-paper transition hover:bg-forest"
              >
                Quick checkout
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop"
                className="mt-3 block text-center text-[13px] font-semibold text-pine/60 underline-offset-4 transition hover:text-pine hover:underline"
              >
                Keep browsing
              </Link>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
