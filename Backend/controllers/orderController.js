import Order from "../models/Order.js";
import Book from "../models/Book.js";

export const placeOrder = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.userId;

  try {
    const book = await Book.findById(bookId).populate("listedBy");

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.listedBy._id.toString() == userId)
      return res.status(400).json({ message: "You cannot order your own book" });

    const deliveryFee = 19;
    const total = book.price + deliveryFee;

    const newOrder = await Order.create({
      buyer: userId,
      seller: book.listedBy._id,
      book: book._id,
      price: book.price,
      deliveryFee,
      total,
    });
    res.status(201).json(newOrder);
  } catch (e) {
    res.status(500).json({ message: "Failed to place order", error: e.Message });
  }
};

export const getMyOrders = async (req, res) => {
  const userId = req.user.userId;
  const orders = await Order.find({ buyer: userId }).populate("book seller");
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  res.json(order);
};
