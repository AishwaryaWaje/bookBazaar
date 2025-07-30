import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/AuthUtils";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) return;
    const fetchWishlist = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/wishlist", {
          withCredentials: true,
        });
        console.log("Wishlist API Response:", res.data);

        const items = Array.isArray(res.data) ? res.data : res.data.books || [];
        setWishlist(items);
      } catch (err) {
        console.error("Error fetching wishlist", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleRemove = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${bookId}`, {
        withCredentials: true,
      });

      setWishlist((prev) => prev.filter((item) => item.book?._id !== bookId));
    } catch (err) {
      console.error("Error removing from wishlist", err);
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-lg text-red-500">Please login to view wishlist.</p>;

  if (loading)
    return (
      <div className="col-span-full text-center text-gray-500 text-sm py-8">
        Loading your wishlist...
      </div>
    );

  const isEmpty = !wishlist || wishlist.length === 0;

  return (
    <div className="p-6">
      {isEmpty ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const book = item.book || item;
            return (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <img
                  src={book?.image || "https://via.placeholder.com/250x200?text=No+Image"}
                  alt={book?.title || "Book"}
                  className="w-full h-48 object-contain bg-gray-100 p-2"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/250x200?text=No+Image";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{book?.title || "Untitled"}</h3>
                  <p className="text-gray-600 text-sm">by {book?.author || "Unknown"}</p>
                  <p className="text-green-600 font-bold mt-2">
                    {book?.price != null ? `₹${book.price}` : "₹--"}
                  </p>
                  <button
                    onClick={() => handleRemove(book._id)}
                    className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
