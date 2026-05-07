const express = require("express");
const router = express.Router();
const asyncHandler = require("../../utils/async_handler");
const { authVerify } = require("../../middleware/auth_check");
const ChatController = require("../controllers/chat.controller");

router.use(authVerify);

router.post("/conversations", asyncHandler(ChatController.createConversation));
router.get("/conversations", asyncHandler(ChatController.getConversations));
router.get("/conversations/:id/messages", asyncHandler(ChatController.getMessages));
router.post("/conversations/:id/messages", asyncHandler(ChatController.sendMessage));

module.exports = router;
