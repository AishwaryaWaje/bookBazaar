import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
/**
 * @typedef {object} RegisterInputs
 * @property {string} username - The user's chosen username.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 */
/**
 * @description Register component for new user account creation.
 * Allows users to register with a username, email, and password.
 * @returns {JSX.Element} The Register page component.
 */
const Register = () => {
  /** @type {RegisterInputs} */
  const [inputs, setInputs] = useState({ username: "", email: "", password: "" });
  /** @type {string} */
  const [error, setError] = useState("");
  /** @type {boolean} */
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * @description Handles changes in the input fields for the registration form.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  /**
   * @description Handles the registration form submission.
   * Attempts to register the user and redirects to the home page on success.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   * @returns {Promise<void>}
   */
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
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
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
