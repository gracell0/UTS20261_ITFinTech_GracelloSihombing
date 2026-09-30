import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { rp } from "../lib/format";

type Product = { _id: string; name: string; price: number; description?: string; category: string };
const CATEGORIES = ["All", "Drinks", "Snacks", "Bundle"];
const ICON: Record<string, string> = { Drinks: "🥤", Snacks: "🍿", Bundle: "🎁" };

export default function SelectItems() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { add, count, items } = useCart();

  useEffect(() => {
    fetch(`/api/products?category=${category}`)
      .then((r) => r.json())
      .then(setProducts);
  }, [category]);

  const shown = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 pb-8 shadow-xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg">≡</button>
          <span className="text-lg font-bold text-gray-900">Logo</span>
        </div>
        <Link
          href="/checkout"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-gray-200"
        >
          🛒
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
      </header>

      <div className="px-4 pt-4">
        <div className="flex items-center rounded-xl bg-white px-3 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-indigo-500">
          <input
            className="w-full bg-transparent py-2.5 outline-none placeholder:text-gray-400"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-gray-400">🔍</span>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c ? "bg-indigo-600 text-white shadow" : "bg-white text-gray-600 ring-1 ring-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4 space-y-3 px-4">
        {shown.map((p) => {
          const qty = items.find((i) => i.productId === p._id)?.qty ?? 0;
          return (
            <li key={p._id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-3xl">
                {ICON[p.category] ?? "🛍️"}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate font-semibold text-gray-900">{p.name}</p>
                <p className="font-bold text-indigo-600">{rp(p.price)}</p>
                <p className="line-clamp-1 text-xs text-gray-500">{p.description}</p>
                <div className="mt-auto flex justify-end">
                  <button
                    onClick={() => add(p)}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
                      qty > 0 ? "bg-indigo-600 text-white" : "border border-indigo-600 text-indigo-600"
                    }`}
                  >
                    Add + {qty > 0 && `(${qty})`}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
        {shown.length === 0 && <li className="py-10 text-center text-gray-400">Produk tidak ditemukan</li>}
      </ul>
    </div>
  );
}