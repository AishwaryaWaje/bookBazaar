import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/AuthUtils";
import socket from "../utils/Socket";
import axios from "axios";

const DEBOUNCE_MS = 300;

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
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
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (location.pathname === "/search") {
      setSearchTerm(q);
      setIsSearchActive(q.trim().length > 0);
    } else {
      setIsSearchActive(false);
    }
  }, [location]);

  useEffect(() => {
    if (!isSearchActive) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const trimmed = searchTerm;

      if (location.pathname === "/login") return;

      if (trimmed) {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`, { replace: true });
      } else {
        if (location.pathname === "/search") {
          navigate("/", { replace: true });
        }
        setIsSearchActive(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, isSearchActive, location, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    }

    socket.disconnect();
    logoutUser();
    setUser(null);
    setDropdownOpen(false);
    setIsSearchActive(false);
    setSearchTerm("");
    navigate("/login");
  };

  const go = (path) => {
    setDropdownOpen(false);
    setIsSearchActive(false);
    navigate(path);
  };

  const handleProtectedClick = (path) => {
    if (!user) {
      alert("Please login to view this page.");
      setIsSearchActive(false);
      navigate("/login");
      return;
    }
    setIsSearchActive(false);
    navigate(path);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!isSearchActive && value.trim().length > 0) {
      setIsSearchActive(true);
    }
  };

  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-xl font-bold"
          onClick={() => {
            setIsSearchActive(false);
            setDropdownOpen(false);
          }}>
          BookBazaar
        </Link>

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search books by Title/Author..."
          className="px-3 py-1 text-white placeholder-white rounded-md w-64 border border-white bg-transparent"
        />
      </div>

      <div className="flex items-center gap-6 text-sm relative">
        {user && (
          <button
            onClick={() => handleProtectedClick("/messages")}
            className="hover:underline"
            type="button">
            <i className="fa-solid fa-envelope"></i>
          </button>
        )}

        <button
          onClick={() => handleProtectedClick("/wishlist")}
          className="hover:underline"
          type="button">
          <i className="fa-solid fa-heart"></i>
        </button>

        {!user ? (
          <Link
            to="/login"
            className="hover:underline"
            onClick={() => {
              setIsSearchActive(false);
              setDropdownOpen(false);
            }}>
            <i className="fa-solid fa-user"></i> Login
          </Link>
        ) : (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="hover:underline flex items-center gap-1"
              type="button">
              {user.username}
              <span className="text-xs">{dropdownOpen ? "▲" : "▼"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-10 w-40 py-1 text-sm">
                <button
                  onClick={() => go("/add-book")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  type="button">
                  Add Book
                </button>
                <button
                  onClick={() => go("/my-books")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  type="button">
                  My Books
                </button>
                <button
                  onClick={() => go("/wishlist")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  type="button">
                  My Wishlist
                </button>
                <button
                  onClick={() => go("/messages")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  type="button">
                  Messages
                </button>
                <div className="border-t my-1" />
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                  type="button">
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
