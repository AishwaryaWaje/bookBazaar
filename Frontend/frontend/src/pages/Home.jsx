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

  const getListedByLabel = (listedBy) => {
    if (!listedBy) return "Unknown";
    if (user && user._id && listedBy._id === user._id) return "You";
    if (listedBy.username) return listedBy.username;
    if (listedBy.name) return listedBy.name;
    return "Unknown";
  };

  if (loading)
    return <div className="text-center py-10 text-xl font-semibold">Loading books...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.slice(0, 28).map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col w-full max-w-xs mx-auto">
            <img
              src={book.image || "https://via.placeholder.com/250x200?text=No+Image"}
              alt={book.title}
              className="w-full h-48 object-contain bg-gray-100 p-2"
            />

            <div className="p-3 flex flex-col flex-grow text-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{book.title}</h3>
              <p className="text-gray-600 mb-1">by {book.author}</p>
              <p className="text-gray-500 text-xs mb-1">
                <span className="font-medium">Genre:</span> {book.genere || "N/A"}
              </p>
              <p className="text-gray-500 text-xs mb-1">
                <span className="font-medium">Condition:</span> {book.condition || "N/A"}
              </p>
              <p className="text-green-600 font-bold text-base mt-2">₹{book.price}</p>
              <p className="text-xs text-gray-400 mt-1">
                Listed by: {getListedByLabel(book.listedBy)}
              </p>

              <div className="mt-auto flex justify-between gap-2 pt-3">
                <button
                  onClick={() => handleAddToWishlist(book._id)}
                  className="w-1/2 bg-blue-500 text-white py-1 text-xs rounded-md hover:bg-blue-600 transition">
                  Add to Wishlist
                </button>
                <button
                  onClick={() => handleAddToCart(book._id)}
                  className="w-1/2 bg-green-500 text-white py-1 text-xs rounded-md hover:bg-green-600 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div className="col-span-full text-center text-gray-500 text-sm py-8">
            No books found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
