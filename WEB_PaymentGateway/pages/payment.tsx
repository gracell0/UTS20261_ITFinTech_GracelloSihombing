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
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 pb-8 shadow-xl">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-100 bg-white px-4 py-3">
        <Link href="/checkout" className="text-sm text-gray-600 hover:text-indigo-600">‹ Back</Link>
        <span className="font-bold text-gray-900">Secure Checkout 🔒</span>
      </header>

      <div className="space-y-4 px-4 pt-4">
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="mb-2 font-semibold text-gray-900">Shipping Address</p>
          <textarea
            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            rows={3}
            placeholder="Alamat lengkap"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="mb-2 font-semibold text-gray-900">Payment Method</p>
          <div className="space-y-2">
            {METHODS.map(([v, icon, label]) => (
              <label
                key={v}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  method === v ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input type="radio" className="accent-indigo-600" checked={method === v} onChange={() => setMethod(v)} />
                <span>{icon}</span>
                <span className="text-sm font-medium text-gray-800">{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-gray-100">
          <p className="mb-1 font-semibold text-gray-900">Order Summary</p>
          <div className="flex justify-between text-gray-600"><span>Item(s)</span><span>{rp(t.subtotal)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Tax</span><span>{rp(t.tax)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{rp(t.shipping)}</span></div>
          <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
            <span>Total</span><span>{rp(t.total)}</span>
          </div>
        </section>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={confirmAndPay}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}