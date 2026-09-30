export const TAX_RATE = 0.11;
export const SHIPPING_FEE = 10000;

export const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");

export function calcTotals(subtotal: number) {
  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  return { subtotal, tax, shipping, total: subtotal + tax + shipping };
}