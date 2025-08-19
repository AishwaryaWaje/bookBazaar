import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/AuthUtils";

const API = import.meta.env.VITE_API_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get(`${API}/api/orders`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="border rounded p-3 mb-3 flex justify-between items-center">
          <div>
            <p className="font-semibold">{order.book.title}</p>
            <p className="text-sm text-gray-600">
              ₹{order.price} + ₹{order.deliveryFee} delivery
            </p>
            <p className="text-xs text-gray-500">Status: {order.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
