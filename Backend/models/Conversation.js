import mongoose from "mongoose";

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

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
