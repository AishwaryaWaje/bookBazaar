import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/AuthUtils";
import axios from "axios";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (window.location.pathname === "/login") return;

      if (searchTerm.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate("/");
      }
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
    logoutUser();
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const go = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const handleProtectedClick = (path) => {
    if (!user) {
      alert("Please login to view this page.");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold">
          BookBazaar
        </Link>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search books by Title/Author..."
          className="px-3 py-1 text-white placeholder-white rounded-md w-64 border border-white bg-transparent"
        />
      </div>

      <div className="flex items-center gap-6 text-sm relative">
        <button onClick={() => handleProtectedClick("/notification")} className="hover:underline">
          <i className="fa-solid fa-bell"></i>
        </button>

        <button onClick={() => handleProtectedClick("/wishlist")} className="hover:underline">
          <i className="fa-solid fa-heart"></i>
        </button>

        {!user ? (
          <Link to="/login" className="hover:underline">
            <i className="fa-solid fa-user"></i> Login
          </Link>
        ) : (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="hover:underline flex items-center gap-1">
              {user.username}
              <span className="text-xs">{dropdownOpen ? "▲" : "▼"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-10 w-40 py-1 text-sm">
                <button
                  onClick={() => go("/add-book")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  Add Book
                </button>
                <button
                  onClick={() => go("/my-books")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  My Books
                </button>
                <button
                  onClick={() => go("/my-orders")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  My Orders
                </button>
                <div className="border-t my-1" />
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
