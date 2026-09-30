import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import Product from "../../models/Product";
import Checkout from "../../models/Checkout";
import Payment from "../../models/Payment";
import { calcTotals } from "../../lib/format";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await dbConnect();
    const { items, shippingAddress, method } = req.body as {
      items: { productId: string; qty: number }[];
      shippingAddress: string;
      method: string;
    };
    if (!items?.length || !shippingAddress) return res.status(400).json({ error: "Data tidak lengkap" });

    // harga diambil dari DB, bukan dari client
    const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } });
    const lines = items.map((i) => {
      const p = products.find((x: any) => String(x._id) === i.productId);
      if (!p) throw new Error("Produk tidak ditemukan");
      return { productId: p._id, name: p.name, price: p.price, qty: Math.max(1, Math.floor(i.qty)) };
    });
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const t = calcTotals(subtotal);

    const checkout = await Checkout.create({
      items: lines,
      subtotal: t.subtotal,
      tax: t.tax,
      total: t.total,
      shippingAddress,
      status: "pending",
    });

    const externalId = `INV-${checkout._id}`;
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const xr = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(process.env.XENDIT_SECRET_KEY + ":").toString("base64"),
      },
      body: JSON.stringify({
        external_id: externalId,
        amount: t.total,
        currency: "IDR",
        description: `Pembayaran order ${checkout._id}`,
        success_redirect_url: `${appUrl}/success?id=${checkout._id}`,
        failure_redirect_url: `${appUrl}/payment`,
      }),
    });
    const inv = await xr.json();
    if (!xr.ok) throw new Error(inv.message || "Xendit error");

    await Payment.create({
      checkoutId: checkout._id,
      externalId,
      xenditInvoiceId: inv.id,
      invoiceUrl: inv.invoice_url,
      amount: t.total,
      method,
      status: "PENDING",
    });

    res.json({ checkoutId: checkout._id, invoiceUrl: inv.invoice_url });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}