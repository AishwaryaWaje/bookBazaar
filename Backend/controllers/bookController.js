import Book from "../models/Book.js";
/**
 * @description Retrieves a list of books based on various filters.
 * @route GET /api/books
 * @param {object} req - The request object.
 * @param {string} [req.query.title] - Filter books by title (case-insensitive regex).
 * @param {string} [req.query.author] - Filter books by author (case-insensitive regex).
 * @param {string} [req.query.genere] - Filter books by genre.
 * @param {string} [req.query.condition] - Filter books by condition.
 * @param {number} [req.query.minPrice] - Filter books with price greater than or equal to this value.
 * @param {number} [req.query.maxPrice] - Filter books with price less than or equal to this value.
 * @param {number} [req.query.page=1] - The page number for pagination.
 * @param {number} [req.query.limit=28] - The number of books per page.
 * @param {object} res - The response object.
 * @returns {object} - A JSON object containing an array of books, total count, current page, and total pages.
 * @throws {object} - A JSON object with an error message if fetching books fails.
 */
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

/**
 * @description Retrieves a list of all distinct book genres.
 * @route GET /api/books/genres
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Array<string>} - An array of unique genre names.
 * @throws {object} - A JSON object with an error message if fetching genres fails.
 */
export const getGenres = async (req, res) => {
  try {
    const genres = await Book.distinct("genere");
    res.json(genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Creates a new book listing.
 * @route POST /api/books
 * @param {object} req - The request object.
 * @param {string} req.body.title - The title of the book.
 * @param {string} req.body.author - The author of the book.
 * @param {string} req.body.genere - The genre of the book.
 * @param {string} req.body.condition - The condition of the book.
 * @param {number} req.body.price - The price of the book.
 * @param {object} [req.file] - The uploaded image file (if any).
 * @param {object} req.user - The authenticated user object (from `protect` middleware).
 * @param {object} res - The response object.
 * @returns {object} - A JSON object representing the newly created book.
 * @throws {object} - A JSON object with an error message if book creation fails.
 */
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

/**
 * @description Updates an existing book listing by its ID.
 * @route PUT /api/books/:id
 * @param {object} req - The request object.
 * @param {string} req.params.id - The ID of the book to update.
 * @param {object} req.body - The updated book details (title, author, genere, condition, price).
 * @param {object} [req.file] - The new uploaded image file (if any).
 * @param {object} req.user - The authenticated user object (from `protect` middleware).
 * @param {object} res - The response object.
 * @returns {object} - A JSON object representing the updated book.
 * @throws {object} - A JSON object with an error message if the book is not found, unauthorized, or update fails.
 */
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

/**
 * @description Deletes a book listing by its ID.
 * @route DELETE /api/books/:id
 * @param {object} req - The request object.
 * @param {string} req.params.id - The ID of the book to delete.
 * @param {object} req.user - The authenticated user object (from `protect` middleware).
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with a success message.
 * @throws {object} - A JSON object with an error message if the book is not found, unauthorized, or deletion fails.
 */
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

/**
 * @description Searches for books by title, author, or genre.
 * @route GET /api/books/search?q={query}
 * @param {object} req - The request object.
 * @param {string} [req.query.q] - The search query string.
 * @param {object} res - The response object.
 * @returns {Array<object>} - An array of matching book objects.
 * @throws {object} - A JSON object with an error message if the search fails.
 */
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
/**
 * @description Retrieves all books listed by the authenticated user.
 * @route GET /api/books/my-books
 * @param {object} req - The request object (should contain `req.user.userId`).
 * @param {object} res - The response object.
 * @returns {Array<object>} - An array of book objects listed by the current user.
 * @throws {object} - A JSON object with an error message if fetching user's books fails.
 */
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ listedBy: req.user.userId }).populate("listedBy", "username");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your books", error: err.message });
  }
};
