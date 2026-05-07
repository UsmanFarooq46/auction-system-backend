const jwt = require("jsonwebtoken");
const { setIO } = require("./index");
const { Conversation } = require("../api/models");
const ChatService = require("../api/services/chat.service");

const parseToken = (socket) =>
  socket.handshake.auth?.token ||
  socket.handshake.headers["auth-token"] ||
  socket.handshake.query?.token;

const initChatSocket = (io) => {
  setIO(io);

  io.use((socket, next) => {
    try {
      const token = parseToken(socket);
      if (!token) {
        return next(new Error("Authentication failed: token missing"));
      }
      const payload = jwt.verify(token, process.env.token_private);
      socket.user = payload;
      next();
    } catch (error) {
      next(new Error("Authentication failed: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id?.toString();
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on("chat:join_conversation", async ({ conversationId }) => {
      try {
        if (!conversationId) return;
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.user._id,
        });
        if (!conversation) {
          socket.emit("chat:error", { message: "Conversation not found" });
          return;
        }
        socket.join(`conversation:${conversationId}`);
      } catch (error) {
        socket.emit("chat:error", { message: "Unable to join conversation" });
      }
    });

    socket.on("chat:send_message", async ({ conversationId, text }) => {
      try {
        const message = await ChatService.sendMessage({
          conversationId,
          senderId: socket.user._id,
          text,
        });
        io.to(`conversation:${conversationId}`).emit("chat:new_message", message);
      } catch (error) {
        socket.emit("chat:error", { message: error.message || "Failed to send message" });
      }
    });
  });
};

module.exports = {
  initChatSocket,
};
