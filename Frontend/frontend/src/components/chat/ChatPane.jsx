import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import socket from "../../utils/Socket";

const ChatPane = ({ conversationId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const myId = currentUser?._id;

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/conversations/${conversationId}/messages`,
          { withCredentials: true }
        );
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    if (conversationId) loadMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", conversationId);

    const handleReceive = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      const text = input.trim();
      if (!text) return;
      setInput("");

      try {
        const res = await axios.post(
          `http://localhost:5000/api/conversations/${conversationId}/messages`,
          { text },
          { withCredentials: true }
        );
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === res.data._id);
          return exists ? prev : [...prev, res.data];
        });

        socket.emit("send_message", { ...res.data, conversationId });
      } catch (err) {
        console.error("Send failed", err);
      }
    },
    [conversationId, input]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 rounded space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No messages yet</p>
        ) : (
          messages.map((m) => {
            const senderId = m.sender?._id || m.sender;
            const isMe = senderId === myId;
            return (
              <div
                key={m._id || `${senderId}-${m.createdAt}`}
                className={`max-w-[75%] px-3 py-2 rounded-md text-sm ${
                  isMe ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-gray-200 text-gray-900"
                }`}>
                {m.text}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPane;
