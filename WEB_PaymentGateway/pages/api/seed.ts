import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import Product from "../../models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if ((await Product.countDocuments()) > 0) return res.json({ message: "Sudah ada data" });

  await Product.insertMany([
    { name: "Es Teh Manis", price: 8000, category: "Drinks", description: "Teh dingin segar" },
    { name: "Kopi Susu", price: 18000, category: "Drinks", description: "Kopi susu gula aren" },
    { name: "Keripik Singkong", price: 12000, category: "Snacks", description: "Renyah, pedas manis" },
    { name: "Coklat Batang", price: 15000, category: "Snacks", description: "Dark chocolate 70%" },
    { name: "Paket Hemat A", price: 25000, category: "Bundle", description: "Es teh + keripik" },
    { name: "Paket Hemat B", price: 30000, category: "Bundle", description: "Kopi susu + coklat" },
  ]);
  res.json({ message: "Seed berhasil" });
}