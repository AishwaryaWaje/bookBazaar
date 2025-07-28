import Book from "../models/Book.js";
import User from "../models/User.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("listedBy", "username email").sort({ createdAt: -1 }); // optional: newest first
    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
};

export const deleteBookByAdmin = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted by admin" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Failed to delete book", error: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalBooks] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
    ]);

    // Optionally get more analytics like active users, genres breakdown, etc.
    res.status(200).json({
      totalUsers,
      totalBooks,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
  }
};
