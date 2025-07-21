import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const ensureParticipant = async (conversationId, userId) => {
  const convo = await Conversation.findById(conversationId).select("participants");
  if (!convo) return { status: 404, message: "Conversation not found" };
  const isParticipant = convo.participants.some((p) => p.toString() === userId.toString());
  if (!isParticipant) return { status: 403, message: "Not authorized for this conversation" };
  return { convo };
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "User not authenticated" });

  try {
    const check = await ensureParticipant(conversationId, userId);
    if (check.message) return res.status(check.status).json({ message: check.message });

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "username");

    res.status(200).json(messages);
  } catch (e) {
    console.error("getMessages error:", e);
    res.status(500).json({ message: "Failed to fetch messages", error: e.message });
  }
};

export const sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "User not authenticated" });

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Message text is required" });
  }

  try {
    const check = await ensureParticipant(conversationId, userId);
    if (check.message) return res.status(check.status).json({ message: check.message });

    const message = await Message.create({
      conversationId,
      sender: userId,
      text: text.trim(),
    });

    check.convo.lastMessage = text.trim();
    check.convo.lastSender = userId;
    await check.convo.save();

    const populated = await message.populate("sender", "username");

    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("messageCreated", populated);
    }

    res.status(201).json(populated);
  } catch (e) {
    console.error("sendMessage error:", e);
    res.status(500).json({ message: "Failed to send message", error: e.message });
  }
};
