import Book from "../models/Book.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

/**
 * @description Get analytics data including total users and total books.
 * @route GET /api/admin/analytics
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - A JSON object containing totalUsers and totalBooks.
 * @throws {object} - A JSON object with an error message if fetching analytics fails.
 */
export const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalBooks] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
    ]);

    res.status(200).json({
      totalUsers,
      totalBooks,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
  }
};

/**
 * @description Get all books listed in the system, populated with listedBy user details.
 * @route GET /api/admin/books
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Array<object>} - An array of book objects with listedBy user information.
 * @throws {object} - A JSON object with an error message if fetching books fails.
 */
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("listedBy", "username email").sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
};

/**
 * @description Delete a book by its ID (Admin only).
 * @route DELETE /api/admin/books/:id
 * @param {object} req - The request object.
 * @param {string} req.params.id - The ID of the book to delete.
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with a success message.
 * @throws {object} - A JSON object with an error message if the book is not found or deletion fails.
 */
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

/**
 * @description Update a book's details by its ID (Admin only).
 * @route PUT /api/admin/books/:id
 * @param {object} req - The request object.
 * @param {string} req.params.id - The ID of the book to update.
 * @param {string} req.body.title - The new title of the book.
 * @param {string} req.body.author - The new author of the book.
 * @param {string} req.body.genere - The new genre of the book.
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with the updated book data.
 * @throws {object} - A JSON object with an error message if the book is not found or update fails.
 */
export const updateBookByAdmin = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, genere } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, author, genere },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ message: "Failed to update book", error: err.message });
  }
};

/**
 * @description Get all orders in the system, populated with buyer, seller, and book details (Admin only).
 * @route GET /api/admin/orders
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Array<object>} - An array of order objects with populated details.
 * @throws {object} - A JSON object with an error message if fetching orders fails.
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "username email")
      .populate("seller", "username email")
      .populate("book", "title author price")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

/**
 * @description Update the delivery status of an order (Admin only).
 * @route PUT /api/admin/orders/:id/status
 * @param {object} req - The request object.
 * @param {string} req.params.id - The ID of the order to update.
 * @param {string} req.body.status - The new delivery status.
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with the updated order data.
 * @throws {object} - A JSON object with an error message if the order is not found or update fails.
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!["ORDER_PLACED", "ITEM_COLLECTED", "DELIVERED"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status provided." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { deliveryStatus: status },
      { new: true, runValidators: true }
    )
      .populate("buyer", "username email")
      .populate("seller", "username email")
      .populate("book", "title author price");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
};
