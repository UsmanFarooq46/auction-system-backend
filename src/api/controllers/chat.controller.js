const { ChatService } = require("../services");
const { sendSuccess } = require("../../utils/response_handler");
const { getIO } = require("../../socket");

const createConversation = async (req, res) => {
  const { sellerId, auctionId } = req.body;
  const conversation = await ChatService.createOrGetConversation({
    buyerId: req.user._id,
    sellerId,
    auctionId,
  });

  sendSuccess(res, 200, "Conversation ready", conversation);
};

const getConversations = async (req, res) => {
  const conversations = await ChatService.listConversations(req.user._id);
  sendSuccess(res, 200, "Conversations fetched successfully", conversations);
};

const getMessages = async (req, res) => {
  const messages = await ChatService.listMessages(req.params.id, req.user._id);
  sendSuccess(res, 200, "Messages fetched successfully", messages);
};

const sendMessage = async (req, res) => {
  const message = await ChatService.sendMessage({
    conversationId: req.params.id,
    senderId: req.user._id,
    text: req.body.text,
  });

  const io = getIO();
  io.to(`conversation:${req.params.id}`).emit("chat:new_message", message);

  sendSuccess(res, 201, "Message sent successfully", message);
};

module.exports = {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
};
