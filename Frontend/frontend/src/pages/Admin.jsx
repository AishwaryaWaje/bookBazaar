import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { logoutAdmin, getAdminUser } from "../utils/AuthUtils";
import { FiTrash2 } from "react-icons/fi";

const API = `${import.meta.env.VITE_API_URL}/api/admin`;

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: "", author: "", genre: "" });
  const navigate = useNavigate();
  const admin = getAdminUser();

  useEffect(() => {
    if (!admin || !admin.isAdmin) {
      navigate("/bookbazaar-admin", { replace: true });
    } else {
      fetchAllBooks();
    }
  }, []);

  const fetchAllBooks = async () => {
    try {
      const res = await axios.get(`${API}/books`, { withCredentials: true });
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/books/${id}`, { withCredentials: true });
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(`${API}/books/${id}`, editData, { withCredentials: true });
      setEditId(null);
      setEditData({ title: "", author: "", genre: "" });
      fetchAllBooks();
    } catch (err) {
      console.error("Failed to update book:", err);
    }
  };

  const startEditing = (book) => {
    setEditId(book._id);
    setEditData({
      title: book.title,
      author: book.author,
      genre: book.genre || book.genere || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({ title: "", author: "", genre: "" });
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/bookbazaar-admin");
  };

  if (!admin || !admin.isAdmin) return <Navigate to="/bookbazaar-admin" replace />;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="space-y-4">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {editId === book._id ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="border p-2 rounded w-full sm:w-auto"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={editData.author}
                  onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                  className="border p-2 rounded w-full sm:w-auto"
                  placeholder="Author"
                />
                <input
                  type="text"
                  value={editData.genre}
                  onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
                  className="border p-2 rounded w-full sm:w-auto"
                  placeholder="Genre"
                />
                <button
                  onClick={() => handleEdit(book._id)}
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600">
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                <div className="text-gray-800 space-x-4">
                  <span className="font-semibold">{book.title}</span>
                  <span className="text-sm text-gray-500">by {book.author}</span>
                  <span className="text-sm text-gray-500">
                    | Genre: {book.genre || book.genere || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => startEditing(book)}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
