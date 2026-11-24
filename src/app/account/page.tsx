import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { Package, ShoppingBag } from "lucide-react";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { pkr } from "@/lib/format";
import { LogoutButton } from "@/components/logout-button";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your account",
};

export default async function AccountPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));

  const itemsByOrder = new Map<number, (typeof orderItems.$inferSelect)[]>();
  if (userOrders.length > 0) {
    const allItems = await db
      .select()
      .from(orderItems)
      .where(
        inArray(
          orderItems.orderId,
          userOrders.map((o) => o.id)
        )
      );
    for (const item of allItems) {
      const list = itemsByOrder.get(item.orderId) ?? [];
      list.push(item);
      itemsByOrder.set(item.orderId, list);
    }
  }

  return (
    <section className="mx-auto w-[min(900px,calc(100%-2.5rem))] pb-28 pt-32 sm:pt-40">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-fern">
              <span className="h-px w-8 bg-fern" />
              Your corner of the valley
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-light leading-tight tracking-tight">
              Assalam-o-alaikum,{" "}
              <em className="italic text-fern">{user.name.split(" ")[0]}.</em>
            </h1>
            <p className="mt-3 text-sm text-pine/55">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <h2 className="mt-16 flex items-center gap-2.5 font-display text-2xl tracking-tight">
          <Package className="h-5 w-5 text-fern" />
          Order history
        </h2>
      </Reveal>

      {userOrders.length === 0 ? (
        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-col items-center rounded-[2rem] border border-dashed border-pine/20 bg-cream/60 px-6 py-16 text-center">
            <span className="rounded-full bg-mist p-5">
              <ShoppingBag className="h-7 w-7 text-fern" />
            </span>
            <p className="mt-5 font-display text-2xl">No orders yet</p>
            <p className="mt-2 max-w-[34ch] text-sm text-pine/60">
              When you place one, it&apos;ll rest here — tracking and all.
            </p>
            <Link
              href="/shop"
              className="mt-7 rounded-full bg-pine px-7 py-3.5 text-sm font-semibold text-paper transition hover:bg-forest"
            >
              Start with the ritual
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="mt-8 space-y-5">
          {userOrders.map((order, i) => (
            <Reveal key={order.id} delay={0.06 * i}>
              <article className="rounded-[2rem] border border-pine/10 bg-cream p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pine/10 pb-4">
                  <div>
                    <p className="font-display text-lg">{order.orderNumber}</p>
                    <p className="text-xs text-pine/50">
                      {order.createdAt.toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      · {order.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-mist px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-forest">
                      {order.status}
                    </span>
                    <p className="mt-1.5 font-display text-lg">{pkr(order.total)}</p>
                  </div>
                </div>
                <ul className="mt-4 flex flex-wrap gap-4">
                  {(itemsByOrder.get(order.id) ?? []).map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <span className="relative h-14 w-12 overflow-hidden rounded-xl bg-mist">
                        <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                      </span>
                      <span className="text-[13px]">
                        <span className="block font-semibold leading-tight">{item.name}</span>
                        <span className="text-pine/50">
                          ×{item.quantity} · {pkr(item.price)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
