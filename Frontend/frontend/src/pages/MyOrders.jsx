import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    fetchOrders();
  }, []);

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
