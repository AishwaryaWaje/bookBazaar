import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/AuthUtils";
import ChatPane from "../components/chat/ChatPane";
import { useNavigate } from "react-router-dom";

const getOtherParticipant = (convo, currentUserId) => {
  if (!convo?.participants?.length) return null;
  return convo.participants.find((p) => p._id !== currentUserId) || null;
};

const getPreviewText = (convo) =>
  convo?.lastMessage?.trim() ? convo.lastMessage : "No messages yet — start the conversation!";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/conversations", {
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

  const openChat = (convo) => {
    const other = getOtherParticipant(convo, user._id);
    setActiveChat({ convo, otherUser: other });
  };

  const closeChat = () => setActiveChat(null);

  const handleViewBook = (bookId) => {
    if (!bookId) return;
    navigate(`/books/${bookId}`);
  };

  if (loading) {
    return <div className="text-center py-10 text-xl font-semibold">Loading conversations...</div>;
  }

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Messages & Notifications</h2>

      <div className="bg-white rounded-lg shadow divide-y">
        {conversations.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">You have no messages yet.</p>
        ) : (
          conversations.map((convo) => {
            const other = getOtherParticipant(convo, user._id);
            const book = convo.book;
            return (
              <div
                key={convo._id}
                className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 cursor-pointer"
                onClick={() => openChat(convo)}>
                <div className="text-sm text-gray-800">
                  You have messages from{" "}
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
