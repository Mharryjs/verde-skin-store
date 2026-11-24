import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSession } from "@/lib/auth";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Verde Skin — Calm skincare, grown in Quetta",
    template: "%s — Verde Skin",
  },
  description:
    "Small-batch skincare built on cold-pressed apricot kernel oil from a family orchard above Quetta, Pakistan. Cleansers, serums, balms — no fragrance, no filler.",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSession();

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="grain min-h-screen">
        <CartProvider>
          <Navbar user={user} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
