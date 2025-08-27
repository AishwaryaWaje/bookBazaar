import mongoose from "mongoose";

/**
 * @typedef {object} Wishlist
 * @property {mongoose.Schema.Types.ObjectId} user - The ID of the user who owns this wishlist item.
 * @property {mongoose.Schema.Types.ObjectId} book - The ID of the book added to the wishlist.
 */
const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Types.ObjectId, ref: "Book", required: true },
});

/**
 * Mongoose model for Wishlist.
 * @type {mongoose.Model<Wishlist>}
 */
const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
