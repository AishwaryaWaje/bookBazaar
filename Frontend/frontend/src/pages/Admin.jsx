import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAdminUser, logoutAdmin } from "../utils/AuthUtils";
import { FiTrash2, FiEdit3 } from "react-icons/fi";

const API = `${import.meta.env.VITE_ADMIN_API_URL}/api/admin`;

const fetchAllBooks = async () => {
  return await axios.get(`${API}/books`, { withCredentials: true });
};

const deleteBookAdmin = async (id) => {
  return await axios.delete(`${API}/books/${id}`, { withCredentials: true });
};

const fetchAnalytics = async () => {
  return await axios.get(`${API}/analytics`, { withCredentials: true });
};

const updateBook = async (id, updatedData) => {
  return await axios.put(`${API}/books/${id}`, updatedData, { withCredentials: true });
};

export default function Admin() {
  const [books, setBooks] = useState([]);
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalBooks: 0 });
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBookId, setEditingBookId] = useState(null);
  const [editData, setEditData] = useState({ title: "", author: "", genre: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const u = getAdminUser();
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
        logoutAdmin();
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

  const startEditing = (book) => {
    setEditingBookId(book._id);
    setEditData({ title: book.title, author: book.author, genre: book.genere || "" });
  };

  const saveEdit = async () => {
    try {
      await updateBook(editingBookId, editData);
      setEditingBookId(null);
      loadData();
    } catch (err) {
      console.error("Update failed:", err.response?.data?.message || err.message);
    }
  };

  const cancelEdit = () => {
    setEditingBookId(null);
    setEditData({ title: "", author: "", genre: "" });
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/bookbazaar-admin");
  };

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || authorMatch;
  });

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

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>No book listings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow rounded p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              {editingBookId === book._id ? (
                <div className="w-full">
                  <input
                    className="border p-1 rounded mb-2 w-full"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Title"
                  />
                  <input
                    className="border p-1 rounded mb-2 w-full"
                    value={editData.author}
                    onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                    placeholder="Author"
                  />
                  <input
                    className="border p-1 rounded w-full"
                    value={editData.genre}
                    onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
                    placeholder="Genre"
                  />
                  <div className="mt-2 flex gap-2">
                    <button onClick={saveEdit} className="bg-blue-600 text-white px-3 py-1 rounded">
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-3 py-1 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 flex-1">
                    <span className="font-semibold">{book.title}</span> &nbsp; by {book.author}{" "}
                    &nbsp; | &nbsp; Listed by:{" "}
                    <span className="text-blue-600">{book.listedBy?.username || "N/A"}</span>
                  </p>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => startEditing(book)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Book">
                      <FiEdit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Book">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
