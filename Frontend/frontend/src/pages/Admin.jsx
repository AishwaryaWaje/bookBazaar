import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiEdit, FiSave, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logoutAdmin, getToken } from "../utils/AuthUtils";

const API = import.meta.env.VITE_API_URL;

/**
 * @description Admin dashboard component for managing books and viewing analytics.
 * Requires administrator privileges.
 * @returns {JSX.Element} The Admin dashboard component.
 */
const Admin = () => {
  /** @type {Array<object>} */
  const [books, setBooks] = useState([]);
  /** @type {Array<object>} */
  const [filteredBooks, setFilteredBooks] = useState([]);
  /** @type {object} */
  const [analytics, setAnalytics] = useState({});
  /** @type {string|null} */
  const [editingBookId, setEditingBookId] = useState(null);
  /** @type {object} */
  const [editedBook, setEditedBook] = useState({});
  /** @type {string} */
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const token = getToken();

  /**
   * @description Authorization headers for API requests.
   * @type {object}
   * @property {object} headers - The headers object.
   * @property {string} headers.Authorization - The Bearer token for authorization.
   */
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  /**
   * @description Fetches all books from the admin API and updates the state.
   * @returns {Promise<void>}
   */
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/books`, authHeaders);
      setBooks(res.data);
      setFilteredBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Fetches analytics data (total users, total books) from the admin API and updates the state.
   * @returns {Promise<void>}
   */
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/analytics`, authHeaders);
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Handles the deletion of a book by its ID.
   * @param {string} bookId - The ID of the book to delete.
   * @returns {Promise<void>}
   */
  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`${API}/api/admin/books/${bookId}`, authHeaders);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Handles saving changes to an edited book.
   * @param {string} bookId - The ID of the book to save.
   * @returns {Promise<void>}
   */
  const handleSave = async (bookId) => {
    try {
      await axios.put(`${API}/api/admin/books/${bookId}`, editedBook, authHeaders);
      setEditingBookId(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Handles changes in the input fields when editing a book.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handleEditChange = (e) => {
    setEditedBook({ ...editedBook, [e.target.name]: e.target.value });
  };

  /**
   * @description Handles the search input change, filtering the displayed books.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  /**
   * @description Handles admin logout, clears admin session, and redirects to the admin login page.
   * @returns {void}
   */
  const handleLogout = () => {
    logoutAdmin();
    navigate("/bookbazaar-admin");
  };

  /**
   * @description Effect hook to fetch books and analytics on component mount or when token changes.
   * Redirects to admin login if no token is present.
   */
  useEffect(() => {
    if (!token) {
      navigate("/bookbazaar-admin");
      return;
    }
    fetchBooks();
    fetchAnalytics();
  }, [token]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer">
          Logout
        </button>
      </div>

      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={handleSearch}
        className="border p-2 rounded w-full mb-6 shadow-sm"
      />

      <div className="bg-gray-100 p-4 rounded shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-2">Analytics</h2>
        <p>
          Total Books: <span className="font-bold">{analytics.totalBooks || 0}</span>
        </p>
        <p>
          Total Users: <span className="font-bold">{analytics.totalUsers || 0}</span>
        </p>
      </div>

      <div className="space-y-3">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center">
            {editingBookId === book._id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={editedBook.title || ""}
                  onChange={handleEditChange}
                  className="border p-1 rounded flex-1"
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={editedBook.author || ""}
                  onChange={handleEditChange}
                  className="border p-1 rounded flex-1"
                />
                <input
                  type="text"
                  name="genere"
                  placeholder="Genre"
                  value={editedBook.genere || ""}
                  onChange={handleEditChange}
                  className="border p-1 rounded flex-1"
                />
                <button
                  onClick={() => handleSave(book._id)}
                  className="text-green-500 hover:text-green-600 cursor-pointer">
                  <FiSave size={20} />
                </button>
                <button
                  onClick={() => setEditingBookId(null)}
                  className="text-red-500 hover:text-red-600 cursor-pointer">
                  <FiX size={20} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">
                    {book.author} — {book.genere}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingBookId(book._id);
                      setEditedBook({
                        title: book.title,
                        author: book.author,
                        genere: book.genere,
                      });
                    }}
                    className="text-blue-500 hover:text-blue-600 cursor-pointer">
                    <FiEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="text-red-500 hover:text-red-600 cursor-pointer">
                    <FiTrash2 size={20} />
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
