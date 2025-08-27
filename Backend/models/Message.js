import mongoose from "mongoose";

/**
 * @typedef {object} Message
 * @property {mongoose.Schema.Types.ObjectId} conversationId - The ID of the conversation this message belongs to.
 * @property {mongoose.Schema.Types.ObjectId} sender - The ID of the user who sent the message.
 * @property {string} text - The content of the message.
 * @property {Date} createdAt - The timestamp when the message was created.
 * @property {Date} updatedAt - The timestamp when the message was last updated.
 */
const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

/**
 * Mongoose model for Message.
 * @type {mongoose.Model<Message>}
 */
const Message = mongoose.model("Message", messageSchema);
export default Message;
