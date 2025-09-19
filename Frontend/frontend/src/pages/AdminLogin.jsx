import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

/**
 * @description AdminLogin component for authenticating administrators.
 * @returns {JSX.Element} The AdminLogin page component.
 */
const AdminLogin = () => {
  /** @type {string} */
  const [email, setEmail] = useState("");
  /** @type {string} */
  const [password, setPassword] = useState("");
  /** @type {string} */
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * @description Handles the admin login form submission.
   * Authenticates admin credentials and redirects to the admin dashboard on success.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   * @returns {Promise<void>}
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API}/api/admin/login`, { email, password });
      const { user, token } = res.data;

      if (user.isAdmin) {
        localStorage.setItem("admin", JSON.stringify(user));
        localStorage.setItem("token", token);
        navigate("/admin");
      } else {
        setError("Access denied. Not an admin.");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded shadow">
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded cursor-pointer text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {loading ? "Logging..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
