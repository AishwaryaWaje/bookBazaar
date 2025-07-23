import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/AuthUtils";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import ChatModal from "../components/chat/ChatModel";
import FiltersBar from "../components/Filterbar";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [filters, setFilters] = useState({
    genere: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
  });
  const user = getCurrentUser();
  const navigate = useNavigate();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/books", {
        params: filters,
        withCredentials: true,
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters]);

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

  const handleBookClick = async (book) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const existing = await axios.get(`http://localhost:5000/api/conversations/book/${book._id}`, {
        withCredentials: true,
      });

      if (existing.data && existing.data._id) {
        setActiveChat({ book, conversationId: existing.data._id });
        return;
      }
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        console.error("Error checking conversation:", err.response.data);
        alert("Unable to open chat. ");
        return;
      }
    }

    if (book.listedBy?._id === user._id) {
      alert("You cannot chat about your own listing until someone messages you.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/conversations",
        { bookId: book._id },
        { withCredentials: true }
      );
      setActiveChat({ book, conversationId: res.data._id });
    } catch (createErr) {
      console.error("Failed to create chat:", createErr.response?.data || createErr);
      alert("You can't open this chat as you have posted this. ");
    }
  };

  if (loading)
    return <div className="text-center py-10 text-xl font-semibold">Loading books...</div>;

  return (
    <div>
      <FiltersBar filters={filters} setFilters={setFilters} />

      <div className="px-4 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.length > 0 ? (
            books.map((book) => {
              const isInWishlist = wishlistIds.has(book._id);
              return (
                <div
                  key={book._id}
                  onClick={() => handleBookClick(book)}
                  className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col w-full max-w-xs mx-auto cursor-pointer">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(book._id);
                    }}
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
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 text-sm py-8">
              No books found.
            </div>
          )}
        </div>

        {activeChat && (
          <ChatModal
            book={activeChat.book}
            conversationId={activeChat.conversationId}
            currentUser={user}
            onClose={() => setActiveChat(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
