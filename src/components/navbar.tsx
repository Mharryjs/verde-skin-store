"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "@/components/cart";
import type { SessionUser } from "@/lib/auth";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our story" },
  { href: "/#ritual", label: "The ritual" },
  { href: "/#reviews", label: "Reviews" },
];

export function Navbar({ user }: { user: SessionUser | null }) {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-3 z-[80] mx-auto w-[min(1120px,calc(100%-1.5rem))]"
      >
        <div
          className={`flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-6 ${
            scrolled
              ? "glass shadow-[0_12px_40px_-16px_rgba(21,39,29,0.35)]"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-pine text-paper transition-transform duration-500 group-hover:rotate-[20deg]">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Verde
              <span className="ml-1 text-xs font-normal uppercase tracking-[0.28em] text-fern">
                skin
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="link-line text-[13px] font-medium tracking-wide text-pine/75 transition hover:text-pine"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? "Your account" : "Sign in"}
              className="hidden h-10 items-center gap-2 rounded-full px-3 text-pine/75 transition hover:bg-mist hover:text-pine sm:flex"
            >
              <UserRound className="h-[18px] w-[18px]" />
              {user && (
                <span className="max-w-[9ch] truncate text-[13px] font-medium">
                  {user.name.split(" ")[0]}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              aria-label="Open bag"
              className="relative grid h-10 w-10 place-items-center rounded-full text-pine transition hover:bg-mist"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-fern px-1 text-[10px] font-bold text-paper"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full text-pine transition hover:bg-mist md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass fixed inset-x-3 top-20 z-[79] rounded-3xl p-6 shadow-xl md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    className="block rounded-2xl px-4 py-3 font-display text-2xl transition hover:bg-mist"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href={user ? "/account" : "/login"}
                className="mt-2 flex items-center gap-3 rounded-2xl bg-pine px-4 py-3.5 text-sm font-semibold text-paper"
              >
                <UserRound className="h-4 w-4" />
                {user ? `Assalam-o-alaikum, ${user.name.split(" ")[0]}` : "Sign in / Register"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
