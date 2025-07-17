import mongoose from "mongoose";

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
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
