import mongoose from "mongoose";

/**
 * @typedef {object} Book
 * @property {string} title - The title of the book.
 * @property {string} author - The author of the book.
 * @property {string} genere - The genre of the book.
 * @property {("Brand New"|"Like New"|"Good"|"Acceptable"|"Worn"|"Damaged")} condition - The physical condition of the book.
 * @property {number} price - The selling price of the book.
 * @property {string} [image] - URL to the book's cover image.
 * @property {mongoose.Schema.Types.ObjectId} listedBy - The ID of the user who listed the book.
 * @property {boolean} [isOrdered=false] - Indicates if the book has been ordered.
 */
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genere: { type: String, required: true },
  condition: {
    type: String,
    enum: ["Brand New", "Like New", "Good", "Acceptable", "Worn", "Damaged"],
    required: true,
  },
  price: { type: Number, required: true },
  image: { type: String },
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isOrdered: { type: Boolean, default: false },
});

/**
 * Mongoose model for Book.
 * @type {mongoose.Model<Book>}
 */
const Book = mongoose.model("Book", bookSchema);
export default Book;
