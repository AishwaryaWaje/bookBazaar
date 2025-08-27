import mongoose from "mongoose";

/**
 * @typedef {object} Conversation
 * @property {mongoose.Schema.Types.ObjectId} book - The ID of the book associated with the conversation.
 * @property {Array<mongoose.Schema.Types.ObjectId>} participants - An array of user IDs participating in the conversation.
 * @property {string} [lastMessage] - The content of the last message sent in the conversation.
 * @property {mongoose.Schema.Types.ObjectId} [lastSender] - The ID of the user who sent the last message.
 * @property {Date} createdAt - The timestamp when the conversation was created.
 * @property {Date} updatedAt - The timestamp when the conversation was last updated.
 */
const conversationSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String },
    lastSender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

conversationSchema.index({ book: 1 });
conversationSchema.index({ updatedAt: -1 });

/**
 * Mongoose model for Conversation.
 * @type {mongoose.Model<Conversation>}
 */
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
