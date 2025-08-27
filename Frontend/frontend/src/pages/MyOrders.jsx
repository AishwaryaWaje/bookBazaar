import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

/**
 * @description MyOrders component displays a list of orders placed by the authenticated user.
 * Handles loading states, error display, and re-fetching orders upon new order creation.
 * @returns {JSX.Element} The MyOrders page component.
 */
const MyOrders = () => {
  /** @type {Array<object>} */
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  /** @type {boolean} */
  const [loading, setLoading] = useState(true);
  /** @type {string|null} */
  const [error, setError] = useState(null);
  /**
   * @description Fetches orders from the API for the authenticated user.
   * Sets loading and error states appropriately.
   * @returns {Promise<void>}
   */
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/orders`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Effect hook to fetch orders on component mount.
   */
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * @description Effect hook to re-fetch orders if a new order has been placed (indicated by location state).
   */
  useEffect(() => {
    if (location.state?.newOrder) {
      fetchOrders();
    }
  }, [location.state]);

  return (
    <div className="p-6">
      {loading ? (
        <p className="col-span-full text-center text-gray-500 text-sm py-8">Loading orders...</p>
      ) : error ? (
        <p className="col-span-full text-center text-red-500 text-sm py-8">{error}</p>
      ) : orders.length === 0 ? (
        <p className="col-span-full text-center text-gray-500 text-sm py-8">
          Make your first order
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 border rounded-md shadow-sm">
              <h2 className="font-semibold text-lg">{order.book?.title || "Book unavailable"}</h2>
              <p className="text-sm text-gray-700">Seller: {order.seller?.username || "Unknown"}</p>
              <p className="text-sm text-gray-700">Total: ₹{order.total}</p>
              <p className="text-xs text-gray-500">Status: {order.deliveryStatus}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
