import axios from "axios";
import BookPreviewPane from "./BookPreviewPane";
import ChatPane from "./ChatPane";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/AuthUtils";

const API = import.meta.env.VITE_API_URL;

/**
 * @description ChatModal component displays a chat interface alongside a book preview.
 * Allows users to initiate a chat about a book and place an order.
 * @param {object} props - React props.
 * @param {object} props.book - The book object to display in the preview pane.
 * @param {string} props.conversationId - The ID of the active conversation.
 * @param {object|null} props.currentUser - The currently authenticated user object.
 * @param {function(): void} props.onClose - Callback function to close the modal.
 * @returns {JSX.Element} The ChatModal component.
 */
const ChatModal = ({ book, conversationId, currentUser, onClose }) => {
  const navigate = useNavigate();

  /**
   * @description Handles the "Buy Now" action for a book.
   * Places an order and redirects the user to the "My Orders" page on success.
   * @param {string} bookId - The ID of the book to purchase.
   * @returns {Promise<void>}
   */
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
