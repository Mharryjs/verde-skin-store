"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Leaf } from "lucide-react";
import { pkr, FREE_SHIPPING_OVER } from "@/lib/format";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "verde-cart-v1";

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === item.slug);
      if (found) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, qty: Math.min(i.qty + qty, 20) } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, 20) } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQty,
      clear,
    }),
    [items, count, subtotal, isOpen, openCart, closeCart, addItem, removeItem, setQty, clear]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, removeItem, setQty } = useCart();
  const remaining = FREE_SHIPPING_OVER - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[95] bg-pine/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[100] flex h-full w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-pine/10 px-6 py-5">
              <h2 className="font-display text-xl">
                Your bag{" "}
                <span className="text-sm text-fern">({count})</span>
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close bag"
                className="rounded-full p-2 transition hover:bg-mist"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 pt-5">
              <div className="rounded-2xl bg-mist/70 p-4">
                <p className="flex items-center gap-2 text-xs font-medium text-forest">
                  <Leaf className="h-3.5 w-3.5" />
                  {remaining > 0
                    ? `${pkr(remaining)} away from free shipping`
                    : "Free shipping unlocked — nicely done"}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper">
                  <motion.div
                    className="h-full rounded-full bg-fern"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <span className="rounded-full bg-mist p-5">
                    <ShoppingBag className="h-7 w-7 text-fern" />
                  </span>
                  <p className="font-display text-2xl">Nothing here yet</p>
                  <p className="max-w-[26ch] text-sm text-pine/60">
                    Your skin is patient. The orchard, however, sells out quickly.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-2 rounded-full bg-pine px-6 py-3 text-sm font-semibold text-paper transition hover:bg-forest"
                  >
                    Browse the shop
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.slug}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4"
                      >
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-mist"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-display text-base leading-tight">
                                {item.name}
                              </p>
                              <p className="mt-0.5 text-xs text-pine/55">
                                {pkr(item.price)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.slug)}
                              aria-label={`Remove ${item.name}`}
                              className="p-1 text-pine/40 transition hover:text-pine"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-pine/15">
                              <button
                                onClick={() => setQty(item.slug, item.qty - 1)}
                                className="p-2 transition hover:text-fern"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-semibold">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => setQty(item.slug, item.qty + 1)}
                                className="p-2 transition hover:text-fern"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold">
                              {pkr(item.price * item.qty)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-pine/10 px-6 py-5">
                <div className="flex items-center justify-between text-sm text-pine/60">
                  <span>Subtotal</span>
                  <span className="text-base font-semibold text-pine">
                    {pkr(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-pine/45">
                  Shipping calculated at checkout. COD available nationwide.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex-1 rounded-full border border-pine/20 py-3.5 text-center text-sm font-semibold transition hover:border-pine"
                  >
                    View bag
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="group flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-pine py-3.5 text-sm font-semibold text-paper transition hover:bg-forest"
                  >
                    Quick checkout
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
