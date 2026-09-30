import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { rp } from "../lib/format";

export default function Success() {
  const { query } = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!query.id) return;
    const load = () =>
      fetch(`/api/order/${query.id}`)
        .then((r) => r.json())
        .then(setOrder);
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [query.id]);

  const paid = order?.status === "PAID";

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 px-6 pt-20 text-center shadow-xl">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        {paid ? (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">✓</div>
        ) : (
          <div className="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        )}
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          {paid ? "Pembayaran LUNAS" : "Menunggu konfirmasi pembayaran..."}
        </h1>
        {order && <p className="mt-3 text-lg font-semibold text-indigo-600">{rp(order.total)}</p>}
        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
            paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          Status: {order?.status ?? "..."}
        </span>
        <div className="mt-8">
          <Link href="/" className="inline-block rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700">
            Kembali belanja
          </Link>
        </div>
      </div>
    </div>
  );
}