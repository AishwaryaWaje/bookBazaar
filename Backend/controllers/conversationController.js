import Conversation from "../models/Conversation.js";
import Book from "../models/Book.js";
import Message from "../models/Message.js";

/**
 * @description Retrieves an existing conversation or creates a new one for a given book and current user.
 * @route POST /api/conversations/get-or-create
 * @param {object} req - The request object.
 * @param {string} req.body.bookId - The ID of the book for which to get or create a conversation.
 * @param {object} req.user - The authenticated user object, containing `userId`.
 * @param {object} res - The response object.
 * @returns {object} - A JSON object containing the conversation details.
 * @throws {object} - A JSON object with an error message if the user is not authenticated, bookId is missing, book not found, or other server errors occur.
 */
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

/**
 * @description Retrieves all conversations for the authenticated user.
 * @route GET /api/conversations
 * @param {object} req - The request object.
 * @param {object} req.user - The authenticated user object, containing `userId`.
 * @param {object} res - The response object.
 * @returns {Array<object>} - A JSON array of conversation objects, each populated with book and participant details, and the last message.
 * @throws {object} - A JSON object with an error message if the user is not authenticated or fetching conversations fails.
 */
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

/**
 * @description Deletes a conversation and all associated messages.
 * @route DELETE /api/conversations/:id
 * @param {object} req - The request object.
 * @param {string} req.params.id - The ID of the conversation to delete.
 * @param {object} req.user - The authenticated user object, containing `userId`.
 * @param {object} res - The response object.
 * @returns {object} - A JSON object with a success message.
 * @throws {object} - A JSON object with an error message if the user is not authenticated, conversation not found, unauthorized, or deletion fails.
 */
export const deleteConversation = async (req, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some((p) => p.equals(userId));
    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }
    await Conversation.findByIdAndDelete(id);

    await Message.deleteMany({ conversationId: id });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (e) {
    console.error("deleteConversation error:", e);
    res.status(500).json({ message: "Failed to delete conversation", error: e.message });
  }
};
