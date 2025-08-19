import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    price: { type: Number, required: true },
    deliveryFee: { type: Number, default: 19 },
    total: { type: Number, required: true },
    deliveryStatus: {
      type: String,
      enum: ["ORDER_PLACED", "ITEM_COLLECTED", "DELIVERED"],
      default: "ORDER_PLACED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
