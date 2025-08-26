import axios from "axios";
import BookPreviewPane from "./BookPreviewPane";
import ChatPane from "./ChatPane";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/AuthUtils";

const API = import.meta.env.VITE_API_URL;

const ChatModal = ({ book, conversationId, currentUser, onClose }) => {
  const navigate = useNavigate();

  const handleBuy = async (bookId) => {
    try {
      await axios.post(
        `${API}/api/orders`,
        { bookId },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      alert("Order placed successfully");
      navigate("/my-orders");
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl h-[70vh] bg-white rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800">
          ✕
        </button>

        <BookPreviewPane
          book={book}
          onBuy={handleBuy}
          currentUser={currentUser}
          isOrdered={book.isOrdered}
        />

        <div className="h-full">
          <ChatPane conversationId={conversationId} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
