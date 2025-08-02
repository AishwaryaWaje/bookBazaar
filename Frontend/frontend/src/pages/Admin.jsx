import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiEdit, FiSave, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/AuthUtils";

const API = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalBooks: 0 });
  const [editingBookId, setEditingBookId] = useState(null);
  const [editedBook, setEditedBook] = useState({ title: "", author: "", genere: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 100;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [searchQuery, books]);

  const fetchBooks = async () => {
    const res = await axios.get(`${API}/api/admin/books`, { withCredentials: true });
    setBooks(res.data);
    setFilteredBooks(res.data);
  };

  const fetchAnalytics = async () => {
    const res = await axios.get(`${API}/api/admin/analytics`, { withCredentials: true });
    setAnalytics(res.data);
  };

  const handleDelete = async (bookId) => {
    await axios.delete(`${API}/api/admin/books/${bookId}`, { withCredentials: true });
    fetchBooks();
  };

  const handleEdit = (book) => {
    setEditingBookId(book._id);
    setEditedBook({
      title: book.title,
      author: book.author,
      genere: book.genere || "",
    });
  };

  const handleSave = async (bookId) => {
    await axios.put(`${API}/api/admin/books/${bookId}`, editedBook, { withCredentials: true });
    setEditingBookId(null);
    fetchBooks();
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/admin-login");
  };

  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Books</p>
          <p className="text-3xl font-bold text-green-600">{analytics.totalBooks}</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search books by title..."
          className="w-full p-2 border rounded shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Book Listings</h2>
      <div className="space-y-4">
        {currentBooks.map((book) => (
          <div
            key={book._id}
            className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 space-y-1">
              {editingBookId === book._id ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={editedBook.title}
                    onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                  <input
                    type="text"
                    value={editedBook.author}
                    onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                  <input
                    type="text"
                    value={editedBook.genere}
                    onChange={(e) => setEditedBook({ ...editedBook, genere: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                </div>
              ) : (
                <p>
                  <strong>{book.title}</strong> by {book.author}{" "}
                  {book.genere && (
                    <>
                      | <span className="text-gray-600">{book.genere}</span>
                    </>
                  )}{" "}
                  |
                  <span className="text-sm text-blue-600 ml-2">
                    Listed by: {book.listedBy?.username}
                  </span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              {editingBookId === book._id ? (
                <>
                  <button
                    onClick={() => handleSave(book._id)}
                    className="text-green-600 hover:text-green-800">
                    <FiSave size={18} />
                  </button>
                  <button
                    onClick={() => setEditingBookId(null)}
                    className="text-gray-600 hover:text-gray-800">
                    <FiX size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEdit(book)}
                  className="text-blue-600 hover:text-blue-800">
                  <FiEdit size={18} />
                </button>
              )}
              <button
                onClick={() => handleDelete(book._id)}
                className="text-red-600 hover:text-red-800">
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded"
            disabled={currentPage === 1}>
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded"
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;
