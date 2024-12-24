import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const messageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  isUser: {
    type: Boolean,
    required: true,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const chatConversationSchema = mongoose.Schema(
  {
    analyticsId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Analytics'
    },
    messages: [messageSchema],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

chatConversationSchema.plugin(toJSON);

export default mongoose.models.ChatConversation || mongoose.model("ChatConversation", chatConversationSchema); 