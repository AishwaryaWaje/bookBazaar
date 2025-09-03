import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser, getToken } from "../utils/AuthUtils";
import ChatPane from "../components/chat/ChatPane";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL;

/**
 * @description Retrieves the other participant in a conversation, excluding the current user.
 * @param {object} convo - The conversation object.
 * @param {string} currentUserId - The ID of the current authenticated user.
 * @returns {object|null} The user object of the other participant, or null if not found.
 */
const getOtherParticipant = (convo, currentUserId) => {
  if (!convo?.participants?.length) return null;
  return convo.participants.find((p) => p._id !== currentUserId) || null;
};

/**
 * @description Generates a preview text for a conversation based on its last message.
 * @param {object} convo - The conversation object.
 * @returns {string} The last message text or a default "No messages yet" string.
 */
const getPreviewText = (convo) =>
  convo?.lastMessage?.trim() ? convo.lastMessage : "No messages yet — start the conversation!";

/**
 * @description Messages component for displaying and managing user conversations.
 * Allows users to view conversation lists, open chat panes, and delete conversations.
 * @returns {JSX.Element} The Messages page component.
 */
const Messages = () => {
  /** @type {Array<object>} */
  const [conversations, setConversations] = useState([]);
  /** @type {object|null} */
  const [activeChat, setActiveChat] = useState(null);
  /** @type {boolean} */
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser();
  const navigate = useNavigate();

  /**
   * @description Handles the deletion of a specific conversation.
   * Prompts for user confirmation before deletion.
   * @param {string} id - The ID of the conversation to delete.
   * @returns {Promise<void>}
   */
  const handleDeleteConversation = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this conversation?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/api/conversations/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setConversations(conversations.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting conversation", err);
    }
  };

  /**
   * @description Effect hook to redirect unauthenticated users to the login page.
   */
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  /**
   * @description Effect hook to fetch conversations for the authenticated user.
   * Filters out conversations without a last message.
   * @returns {Promise<void>}
   */
  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${API}/api/conversations`, {
          withCredentials: true,
        });
        const filtered = (res.data || []).filter(
          (convo) => convo.lastMessage && convo.lastMessage.trim() !== ""
        );
        setConversations(filtered);
      } catch (err) {
        console.error("Error fetching conversations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user]);

  /**
   * @description Opens the chat pane for a selected conversation.
   * @param {object} convo - The conversation object to open.
   * @returns {void}
   */
  const openChat = (convo) => {
    const other = getOtherParticipant(convo, user._id);
    setActiveChat({ convo, otherUser: other });
  };

  /**
   * @description Closes the currently active chat pane.
   * @returns {void}
   */
  const closeChat = () => setActiveChat(null);

  /**
   * @description Navigates to the book details page for a given book ID.
   * @param {string} bookId - The ID of the book to view.
   * @returns {void}
   */
  const handleViewBook = (bookId) => {
    if (!bookId) return;
    navigate(`/books/${bookId}`);
  };

  if (loading) {
    return (
      <div className="col-span-full text-center text-gray-500 text-sm py-8">
        Loading conversations...
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Messaging</h2>

      <div className="bg-white rounded-lg shadow divide-y">
        {conversations.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">You have no messages yet.</p>
        ) : (
          conversations.map((convo) => {
            const other = getOtherParticipant(convo, user._id);
            const book = convo.book;
            const lastMessageSenderId = convo.lastSender._id;
            const isSentByCurrentUser = lastMessageSenderId === user._id;

            console.log("user._id:", user._id);
            console.log("convo.lastSender._id:", convo.lastSender._id);
            console.log("isSentByCurrentUser:", isSentByCurrentUser);

            return (
              <div
                key={convo._id}
                className="p-4 hover:bg-gray-50 flex items-center justify-between gap-2">
                <div className="flex-1 cursor-pointer" onClick={() => openChat(convo)}>
                  <div className="text-sm text-gray-800">
                    {isSentByCurrentUser ? "You sent a message to" : "You received a message from"}{" "}
                    <span className="font-semibold">{other?.username || "User"}</span> about{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewBook(book?._id);
                      }}
                      className="font-semibold text-blue-600 hover:underline">
                      {book?.title || "this book"}
                    </button>
                    .
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[300px]">
                    {getPreviewText(convo)}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteConversation(convo._id)}
                  className="text-red-500 hover:text-red-600">
                  <FiTrash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {activeChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b flex items-start justify-between">
              <div className="text-sm">
                <p className="font-semibold text-gray-800">
                  Chat with {activeChat.otherUser?.username || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  About: {activeChat.convo?.book?.title || "Book"}
                </p>
              </div>
              <button
                onClick={closeChat}
                className="px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300">
                Close
              </button>
            </div>

            <div className="p-4">
              <ChatPane conversationId={activeChat.convo._id} currentUser={user} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
