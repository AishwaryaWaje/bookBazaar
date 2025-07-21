import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    genere: "",
    condition: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`, {
          withCredentials: true,
        });
        setBook(res.data);
        setFormData({
          title: res.data.title || "",
          author: res.data.author || "",
          price: res.data.price || "",
          genere: res.data.genere || "",
          condition: res.data.condition || "",
          image: null,
        });
        setPreviewImage(res.data.image || null);
      } catch (err) {
        console.error("Failed to load the book", err);
        alert("Failed to load the book.");
        navigate("/my-books");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle book update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const form = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          form.append(key, formData[key]);
        }
      }

      await axios.put(`http://localhost:5000/api/books/${id}`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Book updated successfully!");
      navigate("/my-books");
    } catch (err) {
      console.error("Failed to update book", err);
      alert("Failed to update book.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-xl font-semibold">Loading book...</div>;

  if (!book) return <div className="text-center text-red-500">Book not found.</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Book</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Genre</label>
          <input
            type="text"
            name="genere"
            value={formData.genere}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Condition</label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Book Image</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-contain border mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={updating}>
          {updating ? "Updating..." : "Update Book"}
        </button>
      </form>
    </div>
  );
};

export default EditBook;
