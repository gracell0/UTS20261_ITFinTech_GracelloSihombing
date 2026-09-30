import { Schema, models, model } from "mongoose";

const CheckoutSchema = new Schema(
  {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        qty: Number,
      },
    ],
    subtotal: Number,
    tax: Number,
    total: Number,
    shippingAddress: String,
    status: { type: String, enum: ["pending", "paid", "expired"], default: "pending" },
  },
  { timestamps: true }
);

export default models.Checkout || model("Checkout", CheckoutSchema);