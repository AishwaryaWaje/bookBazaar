import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

import socket from "../../utils/Socket";

const idToStr = (val) => (val?._id ? String(val._id) : val ? String(val) : "");

const ChatPane = ({ conversationId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const myId = idToStr(currentUser?._id || currentUser?.userId || currentUser?.id);

  useEffect(() => {
    if (!conversationId) return;
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
    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", conversationId);

    const handleSocketMessage = (msg) => {
      if (!msg) return;
      const convoId = msg.conversationId || msg.conversation || msg._doc?.conversationId;
      if (String(convoId) !== String(conversationId)) return;

      setMessages((prev) => {
        const msgId = idToStr(msg._id);
        if (msgId && prev.some((m) => idToStr(m._id) === msgId)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("messageCreated", handleSocketMessage);
    socket.on("receive_message", handleSocketMessage);

    return () => {
      socket.off("messageCreated", handleSocketMessage);
      socket.off("receive_message", handleSocketMessage);
    };
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

        const saved = res.data;

        setMessages((prev) => {
          const msgId = idToStr(saved._id);
          if (msgId && prev.some((m) => idToStr(m._id) === msgId)) return prev;
          return [...prev, saved];
        });
      } catch (err) {
        console.error("Send failed", err);
      }
    },
    [conversationId, input]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 rounded space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No messages yet</p>
        ) : (
          messages.map((m, index) => {
            const senderObj = m.sender && typeof m.sender === "object" ? m.sender : null;
            const senderId = idToStr(senderObj || m.sender);
            const senderName = senderObj?.username || (senderId === myId ? "You" : "User");
            const isMe = senderId === myId;

            const prev = messages[index - 1];
            const prevSenderId = prev ? idToStr(prev.sender?._id || prev.sender) : null;
            const showUsername = !prev || prevSenderId !== senderId;

            return (
              <div
                key={m._id || `${senderId}-${m.createdAt}-${index}`}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {showUsername && <span className="text-xs text-gray-500 mb-1">{senderName}</span>}
                <div
                  className={`px-3 py-2 rounded-lg max-w-[75%] text-sm shadow ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}>
                  {m.text}
                </div>
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
