import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiEdit, FiSave, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logoutAdmin, getToken } from "../utils/AuthUtils";

const API = import.meta.env.VITE_API_URL;

/**
 * @description Admin dashboard component for managing books, orders and viewing analytics.
 * Requires administrator privileges.
 * @returns {JSX.Element} The Admin dashboard component.
 */
const Admin = () => {
  /** @type {Array<object>} */
  const [books, setBooks] = useState([]);
  /** @type {Array<object>} */
  const [filteredBooks, setFilteredBooks] = useState([]);
  /** @type {Array<object>} */
  const [orders, setOrders] = useState([]);
  /** @type {Array<object>} */
  const [filteredOrders, setFilteredOrders] = useState([]);
  /** @type {object} */
  const [analytics, setAnalytics] = useState({});
  /** @type {string|null} */
  const [editingBookId, setEditingBookId] = useState(null);
  /** @type {object} */
  const [editedBook, setEditedBook] = useState({});
  /** @type {string|null} */
  const [editingOrderId, setEditingOrderId] = useState(null);
  /** @type {string} */
  const [editedOrderStatus, setEditedOrderStatus] = useState("");
  /** @type {string} */
  const [bookSearch, setBookSearch] = useState("");
  /** @type {string} */
  const [orderSearch, setOrderSearch] = useState("");
  const navigate = useNavigate();
  const token = getToken();

  /**
   * @description Authorization headers for API requests.
   * @type {object}
   * @property {object} headers - The headers object.
   * @property {string} headers.Authorization - The Bearer token for authorization.
   */
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  /**
   * @description Fetches all books from the admin API and updates the state.
   * @returns {Promise<void>}
   */
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/books`, authHeaders);
      setBooks(res.data);
      setFilteredBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Fetches all orders from the admin API and updates the state.
   * @returns {Promise<void>}
   */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/orders`, authHeaders);
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Fetches analytics data (total users, total books) from the admin API and updates the state.
   * @returns {Promise<void>}
   */
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/analytics`, authHeaders);
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Handles the deletion of a book by its ID.
   * @param {string} bookId - The ID of the book to delete.
   * @returns {Promise<void>}
   */
  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${API}/api/admin/books/${bookId}`, authHeaders);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Handles saving changes to an edited book.
   * @param {string} bookId - The ID of the book to save.
   * @returns {Promise<void>}
   */
  const handleSaveBook = async (bookId) => {
    try {
      await axios.put(`${API}/api/admin/books/${bookId}`, editedBook, authHeaders);
      setEditingBookId(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Handles saving changes to an edited order status.
   * @param {string} orderId - The ID of the order to save.
   * @returns {Promise<void>}
   */
  const handleSaveOrderStatus = async (orderId) => {
    try {
      await axios.put(
        `${API}/api/admin/orders/${orderId}/status`,
        { status: editedOrderStatus },
        authHeaders
      );
      setEditingOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @description Handles changes in the input fields when editing a book.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handleBookEditChange = (e) => {
    setEditedBook({ ...editedBook, [e.target.name]: e.target.value });
  };

  /**
   * @description Handles the search input change for books, filtering the displayed books.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handleBookSearch = (e) => {
    setBookSearch(e.target.value);
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  /**
   * @description Handles the search input change for orders, filtering the displayed orders.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handleOrderSearch = (e) => {
    setOrderSearch(e.target.value);
    const filtered = orders.filter(
      (order) =>
        order.book.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        order.buyer.username.toLowerCase().includes(e.target.value.toLowerCase()) ||
        order.seller.username.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  /**
   * @description Handles admin logout, clears admin session, and redirects to the admin login page.
   * @returns {void}
   */
  const handleLogout = () => {
    logoutAdmin();
    navigate("/bookbazaar-admin");
  };

  /**
   * @description Effect hook to fetch books, orders and analytics on component mount or when token changes.
   * Redirects to admin login if no token is present.
   */
  useEffect(() => {
    if (!token) {
      navigate("/bookbazaar-admin");
      return;
    }
    fetchBooks();
    fetchOrders();
    fetchAnalytics();
  }, [token]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer">
          Logout
        </button>
      </div>

      {/* Analytics Section */}
      <div className="bg-gray-100 p-4 rounded shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-2">Analytics</h2>
        <p>
          Total Books: <span className="font-bold">{analytics.totalBooks || 0}</span>
        </p>
        <p>
          Total Users: <span className="font-bold">{analytics.totalUsers || 0}</span>
        </p>
        <p>
          Total Orders: <span className="font-bold">{orders.length || 0}</span>
        </p>
      </div>

      {/* Books Management Section */}
      <h2 className="text-xl font-semibold mb-4">Books Management</h2>
      <input
        type="text"
        placeholder="Search books by title..."
        value={bookSearch}
        onChange={handleBookSearch}
        className="border p-2 rounded w-full mb-6 shadow-sm"
      />

      <div className="space-y-3 mb-8">
        {filteredBooks.length === 0 ? (
          <p className="text-center text-gray-500">No books found.</p>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center">
              {editingBookId === book._id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={editedBook.title || ""}
                    onChange={handleBookEditChange}
                    className="border p-1 rounded flex-1"
                  />
                  <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={editedBook.author || ""}
                    onChange={handleBookEditChange}
                    className="border p-1 rounded flex-1"
                  />
                  <input
                    type="text"
                    name="genere"
                    placeholder="Genre"
                    value={editedBook.genere || ""}
                    onChange={handleBookEditChange}
                    className="border p-1 rounded flex-1"
                  />
                  <button
                    onClick={() => handleSaveBook(book._id)}
                    className="text-green-500 hover:text-green-600 cursor-pointer p-1 rounded">
                    <FiSave size={20} />
                  </button>
                  <button
                    onClick={() => setEditingBookId(null)}
                    className="text-red-500 hover:text-red-600 cursor-pointer p-1 rounded">
                    <FiX size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-600">
                      {book.author} — {book.genere}
                    </p>
                    <p className="text-sm text-gray-600">
                      Listed by: {book.listedBy?.username} ({book.listedBy?.email})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingBookId(book._id);
                        setEditedBook({
                          title: book.title,
                          author: book.author,
                          genere: book.genere,
                        });
                      }}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer p-1 rounded">
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="text-red-500 hover:text-red-600 cursor-pointer p-1 rounded">
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Orders Management Section */}
      <h2 className="text-xl font-semibold mb-4">Orders Management</h2>
      <input
        type="text"
        placeholder="Search orders by book title, buyer or seller username..."
        value={orderSearch}
        onChange={handleOrderSearch}
        className="border p-2 rounded w-full mb-6 shadow-sm"
      />

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex-1 mb-2 md:mb-0">
                <p className="font-medium">
                  Book: {order.book?.title} by {order.book?.author}
                </p>
                <p className="text-sm text-gray-600">
                  Buyer: {order.buyer?.username} ({order.buyer?.email})
                </p>
                <p className="text-sm text-gray-600">
                  Seller: {order.seller?.username} ({order.seller?.email})
                </p>
                <p className="text-sm text-gray-600">Price: ${order.price}</p>
                <p className="text-sm text-gray-600">Delivery Fee: ${order.deliveryFee}</p>
                <p className="font-bold">Total: ${order.total}</p>
              </div>
              <div className="flex items-center gap-2">
                {editingOrderId === order._id ? (
                  <div className="flex items-center gap-2">
                    <select
                      name="deliveryStatus"
                      value={editedOrderStatus}
                      onChange={(e) => setEditedOrderStatus(e.target.value)}
                      className="border p-1 rounded">
                      <option value="ORDER_PLACED">Order Placed</option>
                      <option value="ITEM_COLLECTED">Item Collected</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>
                    <button
                      onClick={() => handleSaveOrderStatus(order._id)}
                      className="text-green-500 hover:text-green-600 cursor-pointer p-1 rounded">
                      <FiSave size={20} />
                    </button>
                    <button
                      onClick={() => setEditingOrderId(null)}
                      className="text-red-500 hover:text-red-600 cursor-pointer p-1 rounded">
                      <FiX size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700">Status: {order.deliveryStatus}</p>
                    <button
                      onClick={() => {
                        setEditingOrderId(order._id);
                        setEditedOrderStatus(order.deliveryStatus);
                      }}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer p-1 rounded">
                      <FiEdit size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
