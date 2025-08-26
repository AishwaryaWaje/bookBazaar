import Order from "../models/Order.js";
import Book from "../models/Book.js";

export const placeOrder = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.userId;

  try {
    const book = await Book.findById(bookId).populate("listedBy");

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.listedBy._id.toString() === userId) {
      return res.status(400).json({ message: "You cannot order your own book" });
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

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ buyer: userId }).populate("book seller");
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("book buyer seller");
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

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
