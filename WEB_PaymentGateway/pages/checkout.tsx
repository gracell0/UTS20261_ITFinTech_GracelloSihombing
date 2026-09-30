import Link from "next/link";
import { useCart } from "../context/CartContext";
import { calcTotals, rp } from "../lib/format";

export default function Checkout() {
  const { items, changeQty, subtotal } = useCart();
  const t = calcTotals(subtotal);

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 pb-8 shadow-xl">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-100 bg-white px-4 py-3">
        <Link href="/" className="text-sm text-gray-600 hover:text-indigo-600">‹ Back</Link>
        <span className="font-bold text-gray-900">Checkout</span>
      </header>

      {items.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <p className="text-5xl">🛒</p>
          <p className="mt-3 text-gray-500">Keranjang kosong</p>
          <Link href="/" className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2 text-white">
            Pilih produk
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3 px-4 pt-4">
            {items.map((i) => (
              <li key={i.productId} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl">🛍️</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900">{i.name}</p>
                  <div className="mt-1 inline-flex items-center overflow-hidden rounded-lg border border-gray-200">
                    <button onClick={() => changeQty(i.productId, -1)} className="h-8 w-8 hover:bg-gray-100">−</button>
                    <span className="w-8 text-center text-sm font-medium">{i.qty}</span>
                    <button onClick={() => changeQty(i.productId, 1)} className="h-8 w-8 hover:bg-gray-100">+</button>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">{rp(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>

          <div className="mx-4 mt-4 space-y-2 rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-gray-100">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{rp(t.subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax (11%)</span><span>{rp(t.tax)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{rp(t.shipping)}</span></div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
              <span>Total</span><span>{rp(t.total)}</span>
            </div>
          </div>

          <div className="px-4 pt-4">
            <Link
              href="/payment"
              className="block rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white shadow hover:bg-indigo-700 active:scale-[0.99]"
            >
              Continue to Payment →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}