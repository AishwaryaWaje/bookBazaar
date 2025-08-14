import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiEdit, FiSave, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logoutAdmin, getToken } from "../utils/AuthUtils";

const API = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [editingBookId, setEditingBookId] = useState(null);
  const [editedBook, setEditedBook] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const token = getToken();

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/books`, authHeaders);
      setBooks(res.data);
      setFilteredBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/analytics`, authHeaders);
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`${API}/api/admin/books/${bookId}`, authHeaders);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (bookId) => {
    try {
      await axios.put(`${API}/api/admin/books/${bookId}`, editedBook, authHeaders);
      setEditingBookId(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditChange = (e) => {
    setEditedBook({ ...editedBook, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/bookbazaar-admin");
  };

  useEffect(() => {
    if (!token) {
      navigate("/bookbazaar-admin");
      return;
    }
    fetchBooks();
    fetchAnalytics();
  }, [token]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={handleSearch}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <p>Total Books: {analytics.totalBooks || 0}</p>
        <p>Total Users: {analytics.totalUsers || 0}</p>
      </div>

      <div>
        {filteredBooks.map((book) => (
          <div key={book._id} className="flex justify-between items-center border p-2 mb-2 rounded">
            {editingBookId === book._id ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={editedBook.title || ""}
                  onChange={handleEditChange}
                  className="border p-1 rounded"
                />
                <input
                  type="text"
                  name="author"
                  value={editedBook.author || ""}
                  onChange={handleEditChange}
                  className="border p-1 rounded"
                />
                <button onClick={() => handleSave(book._id)} className="text-green-500 ml-2">
                  <FiSave />
                </button>
                <button onClick={() => setEditingBookId(null)} className="text-red-500 ml-2">
                  <FiX />
                </button>
              </>
            ) : (
              <>
                <span>
                  {book.title} by {book.author}
                </span>
                <div>
                  <button
                    onClick={() => {
                      setEditingBookId(book._id);
                      setEditedBook(book);
                    }}
                    className="text-blue-500 mr-2">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(book._id)} className="text-red-500">
                    <FiTrash2 />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
