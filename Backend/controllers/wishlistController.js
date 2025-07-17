import Wishlist from "../models/Wishlist.js";
import Book from "../models/Book.js";

export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existing = await Wishlist.findOne({ user: req.user.userId, book: bookId });
    if (existing) return res.status(400).json({ message: "Book already in wishlist" });

    const wishlistItem = new Wishlist({ user: req.user.userId, book: bookId });
    await wishlistItem.save();

    res.status(201).json({ message: "Book added to wishlist", wishlistItem });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist", error: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.userId }).populate("book");
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    await Wishlist.findOneAndDelete({ user: req.user.userId, book: bookId });
    res.status(200).json({ message: "Book removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove book", error: err.message });
  }
};
