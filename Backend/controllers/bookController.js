import Book from "../models/Book.js";
export const getBooks = async (req, res) => {
  try {
    const {
      title,
      author,
      genere,
      condition,
      minPrice,
      maxPrice,
      page = 1,
      limit = 28,
    } = req.query;

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

    const skip = (Number(page) - 1) * Number(limit);

    const [books, total] = await Promise.all([
      Book.find(filters).skip(skip).limit(Number(limit)).populate("listedBy", "username"),
      Book.countDocuments(filters),
    ]);

    res.status(200).json({
      books,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
};

export const getGenres = async (req, res) => {
  try {
    const genres = await Book.distinct("genere");
    res.json(genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ message: "Server error" });
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
      image: req.file ? req.file.path : "",
      listedBy: req.user.userId,
    });

    await newBook.save();
    await newBook.populate("listedBy", "username");

    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Failed to create book", error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const userId = req.user.userId;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.listedBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this book" });
    }

    const update = {};
    if (req.body.title) update.title = req.body.title;
    if (req.body.author) update.author = req.body.author;
    if (req.body.price) update.price = req.body.price;
    if (req.body.genere) update.genere = req.body.genere;
    if (req.body.condition) update.condition = req.body.condition;
    if (req.file) update.image = req.file.path;

    const updated = await Book.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).populate("listedBy", "username");

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update book", error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const userId = req.user.userId;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.listedBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this book" });
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete book", error: err.message });
  }
};

export const searchBook = async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);
  const regex = new RegExp(q, "i");
  try {
    const books = await Book.find({
      $or: [{ title: regex }, { author: regex }, { genere: regex }],
    }).populate("listedBy", "username name");
    res.json(books);
  } catch (err) {
    console.error("Search error", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ listedBy: req.user.userId }).populate("listedBy", "username");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your books", error: err.message });
  }
};
