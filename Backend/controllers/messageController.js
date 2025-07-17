import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getOrCreateConversation = async (req, res) => {
  const { recipientId } = req.body;
  const userId = req.user.userId;

  try {
    if (!recipientId) {
      return res.status(400).json({ message: "recipientId is required" });
    }

    const recipientExists = await User.findById(recipientId);
    if (!recipientExists) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    let convo = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    });
    if (!convo) {
      convo = new Conversation({ participants: [userId, recipientId] });
      await convo.save();
    }
    res.status(200).json(convo);
  } catch (e) {
    res.status(500).json({ message: "Conversation error", error: e.message });
  }
};

export const sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;

  try {
    if (!conversationId || !text) {
      return res.status(400).json({ message: "conversationId and text are required" });
    }

    const message = new Message({
      conversationId,
      sender: req.user.userId,
      text,
    });
    await message.save();
    res.status(201).json(message);
  } catch (e) {
    res.status(500).json({ message: "Failed to send a message", error: e.message });
  }
};

export const getMessage = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch messages", error: e.message });
  }
};

export const getUserConversation = async (req, res) => {
  try {
    const convos = await Conversation.find({ participants: req.user.userId }).populate(
      "participants",
      "username email"
    );
    res.status(200).json(convos);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch conversation", error: e.message });
  }
};
