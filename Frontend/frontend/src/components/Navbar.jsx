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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setDropdownOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
      // still proceed locally
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

  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center justify-between">
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold">
          BookBazaar
        </Link>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search books by Title/Author..."
          className="px-3 py-1 text-white placeholder-white rounded-md w-64 border border-white bg-transparent"
        />
      </div>

      {/* Right: Icons + User */}
      <div className="flex items-center gap-6 text-sm relative">
        <Link to="/notification" className="hover:underline">
          <i className="fa-solid fa-bell"></i>
        </Link>
        <Link to="/wishlist" className="hover:underline">
          <i className="fa-solid fa-heart"></i>
        </Link>
        <Link to="/cart" className="hover:underline">
          <i className="fa-solid fa-cart-shopping"></i>
        </Link>

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
