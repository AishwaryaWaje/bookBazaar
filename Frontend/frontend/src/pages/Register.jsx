import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
const Register = () => {
  const [inputs, setInputs] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/register`, inputs, {
        withCredentials: true,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register for BookBazaar
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={inputs.username}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
