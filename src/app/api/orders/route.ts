import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { shippingFor } from "@/lib/format";

type CartLine = { slug?: string; qty?: number };

type CheckoutBody = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal?: string;
  paymentMethod?: string;
  items?: CartLine[];
};

function orderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `VS-${stamp}${rand}`;
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const phone = body.phone?.trim() ?? "";
  const address = body.address?.trim() ?? "";
  const city = body.city?.trim() ?? "";
  const postal = body.postal?.trim() || null;
  const paymentMethod = body.paymentMethod === "card" ? "card" : "cod";
  const lines = Array.isArray(body.items) ? body.items : [];

  const missing: string[] = [];
  if (name.length < 2) missing.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) missing.push("email");
  if (phone.replace(/\D/g, "").length < 10) missing.push("phone");
  if (address.length < 8) missing.push("address");
  if (city.length < 2) missing.push("city");
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Please complete the highlighted fields.", fields: missing },
      { status: 400 }
    );
  }

  const cleanLines = lines
    .map((l) => ({ slug: String(l.slug ?? ""), qty: Math.max(1, Math.min(20, Number(l.qty) || 1)) }))
    .filter((l) => l.slug.length > 0);

  if (cleanLines.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(products)
    .where(inArray(products.slug, cleanLines.map((l) => l.slug)));

  if (rows.length !== cleanLines.length) {
    return NextResponse.json(
      { error: "Something in your bag is no longer available." },
      { status: 409 }
    );
  }

  const bySlug = new Map(rows.map((p) => [p.slug, p]));
  const priced = cleanLines.map((l) => {
    const p = bySlug.get(l.slug)!;
    return { product: p, qty: l.qty };
  });

  const subtotal = priced.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const session = await getSession();
  const number = orderNumber();

  try {
    await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: number,
          userId: session?.id ?? null,
          name,
          email,
          phone,
          address,
          city,
          postal,
          paymentMethod,
          subtotal,
          shipping,
          total,
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        priced.map((l) => ({
          orderId: order.id,
          productId: l.product.id,
          name: l.product.name,
          image: l.product.image,
          price: l.product.price,
          quantity: l.qty,
        }))
      );
    });
  } catch (err) {
    console.error("[verde] order failed:", err);
    return NextResponse.json(
      { error: "We couldn't place that order — please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, orderNumber: number, total });
}
