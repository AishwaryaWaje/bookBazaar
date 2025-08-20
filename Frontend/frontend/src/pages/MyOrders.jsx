import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/orders`, { withCredentials: true });
        setOrders(res.data);
      } catch (e) {
        console.error("Failed to fetch orders:", e);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (location.state?.newOrder) {
      setOrders((prev) => [location.state.newOrder, ...prev]);
    }
  }, [location.state]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-10 text-lg"> Make your first order</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 border rounded-md">
              <h2 className="font-semibold">{order.book?.title}</h2>
              <p>Seller: {order.seller?.username}</p>
              <p>Total: ₹{order.total}</p>
              <p className="text-xs text-gray-500">Status: {order.deliveryStatus}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
