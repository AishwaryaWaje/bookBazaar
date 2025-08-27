import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

/**
 * @description Footer component displaying company information, quick links, support links, and social media icons.
 * @returns {JSX.Element} The Footer component.
 */
const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white">BookBazaar</h2>
          <p className="mt-4 text-sm">
            Find affordable used books, exchange your old favorites, and connect with fellow book
            lovers – all in one place.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/books" className="hover:text-white transition">
                Books
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-white transition">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Support</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex space-x-4 mt-4 text-lg">
            <a
              href="https://facebook.com/bookbazaar05"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BookBazaar on Facebook"
              className="hover:text-blue-500 transition">
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/Book-Bazaar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BookBazaar on Twitter"
              className="hover:text-blue-400 transition">
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com/Book-Bazaar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BookBazaar on Instagram"
              className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com/company/Book-Bazaar05"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BookBazaar on LinkedIn"
              className="hover:text-blue-600 transition">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center text-sm py-4">
        © {new Date().getFullYear()} BookBazaar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
