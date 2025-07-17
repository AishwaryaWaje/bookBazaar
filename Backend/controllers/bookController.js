import Book from "../models/Book.js";

export const getBooks = async (req, res) => {
  try {
    const { title, author, genere, condition, minPrice, maxPrice } = req.query;

    const filters = {};
    if (title) filters.title = { $regex: title, $options: "i" };
    if (author) filters.author = { $regex: author, $options: "i" };
    if (genere) filters.genere = genere;
    if (condition) filters.condition = condition;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const books = await Book.find(filters).populate("listedBy", "username");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, author, genere, condition, price } = req.body;

    const newBook = new Book({
      title,
      author,
      genere,
      condition,
      price,
      image: req.file?.path || "",
      listedBy: req.user.userId,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Failed to create book", error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || book.listedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to update this book" });
    }

    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update book", error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || book.listedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this book" });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete book", error: err.message });
  }
};

export const searchBook = async (req, res) => {
  const query = req.query.q;
  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
