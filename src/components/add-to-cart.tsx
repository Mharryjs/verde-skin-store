"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart";
import { pkr } from "@/lib/format";

export function AddToCart({
  product,
}: {
  product: { slug: string; name: string; price: number; image: string };
}) {
  const { addItem } = useCart();
  const [qty, setQtyState] = useState(1);
  const [added, setAdded] = useState(false);

  function add() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      qty
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex items-center justify-between rounded-full border border-pine/15 sm:w-36">
        <button
          onClick={() => setQtyState((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="p-4 transition hover:text-fern"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-sm font-bold">{qty}</span>
        <button
          onClick={() => setQtyState((q) => Math.min(20, q + 1))}
          aria-label="Increase quantity"
          className="p-4 transition hover:text-fern"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <motion.button
        onClick={add}
        whileTap={{ scale: 0.97 }}
        className={`group flex flex-1 items-center justify-center gap-2.5 rounded-full py-4 text-sm font-semibold transition-colors ${
          added ? "bg-fern text-paper" : "bg-pine text-paper hover:bg-forest"
        }`}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Added to your bag
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            Add to bag — {pkr(product.price * qty)}
          </>
        )}
      </motion.button>
    </div>
  );
}
