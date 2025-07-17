import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/AuthUtils";
import { useNavigate } from "react-router-dom";

const MyBooks = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books/mine", {
          withCredentials: true,
        });
        setBooks(res.data || []);
      } catch (err) {
        console.error("Error fetching my books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBooks();
  }, [user]);

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        withCredentials: true,
      });
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      console.error("Failed to delete book", err);
      alert("Delete failed.");
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-lg text-red-600">Please login to view your books.</div>
    );
  }

  if (loading) return <div className="text-center py-10 text-xl font-semibold">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Books</h2>
      {books.length === 0 ? (
        <div className="text-gray-500">You haven't uploaded any books yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
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

                <div className="mt-auto flex justify-between gap-2 pt-3">
                  <button
                    onClick={() => navigate(`/edit-book/${book._id}`)}
                    className="w-1/2 bg-yellow-500 text-white py-1 text-xs rounded-md hover:bg-yellow-600 transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="w-1/2 bg-red-500 text-white py-1 text-xs rounded-md hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
