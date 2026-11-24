import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const user = await getSession();
  if (user) redirect("/account");

  return (
    <section className="mx-auto grid min-h-screen w-[min(1120px,calc(100%-2.5rem))] items-center gap-14 pb-20 pt-32 lg:grid-cols-2">
      <Reveal>
        <div className="mx-auto w-full max-w-md">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-fern">
            <span className="h-px w-8 bg-fern" />
            Welcome back
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-tight tracking-tight">
            The orchard <em className="italic text-fern">remembered you.</em>
          </h1>
          <p className="mb-9 mt-4 text-[15px] leading-relaxed text-pine/65">
            Sign in to see your orders and check out a touch faster next time.
          </p>
          <AuthForm mode="login" />
        </div>
      </Reveal>

      <Reveal delay={0.15} className="hidden lg:block">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-b-[2.5rem] rounded-t-[12rem]">
          <Image
            src="/images/products/valley-mist.png"
            alt="Verde Valley Mist — rose and cucumber hydrosol"
            fill
            sizes="44vw"
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}
