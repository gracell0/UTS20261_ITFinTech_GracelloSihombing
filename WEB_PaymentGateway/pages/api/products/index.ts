import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { category } = req.query;
  const filter = category && category !== "All" ? { category } : {};
  const products = await Product.find(filter).sort({ createdAt: 1 });
  res.json(products);
}