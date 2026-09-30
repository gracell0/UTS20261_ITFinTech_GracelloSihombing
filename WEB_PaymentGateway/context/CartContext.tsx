import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = { productId: string; name: string; price: number; qty: number };
type NewProduct = { _id: string; name: string; price: number };

type CartCtx = {
  items: CartItem[];
  add: (p: NewProduct) => void;
  changeQty: (productId: string, delta: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx>({} as CartCtx);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("cart");
      if (s) setItems(JSON.parse(s));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  const add = (p: NewProduct) =>
    setItems((prev) => {
      const found = prev.find((i) => i.productId === p._id);
      if (found) return prev.map((i) => (i.productId === p._id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { productId: p._id, name: p.name, price: p.price, qty: 1 }];
    });

  const changeQty = (productId: string, delta: number) =>
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );

  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return <Ctx.Provider value={{ items, add, changeQty, clear, count, subtotal }}>{children}</Ctx.Provider>;
}