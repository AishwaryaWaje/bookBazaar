import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logoutUser, getAdminUser } from "../utils/AuthUtils";
import socket from "../utils/Socket";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const DEBOUNCE_MS = 300;

/**
 * @description Navbar component providing navigation, search functionality, and user authentication status.
 * @returns {JSX.Element} The Navbar component.
 */
const Navbar = () => {
  /** @type {string} */
  const [searchTerm, setSearchTerm] = useState("");
  /** @type {boolean} */
  const [isSearchActive, setIsSearchActive] = useState(false);
  /** @type {object|null} */
  const [user, setUser] = useState(getCurrentUser());
  const admin = getAdminUser();
  /** @type {boolean} */
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  /**
   * @description Effect hook to handle clicks outside the dropdown to close it.
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * @description Effect hook to synchronize search term with URL query parameter when navigating.
   */
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

  /**
   * @description Effect hook for debounced search functionality. Navigates to search results after a delay.
   */
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

  /**
   * @description Handles user logout, clears authentication data, and redirects to the login page.
   * @returns {Promise<void>}
   */
  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
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

  /**
   * @description Navigates to a specified path and closes dropdown/search.
   * @param {string} path - The path to navigate to.
   * @returns {void}
   */
  const go = (path) => {
    setDropdownOpen(false);
    setIsSearchActive(false);
    navigate(path);
  };

  /**
   * @description Handles clicks on protected navigation links. Redirects to login if not authenticated.
   * @param {string} path - The path to navigate to.
   * @returns {void}
   */
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

  /**
   * @description Handles changes in the search input field.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!isSearchActive && value.trim().length > 0) {
      setIsSearchActive(true);
    }
  };

  if (admin) return null;

  return (
    <nav className="sticky top-0 z-50 bg-black text-white px-4 py-3 flex items-center justify-between w-full">
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
          className="px-3 py-1 text-white rounded-md w-64 border border-white bg-transparent"
        />
      </div>

      <div className="flex items-center gap-6 text-sm relative">
        {user && (
          <button
            onClick={() => handleProtectedClick("/messages")}
            className="hover:underline cursor-pointer px-2"
            type="button">
            <i className="fa-solid fa-envelope"></i>
          </button>
        )}

        <button
          onClick={() => handleProtectedClick("/wishlist")}
          className="hover:underline cursor-pointer px-2"
          type="button">
          <i className="fa-solid fa-heart"></i>
        </button>

        {!user ? (
          <Link
            to="/login"
            className="hover:underline "
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
              className="hover:underline flex items-center gap-1 cursor-pointer"
              type="button">
              {user.username}
              <span className="text-xs">{dropdownOpen ? "▲" : "▼"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-10 w-40 py-1 text-sm">
                <button
                  onClick={() => go("/add-book")}
                  className="block w-full px-4 py-3 text-left hover:bg-gray-100 cursor-pointer"
                  type="button">
                  Add Book
                </button>
                <button
                  onClick={() => go("/my-books")}
                  className="block w-full px-4 py-3 text-left hover:bg-gray-100 cursor-pointer"
                  type="button">
                  My Books
                </button>
                <button
                  onClick={() => go("/my-orders")}
                  className="block w-full px-4 py-3 text-left hover:bg-gray-100 cursor-pointer"
                  type="button">
                  My Orders
                </button>
                <button
                  onClick={() => go("/wishlist")}
                  className="block w-full px-4 py-3 text-left hover:bg-gray-100 cursor-pointer"
                  type="button">
                  My Wishlist
                </button>
                <button
                  onClick={() => go("/messages")}
                  className="block w-full px-4 py-3 text-left hover:bg-gray-100 cursor-pointer"
                  type="button">
                  Messages
                </button>
                <div className="border-t my-1" />
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-left hover:bg-gray-100 text-red-600 cursor-pointer"
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
