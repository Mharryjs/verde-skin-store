import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Banknote, Check, CreditCard } from "lucide-react";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { pkr } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order placed",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: number } = await searchParams;
  if (!number) notFound();

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, number))
    .limit(1);
  if (!order) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return (
    <section className="mx-auto w-[min(760px,calc(100%-2.5rem))] pb-28 pt-32 sm:pt-40">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-fern text-paper">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="mt-7 font-display text-[clamp(2.2rem,5.5vw,3.6rem)] font-light leading-tight tracking-tight">
          Shukriya, {order.name.split(" ")[0]} —{" "}
          <em className="italic text-fern">it&apos;s on its way.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-relaxed text-pine/65">
          Order <b className="text-pine">{order.orderNumber}</b> is confirmed. A
          note has gone to {order.email}, and the parcel leaves Quetta within
          1–2 working days.
        </p>
      </div>

      <div className="mt-12 rounded-[2rem] border border-pine/10 bg-cream p-7">
        <h2 className="font-display text-xl">What&apos;s inside the box</h2>
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-mist">
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{item.name}</span>
                <span className="text-xs text-pine/55">Qty {item.quantity}</span>
              </span>
              <span className="text-sm font-semibold">{pkr(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-2 border-t border-pine/10 pt-5 text-sm">
          <div className="flex justify-between text-pine/65">
            <span>Subtotal</span>
            <span className="font-semibold text-pine">{pkr(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-pine/65">
            <span>Shipping</span>
            <span className="font-semibold text-pine">
              {order.shipping === 0 ? "Free" : pkr(order.shipping)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-pine/10 pt-3">
            <span className="font-display text-lg">Total</span>
            <span className="font-display text-2xl">{pkr(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-mist/70 p-4 text-sm text-forest">
          {order.paymentMethod === "cod" ? (
            <>
              <Banknote className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Pay <b>{pkr(order.total)}</b> in cash when the rider reaches{" "}
                {order.address}, {order.city}.
              </p>
            </>
          ) : (
            <>
              <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Card payment recorded (demo) — shipping to {order.address}, {order.city}.</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-full bg-pine px-7 py-4 text-sm font-semibold text-paper transition hover:bg-forest"
        >
          Keep browsing
        </Link>
        <Link
          href="/account"
          className="rounded-full border border-pine/20 px-7 py-4 text-sm font-semibold transition hover:border-pine"
        >
          View my orders
        </Link>
      </div>
    </section>
  );
}
