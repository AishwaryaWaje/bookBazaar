import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/AuthUtils";

const API = import.meta.env.VITE_API_URL;
const AddBook = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genere: "",
    condition: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  if (!user) {
    return (
      <div className="text-center mt-10 text-lg text-red-600">Please login to add a book.</div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, author, genere, condition, price } = formData;

    if (!title || !author || !genere || !condition || !price) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (image) data.append("image", image);

      await axios.post(`${API}/api/books`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Book added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => navigate("/");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close and return to home"
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl leading-none cursor-pointer">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Add a New Book</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Enter book title"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Enter author name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Genre</label>
            <input
              type="text"
              name="genere"
              value={formData.genere}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Fiction, Sci-Fi, etc."
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              required>
              <option value="">Select condition</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
              <option value="Worn">Worn</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Upload Image</label>
            <input type="file" onChange={handleFileChange} accept="image/*" className="w-full" />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded-md border border-gray-300 shadow-sm"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-semibold cursor-pointer">
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
