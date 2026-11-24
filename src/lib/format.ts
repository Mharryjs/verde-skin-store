export function pkr(amount: number): string {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

export const FREE_SHIPPING_OVER = 5000;
export const SHIPPING_FEE = 250;

export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : SHIPPING_FEE;
}
