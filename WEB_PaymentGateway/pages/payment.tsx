import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { calcTotals, rp } from "../lib/format";

const METHODS = [
  ["card", "💳", "Credit/Debit Card"],
  ["ewallet", "👛", "E-Wallet"],
  ["bank", "🏦", "Bank Transfer"],
];

export default function Payment() {
  const { items, subtotal, clear } = useCart();
  const t = calcTotals(subtotal);
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function confirmAndPay() {
    if (!address.trim()) return setError("Alamat pengiriman wajib diisi");
    if (items.length === 0) return setError("Keranjang kosong");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingAddress: address, method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pembayaran");
      clear();
      window.location.href = data.invoiceUrl;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-stone-50 pb-10 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center gap-4 bg-white px-4 py-4 shadow-sm">
        <Link href="/checkout" className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700">‹</Link>
        <span className="text-lg font-bold text-stone-900">Secure Checkout 🔒</span>
      </header>

      <div className="space-y-4 px-4 pt-4">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
          <p className="mb-3 font-semibold text-stone-900">Shipping Address</p>
          <textarea
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            rows={3}
            placeholder="Alamat lengkap"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
          <p className="mb-3 font-semibold text-stone-900">Payment Method</p>
          <div className="space-y-2">
            {METHODS.map(([v, icon, label]) => (
              <label
                key={v}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                  method === v ? "border-orange-500 bg-orange-50" : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <input type="radio" className="accent-orange-500" checked={method === v} onChange={() => setMethod(v)} />
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium text-stone-800">{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-2 rounded-3xl bg-white p-5 text-sm shadow-sm ring-1 ring-stone-100">
          <p className="mb-1 font-semibold text-stone-900">Order Summary</p>
          <div className="flex justify-between text-stone-600"><span>Item(s)</span><span>{rp(t.subtotal)}</span></div>
          <div className="flex justify-between text-stone-600"><span>Tax</span><span>{rp(t.tax)}</span></div>
          <div className="flex justify-between text-stone-600"><span>Shipping</span><span>{rp(t.shipping)}</span></div>
          <div className="flex justify-between border-t border-dashed border-stone-200 pt-3 text-base font-bold text-stone-900">
            <span>Total</span><span className="text-orange-600">{rp(t.total)}</span>
          </div>
        </section>

        {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={confirmAndPay}
          disabled={loading}
          className="w-full rounded-full bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}