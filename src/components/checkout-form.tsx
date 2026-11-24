"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Banknote,
  CreditCard,
  LoaderCircle,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/components/cart";
import { pkr, shippingFor } from "@/lib/format";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [badFields, setBadFields] = useState<string[]>([]);
  const [payment, setPayment] = useState<"cod" | "card">("cod");

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBadFields([]);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      city: String(form.get("city") ?? ""),
      postal: String(form.get("postal") ?? ""),
      paymentMethod: payment,
      items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "That didn't go through — please try again.");
        if (Array.isArray(data.fields)) setBadFields(data.fields);
        setPending(false);
        return;
      }

      clear();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch {
      setError("Network hiccup — please try again.");
      setPending(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
        <span className="rounded-full bg-mist p-6">
          <ShoppingBag className="h-8 w-8 text-fern" />
        </span>
        <h2 className="mt-6 font-display text-3xl">Your bag is empty</h2>
        <p className="mt-3 text-sm leading-relaxed text-pine/60">
          Quick checkout only works when there&apos;s something to check out.
          Fair enough, we think.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-pine px-7 py-4 text-sm font-semibold text-paper transition hover:bg-forest"
        >
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:gap-14"
    >
      <div className="space-y-9">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            {error}
          </motion.p>
        )}

        <fieldset>
          <Legend step="01" title="Who it's for" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label="Full name" name="name" placeholder="Ayesha Kakar" autoComplete="name" invalid={badFields.includes("name")} />
            <Input label="Phone" name="phone" type="tel" placeholder="03xx xxxxxxx" autoComplete="tel" invalid={badFields.includes("phone")} />
            <Input label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" invalid={badFields.includes("email")} className="sm:col-span-2" />
          </div>
        </fieldset>

        <fieldset>
          <Legend step="02" title="Where it's going" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label="Street address" name="address" placeholder="House 12, Jinnah Town" autoComplete="street-address" invalid={badFields.includes("address")} className="sm:col-span-2" />
            <Input label="City" name="city" placeholder="Quetta" autoComplete="address-level2" invalid={badFields.includes("city")} />
            <Input label="Postal code (optional)" name="postal" placeholder="87300" autoComplete="postal-code" />
          </div>
        </fieldset>

        <fieldset>
          <Legend step="03" title="How you're paying" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <PaymentOption
              active={payment === "cod"}
              onClick={() => setPayment("cod")}
              icon={<Banknote className="h-5 w-5" />}
              title="Cash on delivery"
              note="Pay the rider when it arrives. Zero risk."
            />
            <PaymentOption
              active={payment === "card"}
              onClick={() => setPayment("card")}
              icon={<CreditCard className="h-5 w-5" />}
              title="Card"
              note="Demo checkout — nothing is charged."
            />
          </div>

          {payment === "card" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 grid gap-4 overflow-hidden sm:grid-cols-2"
            >
              <Input label="Card number" name="card_demo" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
              <Input label="Expiry" name="exp_demo" placeholder="MM / YY" />
              <Input label="CVC" name="cvc_demo" placeholder="123" />
            </motion.div>
          )}
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] border border-pine/10 bg-cream p-6 sm:p-7">
          <h3 className="font-display text-xl">Your order</h3>

          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center gap-3">
                <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-mist">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-pine px-1 text-[10px] font-bold text-paper">
                    {item.qty}
                  </span>
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold leading-tight">{item.name}</span>
                  <span className="text-xs text-pine/55">{pkr(item.price)}</span>
                </span>
                <span className="text-sm font-semibold">{pkr(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2.5 border-t border-pine/10 pt-5 text-sm">
            <Row label="Subtotal" value={pkr(subtotal)} />
            <Row
              label="Shipping"
              value={shipping === 0 ? "Free" : pkr(shipping)}
            />
            <div className="flex items-center justify-between border-t border-pine/10 pt-3.5">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-2xl">{pkr(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-pine py-4 text-sm font-semibold text-paper transition hover:bg-forest disabled:opacity-60"
          >
            {pending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Place order — {pkr(total)}
              </>
            )}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-pine/45">
            <Lock className="h-3 w-3" />
            Details stay between you and the orchard
          </p>
        </div>
      </aside>
    </form>
  );
}

function Legend({ step, title }: { step: string; title: string }) {
  return (
    <legend className="flex items-baseline gap-3">
      <span className="font-display text-sm italic text-sage">{step}</span>
      <span className="font-display text-2xl tracking-tight">{title}</span>
    </legend>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-pine/65">
      <span>{label}</span>
      <span className="font-semibold text-pine">{value}</span>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  invalid,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  invalid?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-fern">
        {label}
      </span>
      <input
        required={name !== "postal" && !name.endsWith("_demo")}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full rounded-2xl border bg-paper px-4 py-3.5 text-sm transition placeholder:text-pine/35 focus:bg-white ${
          invalid ? "border-red-600/60" : "border-pine/15 focus:border-fern"
        }`}
      />
    </label>
  );
}

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  note,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-fern bg-mist/60 shadow-[0_0_0_1px_var(--color-fern)]"
          : "border-pine/15 bg-paper hover:border-pine/35"
      }`}
    >
      <span className={`mt-0.5 ${active ? "text-fern" : "text-pine/50"}`}>{icon}</span>
      <span>
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-pine/55">{note}</span>
      </span>
    </button>
  );
}
