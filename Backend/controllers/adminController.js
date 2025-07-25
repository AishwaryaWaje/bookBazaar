import Book from "../models/Book.js";
import User from "../models/User.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("listedBy", "username email");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
};

export const deleteBookByAdmin = async (req, res) => {
  try {
    const bookId = req.params.id;
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({ message: "Book deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete book", error: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    res.status(200).json({ totalUsers, totalBooks });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
  }
};
