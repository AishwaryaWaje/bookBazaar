import mongoose from "mongoose";

/**
 * @typedef {object} Order
 * @property {mongoose.Schema.Types.ObjectId} buyer - The ID of the user who placed the order.
 * @property {mongoose.Schema.Types.ObjectId} seller - The ID of the user who listed the book.
 * @property {mongoose.Schema.Types.ObjectId} book - The ID of the ordered book.
 * @property {number} price - The price of the book at the time of order.
 * @property {number} [deliveryFee=19] - The delivery fee for the order.
 * @property {number} total - The total amount of the order (price + deliveryFee).
 * @property {("ORDER_PLACED"|"ITEM_COLLECTED"|"DELIVERED")} [deliveryStatus="ORDER_PLACED"] - The current status of the order delivery.
 * @property {Date} createdAt - The timestamp when the order was created.
 * @property {Date} updatedAt - The timestamp when the order was last updated.
 */
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

/**
 * Pre-save hook to update the `isOrdered` status of the associated book when a new order is created.
 * @param {function} next - The next middleware function.
 */
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
