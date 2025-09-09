import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../utils/AuthUtils";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import ChatModal from "../components/chat/ChatModel";

const API = import.meta.env.VITE_API_URL;
/**
 * @description SearchResults component displays books based on a search query from the URL.
 * Allows users to add/remove books from their wishlist.
 * @returns {JSX.Element} The SearchResults page component.
 */
const SearchResults = () => {
  const location = useLocation();
  /** @type {string} */
  const query = new URLSearchParams(location.search).get("q") || "";
  /** @type {Array<object>} */
  const [books, setBooks] = useState([]);
  /** @type {boolean} */
  const [loading, setLoading] = useState(false);
  /** @type {Array<string>} */
  const [wishlistIds, setWishlistIds] = useState([]);
  /** @type {object|null} */
  const [activeChat, setActiveChat] = useState(null);
  const user = getCurrentUser();
  const navigate = useNavigate();

  /**
   * @description Effect hook to fetch the user's wishlist on component mount if a user is authenticated.
   * Populates `wishlistIds` with book IDs from the user's wishlist.
   * @returns {Promise<void>}
   */
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await axios.get(`${API}/api/wishlist`, {
          withCredentials: true,
        });
        setWishlistIds(res.data.map((item) => item.book._id));
      } catch (err) {
        console.error("Error fetching wishlist", err);
      }
    })();
  }, [user]);

  /**
   * @description Effect hook to fetch search results based on the query parameter.
   * Includes an AbortController to cancel previous requests if the query changes.
   * Manages loading state during the fetch operation.
   * @returns {function(): void} Cleanup function to abort the fetch request.
   */
  useEffect(() => {
    if (query.trim() === "") {
      setBooks([]);
      return;
    }

    const controller = new AbortController();
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/books/search?q=${encodeURIComponent(query)}`, {
          withCredentials: true,
          signal: controller.signal,
        });
        setBooks(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") console.error("Error fetching search results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [query]);

  /**
   * @description Toggles a book's presence in the user's wishlist (add or remove).
   * Requires user authentication.
   * @param {string} bookId - The ID of the book to toggle in the wishlist.
   * @returns {Promise<void>}
   */
  const toggleWishlist = async (bookId) => {
    if (!user) return alert("Please login to manage wishlist.");
    try {
      if (wishlistIds.includes(bookId)) {
        await axios.delete(`${API}/api/wishlist/${bookId}`, {
          withCredentials: true,
        });
        setWishlistIds((prev) => prev.filter((id) => id !== bookId));
      } else {
        await axios.post(`${API}/api/wishlist`, { bookId }, { withCredentials: true });
        setWishlistIds((prev) => [...prev, bookId]);
      }
    } catch (err) {
      console.error("Error updating wishlist", err);
    }
  };

  /**
   * @description Generates a display label for the book's lister.
   * @param {object} listedBy - The user object of the book's lister.
   * @returns {string} The display label ("You", username, or "Unknown").
   */
  const getListedByLabel = (listedBy) => {
    if (!listedBy) return "Unknown";
    if (user && listedBy._id === user._id) return "You";
    if (listedBy.username) return listedBy.username;
    return "Unknown";
  };

  /**
   * @description Handles clicking on a book card, opening a chat modal or redirecting to login.
   * @param {object} book - The book object that was clicked.
   * @returns {Promise<void>}
   */
  const handleBookClick = async (book) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const existing = await axios.post(
        `${API}/api/conversations`,
        { bookId: book._id },
        {
          withCredentials: true,
        }
      );

      if (existing.data && existing.data._id) {
        setActiveChat({ book, conversationId: existing.data._id });
        return;
      }
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        console.error("Error checking conversation:", err.response.data);
        alert("Unable to open chat.");
        return;
      }
    }

    if (book.listedBy?._id === user._id) {
      alert("You cannot chat about your own listing until someone messages you.");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/conversations`,
        { bookId: book._id },
        { withCredentials: true }
      );
      setActiveChat({ book, conversationId: res.data._id });
    } catch (createErr) {
      console.error("Failed to create chat:", createErr.response?.data || createErr);
      alert("You can't open this chat as you have posted this.");
    }
  };

  if (query.trim() === "")
    return <div className="text-center py-10 text-gray-500">Start typing to search books...</div>;

  if (loading)
    return <div className="text-center text-gray-500 text-sm py-8">Searching “{query}”...</div>;

  return (
    <div className="p-4">
      {books.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-8">No books found for “{query}”.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              onClick={() => handleBookClick(book)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col relative w-full max-w-xs mx-auto">
              <button
                onClick={() => toggleWishlist(book._id)}
                className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md hover:scale-110 transition">
                {wishlistIds.includes(book._id) ? (
                  <HeartSolid className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartOutline className="w-6 h-6 text-gray-400" />
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
          ))}
        </div>
      )}
      {activeChat && (
        <ChatModal
          book={activeChat.book}
          conversationId={activeChat.conversationId}
          currentUser={user}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default SearchResults;
