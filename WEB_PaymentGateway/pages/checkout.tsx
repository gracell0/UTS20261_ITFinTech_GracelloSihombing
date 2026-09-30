import Link from "next/link";
import { useCart } from "../context/CartContext";
import { calcTotals, rp } from "../lib/format";

export default function Checkout() {
  const { items, changeQty, subtotal } = useCart();
  const t = calcTotals(subtotal);

  return (
    <div className="mx-auto min-h-screen max-w-md bg-stone-50 pb-10 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center gap-4 bg-white px-4 py-4 shadow-sm">
        <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700">‹</Link>
        <span className="text-lg font-bold text-stone-900">Checkout</span>
      </header>

      {items.length === 0 ? (
        <div className="px-6 py-24 text-center">
          <p className="text-6xl">🛒</p>
          <p className="mt-4 text-stone-500">Keranjang masih kosong</p>
          <Link href="/" className="mt-5 inline-block rounded-full bg-orange-500 px-6 py-2.5 font-medium text-white shadow-md shadow-orange-200">
            Pilih produk
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3 px-4 pt-4">
            {items.map((i) => (
              <li key={i.productId} className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-2xl">🛍️</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-stone-900">{i.name}</p>
                  <p className="text-xs text-stone-500">{rp(i.price)}</p>
                  <div className="mt-1.5 inline-flex items-center overflow-hidden rounded-full bg-stone-100">
                    <button onClick={() => changeQty(i.productId, -1)} className="h-8 w-8 text-lg hover:bg-stone-200">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                    <button onClick={() => changeQty(i.productId, 1)} className="h-8 w-8 text-lg hover:bg-stone-200">+</button>
                  </div>
                </div>
                <p className="font-bold text-stone-900">{rp(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>

          <div className="mx-4 mt-4 space-y-2 rounded-3xl bg-white p-5 text-sm shadow-sm ring-1 ring-stone-100">
            <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>{rp(t.subtotal)}</span></div>
            <div className="flex justify-between text-stone-600"><span>Tax (11%)</span><span>{rp(t.tax)}</span></div>
            <div className="flex justify-between text-stone-600"><span>Shipping</span><span>{rp(t.shipping)}</span></div>
            <div className="flex justify-between border-t border-dashed border-stone-200 pt-3 text-base font-bold text-stone-900">
              <span>Total</span><span className="text-orange-600">{rp(t.total)}</span>
            </div>
          </div>

          <div className="px-4 pt-5">
            <Link
              href="/payment"
              className="block rounded-full bg-orange-500 py-3.5 text-center font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-[0.99]"
            >
              Continue to Payment →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}