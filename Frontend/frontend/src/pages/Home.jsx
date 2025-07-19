import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/AuthUtils";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch all books and shuffle them
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books", {
          withCredentials: true,
        });
        setBooks(shuffleArray(res.data));
      } catch (err) {
        console.error("Error fetching books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await axios.get("http://localhost:5000/api/wishlist", {
          withCredentials: true,
        });
        const ids = new Set(res.data.map((item) => item.book?._id));
        setWishlistIds(ids);
      } catch (err) {
        console.error("Error fetching wishlist", err);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleWishlistToggle = async (bookId) => {
    if (!user) {
      alert("Please login to manage wishlist.");
      return;
    }

    if (wishlistIds.has(bookId)) {
      try {
        await axios.delete(`http://localhost:5000/api/wishlist/${bookId}`, {
          withCredentials: true,
        });
        setWishlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(bookId);
          return newSet;
        });
      } catch (err) {
        console.error("Error removing from wishlist", err);
      }
    } else {
      try {
        await axios.post(
          "http://localhost:5000/api/wishlist",
          { bookId },
          { withCredentials: true }
        );
        setWishlistIds((prev) => new Set(prev).add(bookId));
      } catch (err) {
        console.error("Error adding to wishlist", err);
      }
    }
  };

  const getListedByLabel = (listedBy) => {
    if (!listedBy) return "Unknown";
    if (user && listedBy._id === user._id) return "You";
    if (listedBy.username) return listedBy.username;
    return "Unknown";
  };

  if (loading)
    return <div className="text-center py-10 text-xl font-semibold">Loading books...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.slice(0, 28).map((book) => {
          const isInWishlist = wishlistIds.has(book._id);
          return (
            <div
              key={book._id}
              className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col w-full max-w-xs mx-auto">
              {/* Heart Icon */}
              <button
                onClick={() => handleWishlistToggle(book._id)}
                className="absolute top-3 right-3 p-1 bg-white rounded-full shadow-md hover:scale-110 transition">
                {isInWishlist ? (
                  <HeartSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartOutline className="h-6 w-6 text-gray-500" />
                )}
              </button>

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
              </div>
            </div>
          );
        })}

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
