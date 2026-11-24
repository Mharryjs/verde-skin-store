"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Leaf, MapPin, Send } from "lucide-react";

const shopLinks = [
  { href: "/shop", label: "All products" },
  { href: "/shop?c=Serum", label: "Serums" },
  { href: "/shop?c=Cleanser", label: "Cleansers" },
  { href: "/shop?c=Moisturiser", label: "Moisturisers" },
  { href: "/shop?c=Protect", label: "SPF" },
];

const houseLinks = [
  { href: "/about", label: "Our story" },
  { href: "/#ritual", label: "The ritual" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/account", label: "Your account" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function subscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
    setEmail("");
  }

  return (
    <footer className="relative overflow-hidden bg-pine text-paper">
      <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1.3fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-paper text-pine">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                Verde
                <span className="ml-1 text-xs font-normal uppercase tracking-[0.28em] text-moss">
                  skin
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-[30ch] text-sm leading-relaxed text-paper/60">
              Small-batch skincare pressed from the apricot orchards of the
              Quetta valley. Nothing loud, nothing wasted.
            </p>
            <p className="mt-6 flex items-center gap-2 text-xs text-paper/45">
              <MapPin className="h-3.5 w-3.5" />
              Hanna Valley Road, Quetta, Balochistan
            </p>
            <div className="mt-5 flex gap-6">
              <a
                href="#"
                className="link-line flex items-center gap-1 text-[13px] text-paper/70 transition hover:text-paper"
              >
                Instagram
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="link-line flex items-center gap-1 text-[13px] text-paper/70 transition hover:text-paper"
              >
                TikTok
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-moss">
              Shop
            </p>
            <ul className="mt-5 space-y-3">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-line text-sm text-paper/65 transition hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-moss">
              The house
            </p>
            <ul className="mt-5 space-y-3">
              {houseLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-line text-sm text-paper/65 transition hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-moss">
              Letters from the valley
            </p>
            <p className="mt-5 text-sm leading-relaxed text-paper/60">
              One email a month — harvest notes, restocks, and the occasional
              recipe. Never noise.
            </p>
            {done ? (
              <p className="mt-5 flex items-center gap-2 rounded-2xl border border-moss/30 bg-forest/60 px-4 py-3.5 text-sm text-moss">
                <Check className="h-4 w-4" />
                You&apos;re on the list. Khush amdeed.
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-5 flex overflow-hidden rounded-full border border-paper/20 focus-within:border-moss/60">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent px-5 py-3.5 text-sm text-paper placeholder:text-paper/35"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="grid w-14 shrink-0 place-items-center bg-moss text-pine transition hover:bg-paper"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <p
          className="text-outline-light mt-16 select-none text-center font-display text-[clamp(3.5rem,13vw,11rem)] font-semibold leading-none tracking-tight"
          aria-hidden
        >
          VERDE SKIN
        </p>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-paper/10 pt-6 text-[11px] text-paper/40 sm:flex-row">
          <p>© 2026 Verde Skin Co. — made patiently in Quetta, Pakistan</p>
          <p>Cash on delivery nationwide · Free shipping over Rs 5,000</p>
        </div>
      </div>
    </footer>
  );
}
