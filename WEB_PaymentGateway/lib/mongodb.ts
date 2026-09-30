import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("MONGODB_URI belum diset di .env.local");

const g = global as any;
let cached = g.mongoose || (g.mongoose = { conn: null, promise: null });

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}