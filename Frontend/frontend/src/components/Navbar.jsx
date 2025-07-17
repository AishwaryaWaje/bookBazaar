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
      navigate(`/search?q=${searchTerm}`);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      logoutUser();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
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
          onKeyDown={handleSearch}
          placeholder="Search books by Title/Author..."
          className="px-3 py-1 text-white placeholder-white rounded-md w-64 border border-white bg-transparent"
        />
      </div>

      <div className="flex items-center gap-6 text-sm relative">
        <Link to="/wishlist" className="hover:underline">
          Wishlist
        </Link>
        <Link to="/cart" className="hover:underline">
          Cart
        </Link>

        {!user ? (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        ) : (
          <div ref={dropdownRef} className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="hover:underline">
              {user.username}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100">
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
