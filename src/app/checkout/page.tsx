import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Quick checkout",
  description: "One page, three short steps — your Verde order, placed calmly.",
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto w-[min(1120px,calc(100%-2.5rem))] pb-28 pt-32 sm:pt-40">
      <Reveal>
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-fern">
          <span className="h-px w-8 bg-fern" />
          Quick checkout
        </p>
        <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-light leading-[1.02] tracking-tight">
          Nearly <em className="italic text-fern">yours.</em>
        </h1>
        <p className="mt-4 max-w-[50ch] text-[15px] leading-relaxed text-pine/65">
          Three short steps. Orders leave Quetta within 1–2 days, and cash on
          delivery works everywhere in Pakistan.
        </p>
      </Reveal>

      <div className="mt-12">
        <CheckoutForm />
      </div>
    </section>
  );
}
