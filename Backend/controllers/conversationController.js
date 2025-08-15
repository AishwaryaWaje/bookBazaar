import Conversation from "../models/Conversation.js";
import Book from "../models/Book.js";
import Message from "../models/Message.js";

export const getOrCreateConversation = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "User not authenticated (no user id)" });
  if (!bookId) return res.status(400).json({ message: "bookId is required" });

  try {
    const book = await Book.findById(bookId).populate("listedBy", "_id username");
    if (!book) return res.status(404).json({ message: "Book not found" });

    const sellerId = (book.listedBy?._id || book.listedBy)?.toString();
    if (!sellerId) {
      return res.status(500).json({ message: "Book missing listedBy; cannot start chat." });
    }
    if (sellerId === userId.toString()) {
      return res.status(400).json({ message: "You listed this book. Chat not needed." });
    }

    let convo = await Conversation.findOne({
      book: bookId,
      participants: { $all: [userId, sellerId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        book: bookId,
        participants: [userId, sellerId],
      });
    }

    convo = await convo.populate([
      { path: "book", select: "title price image condition genere listedBy" },
      { path: "participants", select: "username email" },
    ]);

    res.status(200).json(convo);
  } catch (e) {
    console.error("getOrCreateConversation error:", e);
    res.status(500).json({ message: "Conversation error", error: e.message });
  }
};

export const getUserConversations = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "User not authenticated" });

  try {
    const convos = await Conversation.find({ participants: userId })
      .populate("book", "title price image condition genere listedBy")
      .populate("participants", "username email")
      .sort({ updatedAt: -1 })
      .lean();

    const convosWithLastMsg = await Promise.all(
      convos.map(async (convo) => {
        const lastMsg = await Message.findOne({ conversationId: convo._id })
          .sort({ createdAt: -1 })
          .lean();
        return {
          ...convo,
          lastMessage: lastMsg ? lastMsg.text : "",
        };
      })
    );

    res.status(200).json(convosWithLastMsg);
  } catch (e) {
    console.error("getUserConversations error:", e);
    res.status(500).json({ message: "Failed to fetch conversations", error: e.message });
  }
};

export const deleteConversation = async (req, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const conversation = await Conversation.findOne({ _id: id, participants: userId });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found or access denied" });
    }
    await Conversation.findByIdAndDelete(id);

    await Message.deleteMany({ conversationId: id });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (e) {
    console.error("deleteConversation error:", e);
    res.status(500).json({ message: "Failed to delete conversation", error: e.message });
  }
};
