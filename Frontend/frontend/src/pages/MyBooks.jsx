import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/AuthUtils";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL;
const MyBooks = () => {
  const [user] = useState(getCurrentUser());
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    genere: "",
    condition: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/api/books/mine`, {
        withCredentials: true,
      });
      setBooks(res.data || []);
    } catch (err) {
      console.error("Error fetching my books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBooks();
  }, []);

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`${API}/api/books/${bookId}`, {
        withCredentials: true,
      });

      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      console.error("Failed to delete book", err);
      alert("Delete failed.");
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      genere: book.genere,
      condition: book.condition,
      image: null,
    });
    setPreviewImage(book.image);
  };

  const closeEditModal = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      price: "",
      genere: "",
      condition: "",
      image: null,
    });
    setPreviewImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    setUpdating(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) form.append(key, formData[key]);
      });

      const res = await axios.put(`${API}/api/books/${editingBook._id}`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBooks((prev) => prev.map((b) => (b._id === editingBook._id ? res.data : b)));
      closeEditModal();
    } catch (err) {
      console.error("Failed to update book", err);
      alert("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="col-span-full text-center text-gray-500 text-sm py-8">
        Loading your books...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {books.length === 0 ? (
        <div className="text-gray-500">You haven't uploaded any books yet.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left text-gray-600">
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={book.image || "/default-book.jpg"}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{book.title}</td>
                  <td className="px-4 py-3">{book.author}</td>
                  <td className="px-4 py-3">{book.genere || "N/A"}</td>
                  <td className="px-4 py-3">{book.condition || "N/A"}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">₹{book.price}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openEditModal(book)}
                      className="p-2 text-yellow-500 hover:text-yellow-600 cursor-pointer"
                      title="Edit Book">
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="p-2 text-red-500 hover:text-red-600 cursor-pointer"
                      title="Delete Book">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingBook && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl p-6 transition-transform duration-300 transform animate-slideInRight">
          <button
            onClick={closeEditModal}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>

          <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Edit Book</h2>

          {previewImage && (
            <div className="flex justify-center mb-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-28 h-28 object-cover border rounded-lg shadow-md"
              />
            </div>
          )}

          <form onSubmit={handleUpdateBook} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Author"
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="genere"
              value={formData.genere}
              onChange={handleInputChange}
              placeholder="Genre"
              className="w-full border px-3 py-2 rounded-lg"
            />
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded-lg">
              <option value="">Select Condition</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
              <option value="Worn">Worn</option>
              <option value="Damaged">Damaged</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-2 py-1 rounded-lg"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                disabled={updating}>
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyBooks;
