import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/AuthUtils";

const API = "http://localhost:5000/api/admin";

const fetchAllBooks = async (token) => {
  return await axios.get(`${API}/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteBookAdmin = async (id, token) => {
  return await axios.delete(`${API}/books/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const fetchAnalytics = async (token) => {
  return await axios.get(`${API}/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const [resBooks, resAnalytics] = await Promise.all([
        fetchAllBooks(token),
        fetchAnalytics(token),
      ]);

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
      const token = localStorage.getItem("token");
      await deleteBookAdmin(id, token);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Logout
        </button>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-600">Total Users</p>
          <h2 className="text-2xl font-bold text-blue-600">{analytics.totalUsers}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-600">Total Books</p>
          <h2 className="text-2xl font-bold text-green-600">{analytics.totalBooks}</h2>
        </div>
      </div>

      {/* Book Listings */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Book Listings</h2>
      {books.length === 0 ? (
        <p className="text-gray-500">No book listings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 bg-white shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Author</th>
                <th className="p-3 border">Listed By</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-t">
                  <td className="p-3 border">{book.title}</td>
                  <td className="p-3 border">{book.author}</td>
                  <td className="p-3 border">{book.listedBy?.username || "N/A"}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
