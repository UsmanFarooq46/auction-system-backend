const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ auction: 1, updatedAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
