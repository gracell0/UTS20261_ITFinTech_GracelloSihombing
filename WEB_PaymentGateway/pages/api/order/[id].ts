import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import Checkout from "../../../models/Checkout";
import Payment from "../../../models/Payment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const checkout = await Checkout.findById(req.query.id);
  if (!checkout) return res.status(404).json({ error: "Order tidak ditemukan" });
  const payment = await Payment.findOne({ checkoutId: checkout._id });
  res.json({ status: payment?.status, total: checkout.total, items: checkout.items });
}