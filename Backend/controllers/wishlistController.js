import Wishlist from "../models/Wishlist.js";
import Book from "../models/Book.js";

/**
 * @description Adds a book to the authenticated user's wishlist.
 * @route POST /api/wishlist
 * @param {object} req - The request object.
 * @param {string} req.body.bookId - The ID of the book to add to the wishlist.
 * @param {object} req.user - The authenticated user object (from `protect` middleware).
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with a success message and the new wishlist item.
 * @throws {object} - A JSON object with an error message if the book is not found, already in wishlist, or addition fails.
 */
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

/**
 * @description Retrieves the authenticated user's wishlist.
 * @route GET /api/wishlist
 * @param {object} req - The request object.
 * @param {object} req.user - The authenticated user object (from `protect` middleware).
 * @param {object} res - The response object.
 * @returns {Array<object>} - A JSON array of wishlist items, populated with book details.
 * @throws {object} - A JSON object with an error message if fetching the wishlist fails.
 */
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.userId }).populate("book");
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
};

/**
 * @description Removes a book from the authenticated user's wishlist.
 * @route DELETE /api/wishlist/:bookId
 * @param {object} req - The request object.
 * @param {string} req.params.bookId - The ID of the book to remove from the wishlist.
 * @param {object} req.user - The authenticated user object (from `protect` middleware).
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with a success message.
 * @throws {object} - A JSON object with an error message if removal fails.
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    await Wishlist.findOneAndDelete({ user: req.user.userId, book: bookId });
    res.status(200).json({ message: "Book removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove book", error: err.message });
  }
};
