import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { rp, BRAND } from "../lib/format";

type Product = { _id: string; name: string; price: number; description?: string; category: string };
const CATEGORIES = ["All", "Drinks", "Snacks", "Bundle"];
const EMOJI: Record<string, string> = {
  "Es Teh Manis": "🧋",
  "Kopi Susu": "☕",
  "Keripik Singkong": "🥔",
  "Coklat Batang": "🍫",
  "Paket Hemat A": "🎁",
  "Paket Hemat B": "🎁",
};
const CAT_EMOJI: Record<string, string> = { Drinks: "🥤", Snacks: "🍿", Bundle: "🎁" };
const TILE: Record<string, string> = { Drinks: "bg-sky-100", Snacks: "bg-amber-100", Bundle: "bg-rose-100" };

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
    <div className="mx-auto min-h-screen max-w-md bg-stone-50 pb-10 shadow-2xl">
      <header
        className="sticky top-0 z-10 rounded-b-3xl px-4 pb-4 pt-4 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl">≡</button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-bold text-orange-600">
                K
              </div>
              <div className="leading-tight">
                <p className="font-bold">{BRAND}</p>
                <p className="text-[11px] text-orange-100">Minuman & camilan favoritmu</p>
              </div>
            </div>
          </div>
          <Link href="/checkout" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-xl">
            🛒
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-orange-600">
                {count}
              </span>
            )}
          </Link>
        </div>

        <div className="mt-4 flex items-center rounded-2xl bg-white px-4 shadow-md">
          <input
            className="w-full bg-transparent py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-stone-400">🔍</span>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 pb-1 pt-5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${
              category === c
                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "bg-white text-stone-600 ring-1 ring-stone-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3 px-4">
        {shown.map((p) => {
          const qty = items.find((i) => i.productId === p._id)?.qty ?? 0;
          return (
            <li key={p._id} className="flex gap-3 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
              <div
                className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl text-4xl ${
                  TILE[p.category] ?? "bg-stone-100"
                }`}
              >
                {EMOJI[p.name] ?? CAT_EMOJI[p.category] ?? "🛍️"}
              </div>
              <div className="flex min-w-0 flex-1 flex-col py-1">
                <span className="w-fit rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500">
                  {p.category}
                </span>
                <p className="mt-1 truncate font-semibold text-stone-900">{p.name}</p>
                <p className="line-clamp-1 text-xs text-stone-500">{p.description}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <p className="font-bold text-orange-600">{rp(p.price)}</p>
                  <button
                    onClick={() => add(p)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
                      qty > 0
                        ? "bg-orange-500 text-white shadow shadow-orange-200"
                        : "border border-orange-500 text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    Add + {qty > 0 && `(${qty})`}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
        {shown.length === 0 && <li className="py-12 text-center text-stone-400">Produk tidak ditemukan</li>}
      </ul>
    </div>
  );
}