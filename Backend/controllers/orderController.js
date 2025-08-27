import Order from "../models/Order.js";
import Book from "../models/Book.js";

/**
 * @description Places a new order for a book.
 * @route POST /api/orders
 * @param {object} req - The request object.
 * @param {string} req.body.bookId - The ID of the book to be ordered.
 * @param {object} req.user - The authenticated user object (from `protect` middleware).
 * @param {object} res - The response object.
 * @returns {object} - A JSON object representing the newly placed order.
 * @throws {object} - A JSON object with an error message if the book is not found, owned by the user, already ordered, or placing the order fails.
 */
export const placeOrder = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.userId;

  try {
    const book = await Book.findById(bookId).populate("listedBy");

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.listedBy._id.toString() === userId) {
      return res.status(400).json({ message: "You cannot order your own book" });
    }
    if (book.isOrdered) {
      return res.status(400).json({ message: "This book has already been ordered." });
    }

    const deliveryFee = 19;
    const total = book.price + deliveryFee;

    let newOrder = await Order.create({
      buyer: userId,
      seller: book.listedBy._id,
      book: book._id,
      price: book.price,
      deliveryFee,
      total,
    });

    book.isOrdered = true;
    await book.save();

    newOrder = await newOrder.populate("book seller");

    res.status(201).json(newOrder);
  } catch (e) {
    res.status(500).json({ message: "Failed to place order", error: e.message });
  }
};

/**
 * @description Retrieves all orders placed by the authenticated user.
 * @route GET /api/orders/my-orders
 * @param {object} req - The request object.
 * @param {object} req.user - The authenticated user object (from `protect` middleware).
 * @param {object} res - The response object.
 * @returns {Array<object>} - A JSON array of order objects, populated with book and seller details.
 * @throws {object} - A JSON object with an error message if fetching orders fails.
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ buyer: userId }).populate("book seller");
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * @description Retrieves all orders in the system (Admin only).
 * @route GET /api/orders/all
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Array<object>} - A JSON array of all order objects, populated with book, buyer, and seller details.
 * @throws {object} - A JSON object with an error message if fetching all orders fails.
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("book buyer seller");
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

/**
 * @description Updates the delivery status of an order by its ID (Admin only).
 * @route PUT /api/orders/:id/status
 * @param {object} req - The request object.
 * @param {string} req.params.id - The ID of the order to update.
 * @param {string} req.body.status - The new delivery status (e.g., "ITEM_COLLECTED", "DELIVERED").
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with the updated order data.
 * @throws {object} - A JSON object with an error message if updating order status fails.
 */
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { deliveryStatus: status },
      { new: true }
    ).populate("book seller");
    res.json(order);
  } catch (e) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
