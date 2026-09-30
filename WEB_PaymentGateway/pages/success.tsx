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
    <div className="mx-auto min-h-screen max-w-md bg-stone-50 px-6 pt-20 text-center shadow-2xl">
      <div className="rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-stone-100">
        {paid ? (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl text-green-600">✓</div>
        ) : (
          <div className="mx-auto h-24 w-24 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
        )}
        <h1 className="mt-6 text-2xl font-bold text-stone-900">
          {paid ? "Pembayaran LUNAS" : "Menunggu konfirmasi pembayaran..."}
        </h1>
        {order && <p className="mt-3 text-xl font-bold text-orange-600">{rp(order.total)}</p>}
        <span
          className={`mt-3 inline-block rounded-full px-4 py-1 text-xs font-semibold ${
            paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          Status: {order?.status ?? "..."}
        </span>
        <div className="mt-8">
          <Link href="/" className="inline-block rounded-full bg-orange-500 px-7 py-3 font-medium text-white shadow-md shadow-orange-200 hover:bg-orange-600">
            Kembali belanja
          </Link>
        </div>
      </div>
    </div>
  );
}