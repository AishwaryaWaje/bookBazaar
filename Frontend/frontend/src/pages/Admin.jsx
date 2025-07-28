import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/AuthUtils";
import { FiTrash2 } from "react-icons/fi";
const API = "http://localhost:5000/api/admin";

const fetchAllBooks = async () => {
  return await axios.get(`${API}/books`, { withCredentials: true });
};

const deleteBookAdmin = async (id) => {
  return await axios.delete(`${API}/books/${id}`, { withCredentials: true });
};

const fetchAnalytics = async () => {
  return await axios.get(`${API}/analytics`, { withCredentials: true });
};

export default function Admin() {
  const [books, setBooks] = useState([]);
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalBooks: 0 });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);

    if (!u || !u.isAdmin) {
      navigate("/bookbazaar-admin");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resBooks, resAnalytics] = await Promise.all([fetchAllBooks(), fetchAnalytics()]);
      setBooks(resBooks.data);
      setAnalytics(resAnalytics.data);
    } catch (err) {
      console.error("Admin load error:", err.response?.data?.message || err.message);
      if (err.response?.status === 401) {
        logoutUser();
        navigate("/bookbazaar-admin");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBookAdmin(id);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.response?.data?.message || err.message);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/bookbazaar-admin");
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Total Users</p>
          <h2 className="text-3xl font-bold text-blue-700">{analytics.totalUsers}</h2>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Total Books</p>
          <h2 className="text-3xl font-bold text-green-700">{analytics.totalBooks}</h2>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-5 text-gray-800">Book Listings</h2>

      {books.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>No book listings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow rounded p-4 mb-3 flex justify-between items-center">
              <p className="text-gray-700">
                <span className="font-semibold">{book.title}</span> &nbsp; by {book.author} &nbsp; |
                &nbsp; Listed by:{" "}
                <span className="text-blue-600">{book.listedBy?.username || "N/A"}</span>
              </p>
              <button
                onClick={() => handleDelete(book._id)}
                className="text-red-600 hover:text-red-800 p-2 rounded transition"
                title="Delete Book">
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
