"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <p
          className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] ${
            dark ? "text-moss" : "text-fern"
          } ${align === "center" ? "justify-center" : ""}`}
        >
          <span className={`h-px w-8 ${dark ? "bg-moss" : "bg-fern"}`} />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl ${
            dark ? "text-paper" : "text-pine"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {copy && (
        <Reveal delay={0.16}>
          <p className={`mt-4 text-[15px] leading-relaxed ${dark ? "text-paper/70" : "text-pine/65"}`}>
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  );
}
