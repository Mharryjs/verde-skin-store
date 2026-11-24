"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { Plus, Star } from "lucide-react";
import { useCart } from "@/components/cart";
import { pkr } from "@/lib/format";

export type CardProduct = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAt: number | null;
  image: string;
  badge: string | null;
  rating: number;
  reviewsCount: number;
  category: string;
};

export function ProductCard({ product }: { product: CardProduct }) {
  const { addItem } = useCart();
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 22, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 180, damping: 22, mass: 0.6 });
  const transform = useMotionTemplate`perspective(1100px) rotateX(${srx}deg) rotateY(${sry}deg)`;

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(-py * 7);
    ry.set(px * 9);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-mist">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />

          {product.badge && (
            <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-forest">
              {product.badge}
            </span>
          )}

          <span
            style={{ transform: "translateZ(40px)" }}
            className="glass-dark absolute bottom-4 left-4 hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-paper opacity-0 transition-all duration-500 group-hover:flex group-hover:opacity-100"
          >
            <Star className="h-3 w-3 fill-gold text-gold" />
            {product.rating.toFixed(1)} · {product.reviewsCount} reviews
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem({
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
              });
            }}
            aria-label={`Add ${product.name} to bag`}
            style={{ transform: "translateZ(50px)" }}
            className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-pine text-paper shadow-lg transition-all duration-300 hover:scale-110 hover:bg-fern active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3 px-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sage">
              {product.category}
            </p>
            <h3 className="mt-1 font-display text-lg leading-tight tracking-tight">
              {product.name}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-[13px] text-pine/55">
              {product.tagline}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{pkr(product.price)}</p>
            {product.compareAt && (
              <p className="text-xs text-pine/40 line-through">
                {pkr(product.compareAt)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
