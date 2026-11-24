import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Register",
};

export default async function RegisterPage() {
  const user = await getSession();
  if (user) redirect("/account");

  return (
    <section className="mx-auto grid min-h-screen w-[min(1120px,calc(100%-2.5rem))] items-center gap-14 pb-20 pt-32 lg:grid-cols-2">
      <Reveal delay={0.15} className="hidden lg:block">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-b-[2.5rem] rounded-t-[12rem]">
          <Image
            src="/images/products/dawn-serum.png"
            alt="Verde Dawn Serum — apricot kernel oil and hyaluronate"
            fill
            priority
            sizes="44vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      <Reveal>
        <div className="mx-auto w-full max-w-md">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-fern">
            <span className="h-px w-8 bg-fern" />
            Join the valley
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-tight tracking-tight">
            A quieter shelf <em className="italic text-fern">starts here.</em>
          </h1>
          <p className="mb-9 mt-4 text-[15px] leading-relaxed text-pine/65">
            One account for orders, harvest notes and early restocks. No spam —
            we barely like email ourselves.
          </p>
          <AuthForm mode="register" />
        </div>
      </Reveal>
    </section>
  );
}
