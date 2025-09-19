import React, { useEffect, useState } from "react";
import axios from "axios";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { getCurrentUser, getToken } from "../utils/AuthUtils";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

/**
 * @description Home page component displaying list of books
 * @returns {JSX.Element} The Home page
 */
const Home = () => {
  /** @type {[Array, Function]} */
  const [books, setBooks] = useState([]);
  /** @type {[boolean, Function]} */
  const [loading, setLoading] = useState(true);
  /** @type {[Array, Function]} */
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  /**
   * @description Fetches all books from the API
   * @returns {Promise<void>}
   */
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/api/books`);
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Fetches wishlist for logged-in user
   * @returns {Promise<void>}
   */
  const fetchWishlist = async () => {
    try {
      const user = getCurrentUser();
      if (!user) return;

      const token = getToken();
      const res = await axios.get(`${API}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlist(res.data.map((item) => item.book?._id));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchWishlist();
  }, []);

  /**
   * @description Toggles book in wishlist
   * @param {string} bookId
   * @returns {Promise<void>}
   */
  const handleWishlistToggle = async (bookId) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      if (wishlist.includes(bookId)) {
        await axios.delete(`${API}/api/wishlist/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(wishlist.filter((id) => id !== bookId));
      } else {
        await axios.post(
          `${API}/api/wishlist`,
          { bookId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist([...wishlist, bookId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  /**
   * @description Handles clicking on a book card
   * @param {Object} book
   */
  const handleBookClick = (book) => {
    navigate(`/books/${book._id}`);
  };

  /**
   * @description Returns label for listedBy field
   * @param {string} listedBy
   * @returns {string}
   */
  const getListedByLabel = (listedBy) => {
    switch (listedBy) {
      case "user":
        return "User";
      case "admin":
        return "Admin";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Books</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => {
            const isInWishlist = wishlist.includes(book._id);

            return (
              <div
                key={book._id}
                onClick={() => handleBookClick(book)}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col w-full max-w-xs mx-auto cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100">
                {/* Wishlist button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(book._id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition transform">
                  {isInWishlist ? (
                    <HeartSolid className="h-6 w-6 text-red-500 drop-shadow-md" />
                  ) : (
                    <HeartOutline className="h-6 w-6 text-gray-600 hover:text-red-500" />
                  )}
                </button>

                {/* Book image */}
                <div className="relative">
                  <img
                    src={book.image || "https://via.placeholder.com/250x200?text=No+Image"}
                    alt={book.title}
                    className="w-full h-56 object-cover bg-gray-100"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                {/* Book info */}
                <div className="p-4 flex flex-col flex-grow text-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-2 italic">by {book.author}</p>

                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                    <p>
                      <span className="font-medium">Genre:</span> {book.genere || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Condition:</span> {book.condition || "N/A"}
                    </p>
                  </div>

                  <div className="mt-auto flex justify-between items-center pt-3">
                    <p className="text-green-600 font-extrabold text-lg">₹{book.price}</p>
                    <span className="text-xs text-gray-400">
                      Listed by: {getListedByLabel(book.listedBy)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
