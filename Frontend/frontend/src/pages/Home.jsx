import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/AuthUtils";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books", {
          withCredentials: true,
        });
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddToWishlist = async (bookId) => {
    if (!user) return alert("Please login to add to wishlist.");
    try {
      await axios.post("http://localhost:5000/api/wishlist", { bookId }, { withCredentials: true });
      alert("Added to wishlist!");
    } catch (err) {
      console.error("Failed to add to wishlist", err);
    }
  };

  const handleAddToCart = async (bookId) => {
    if (!user) return alert("Please login to add to cart.");
    try {
      await axios.post("http://localhost:5000/api/cart", { bookId }, { withCredentials: true });
      alert("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading books...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Available Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white p-4 rounded-2xl shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-sm text-gray-500 mt-1">{book.description?.slice(0, 100)}...</p>
              <p className="text-green-600 font-semibold mt-2">₹{book.price}</p>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleAddToWishlist(book._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Add to Wishlist
              </button>
              <button
                onClick={() => handleAddToCart(book._id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
