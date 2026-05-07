const { AppError } = require("../../utils/app_error");
const { Auction, Conversation, ChatMessage, User } = require("../models");

class ChatService {
  static async createOrGetConversation({ buyerId, sellerId, auctionId }) {
    if (!buyerId || !sellerId) {
      throw new AppError("Buyer and seller are required", 400);
    }

    if (buyerId.toString() === sellerId.toString()) {
      throw new AppError("You cannot start chat with yourself", 400);
    }

    const [buyer, seller] = await Promise.all([
      User.findById(buyerId),
      User.findById(sellerId),
    ]);

    if (!buyer || buyer.isDeleted) {
      throw new AppError("Buyer not found", 404);
    }
    if (!seller || seller.isDeleted) {
      throw new AppError("Seller not found", 404);
    }

    if (auctionId) {
      const auction = await Auction.findById(auctionId);
      if (!auction || auction.isDeleted) {
        throw new AppError("Auction not found", 404);
      }
      if (auction.seller.toString() !== sellerId.toString()) {
        throw new AppError("Provided seller does not match auction seller", 400);
      }
    }

    const baseFilter = {
      participants: { $all: [buyerId, sellerId], $size: 2 },
    };
    const filter = auctionId ? { ...baseFilter, auction: auctionId } : { ...baseFilter, auction: null };

    let conversation = await Conversation.findOne(filter);
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [buyerId, sellerId],
        auction: auctionId || null,
      });
    }

    return this.getConversationByIdForUser(conversation._id, buyerId);
  }

  static async getConversationByIdForUser(conversationId, userId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    }).populate("participants", "firstName lastName profileImage role");

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    return conversation;
  }

  static async listConversations(userId) {
    return Conversation.find({ participants: userId })
      .populate("participants", "firstName lastName profileImage role")
      .populate("auction", "title images")
      .sort({ lastMessageAt: -1 });
  }

  static async listMessages(conversationId, userId) {
    await this.getConversationByIdForUser(conversationId, userId);

    return ChatMessage.find({ conversation: conversationId })
      .populate("sender", "firstName lastName profileImage")
      .sort({ createdAt: 1 });
  }

  static async sendMessage({ conversationId, senderId, text }) {
    if (!text || !text.trim()) {
      throw new AppError("Message text is required", 400);
    }

    const conversation = await this.getConversationByIdForUser(conversationId, senderId);

    const message = await ChatMessage.create({
      conversation: conversation._id,
      sender: senderId,
      text: text.trim(),
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    return ChatMessage.findById(message._id).populate("sender", "firstName lastName profileImage");
  }
}

module.exports = ChatService;
