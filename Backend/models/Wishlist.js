import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Types.ObjectId, ref: "Book", required: true },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
