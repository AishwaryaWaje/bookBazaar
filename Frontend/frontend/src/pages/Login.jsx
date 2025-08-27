import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import socket from "../utils/Socket";

const API = import.meta.env.VITE_API_URL;
/**
 * @typedef {object} LoginInputs
 * @property {string} email - The user's email.
 * @property {string} password - The user's password.
 */
/**
 * @description Login component for user authentication.
 * @returns {JSX.Element} The Login page component.
 */
const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * @description Handles changes in the input fields.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  /**
   * @description Handles the login form submission.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   * @returns {Promise<void>}
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, inputs, {
        withCredentials: true,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      socket.connect();
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to BookBazaar</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 cursor-pointer">
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-500 hover:underline text-sm">
            Forgot Password?
          </Link>
        </p>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
