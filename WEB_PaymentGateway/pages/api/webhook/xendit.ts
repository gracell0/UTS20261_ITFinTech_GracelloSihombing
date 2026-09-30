import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import Checkout from "../../../models/Checkout";
import Payment from "../../../models/Payment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  if (req.headers["x-callback-token"] !== process.env.XENDIT_CALLBACK_TOKEN) {
    return res.status(401).json({ error: "Invalid callback token" });
  }

  await dbConnect();
  const { external_id, status, payment_method, paid_at } = req.body;

  const payment = await Payment.findOne({ externalId: external_id });
  if (!payment) return res.status(200).json({ message: "ignored" });

  if (status === "PAID" || status === "SETTLED") {
    payment.status = "PAID";
    payment.paidAt = paid_at ? new Date(paid_at) : new Date();
    payment.method = payment_method || payment.method;
    await payment.save();
    await Checkout.findByIdAndUpdate(payment.checkoutId, { status: "paid" });
  } else if (status === "EXPIRED") {
    payment.status = "EXPIRED";
    await payment.save();
    await Checkout.findByIdAndUpdate(payment.checkoutId, { status: "expired" });
  }

  res.status(200).json({ ok: true });
}