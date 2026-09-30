import { Schema, models, model } from "mongoose";

const PaymentSchema = new Schema(
  {
    checkoutId: { type: Schema.Types.ObjectId, ref: "Checkout", required: true },
    externalId: String,
    xenditInvoiceId: String,
    invoiceUrl: String,
    amount: Number,
    method: String,
    status: { type: String, enum: ["PENDING", "PAID", "EXPIRED"], default: "PENDING" },
    paidAt: Date,
  },
  { timestamps: true }
);

export default models.Payment || model("Payment", PaymentSchema);