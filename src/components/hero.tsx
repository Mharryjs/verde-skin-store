"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Droplets, Star, Truck } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.8 });

  // each layer drifts at a different depth — this is what makes it feel 3D
  const imgX = useTransform(sx, (v) => v * 34);
  const imgY = useTransform(sy, (v) => v * 26);
  const chipX = useTransform(sx, (v) => v * -52);
  const chipY = useTransform(sy, (v) => v * -38);
  const chip2X = useTransform(sx, (v) => v * -26);
  const chip2Y = useTransform(sy, (v) => v * -20);
  const wordX = useTransform(sx, (v) => v * 14);
  const glowX = useTransform(sx, (v) => v * 60);
  const glowY = useTransform(sy, (v) => v * 44);

  function onMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      onMouseMove={onMove}
      className="relative overflow-hidden pt-28 sm:pt-32 [perspective:1400px]"
    >
      {/* soft garden-light gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-moss/50 blur-3xl" />
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute -right-32 top-40 h-[30rem] w-[30rem] rounded-full bg-mist blur-3xl"
        />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-moss/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-[min(1120px,calc(100%-2.5rem))] items-center gap-14 pb-20 pt-8 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        {/* hollow display word drifting behind everything */}
        <motion.p
          style={{ x: wordX }}
          aria-hidden
          className="text-outline pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(6rem,20vw,17rem)] font-semibold leading-none lg:left-auto lg:right-0 lg:translate-x-0"
        >
          verde
        </motion.p>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-fern"
          >
            <span className="h-px w-8 bg-fern" />
            Small-batch · Quetta valley
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(3rem,7.5vw,5.4rem)] font-light leading-[0.98] tracking-tight">
            <Line delay={0.1}>Skin, at its</Line>
            <Line delay={0.22}>
              <em className="font-normal italic text-fern">calmest</em> state.
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.34, ease: EASE }}
            className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-pine/65"
          >
            Eight quiet formulas built on cold-pressed apricot kernel oil from a
            single family orchard above Quetta. Pressed within 48 hours of
            harvest, bottled without fragrance or filler, and shipped anywhere
            in Pakistan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.46, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              className="group flex items-center gap-2 rounded-full bg-pine px-7 py-4 text-sm font-semibold text-paper shadow-[0_16px_40px_-16px_rgba(21,39,29,0.6)] transition hover:bg-forest"
            >
              Shop the ritual
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="link-line px-1 py-4 text-sm font-semibold text-pine/80"
            >
              Meet the orchard
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.58, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-pine/60"
          >
            <span className="flex items-center gap-2">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </span>
              <b className="text-pine">4.9</b> · 1,231 reviews
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-fern" />
              COD nationwide · free over Rs 5,000
            </span>
          </motion.div>
        </div>

        {/* the floating bottle */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 60, rotateY: 12 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1.3, delay: 0.25, ease: EASE }}
            style={{ x: imgX, y: imgY }}
            className="relative aspect-[4/5] overflow-hidden rounded-b-[2.5rem] rounded-t-[14rem] shadow-[0_60px_120px_-40px_rgba(21,39,29,0.45)]"
          >
            <Image
              src="/images/hero.png"
              alt="Verde Dawn Serum — cold-pressed apricot kernel oil from Quetta"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="animate-float-slow object-cover"
            />
          </motion.div>

          {/* rotating seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="absolute -left-6 top-6 hidden sm:block"
          >
            <div className="relative grid h-28 w-28 place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
                <defs>
                  <path id="seal-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-pine text-[9.5px] font-semibold uppercase tracking-[0.22em]">
                  <textPath href="#seal-circle">
                    Verde Skin · Quetta Valley · Est. 2021 ·
                  </textPath>
                </text>
              </svg>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-pine text-paper">
                <Droplets className="h-5 w-5" />
              </span>
            </div>
          </motion.div>

          {/* floating chips at two different depths */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
            style={{ x: chipX, y: chipY }}
            className="glass absolute -right-3 top-16 rounded-2xl p-4 shadow-lg sm:-right-8"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fern">
              Grove to bottle
            </p>
            <p className="mt-1 font-display text-2xl leading-none">48 hours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
            style={{ x: chip2X, y: chip2Y }}
            className="glass absolute -left-3 bottom-10 flex items-center gap-3 rounded-2xl p-4 shadow-lg sm:-left-8"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-mist">
              <Star className="h-4 w-4 fill-gold text-gold" />
            </span>
            <span>
              <span className="block font-display text-lg leading-none">4.9 / 5</span>
              <span className="text-[11px] text-pine/55">from 1,231 quiet customers</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Line({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}
