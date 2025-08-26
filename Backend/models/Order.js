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

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      await mongoose.model("Book").findByIdAndUpdate(this.book, { isOrdered: true });
      console.log(`Book ${this.book} marked as ordered.`);
    } catch (error) {
      console.error("Error updating book's isOrdered status:", error);
    }
  }
  next();
});

export default mongoose.model("Order", orderSchema);
