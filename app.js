const express = require("express");
const app = express();
const http = require("http");
const morgan = require("morgan");
const { Server } = require("socket.io");
const errorHandler=require("./src/middleware/custome_error")
const routers = require('./src/api/routers');
const path = require('path');
const { initChatSocket } = require("./src/socket/chat.socket");

//middlewares
app.use(express.json());
app.use(morgan("tiny"));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

//Cors
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

// port listening
let port = process.env.PORT || 3200;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initChatSocket(io);

server.listen(port, () => {
  console.log(`running on port ${port}`);
  console.log(`url: http://localhost:${port}`);
});

// Auction System Routers
app.get("/", (req, res) => {
  res.send("Welcome to Online Auction System");
});

// handle error 
app.use('/api',routers)
app.use(errorHandler)

module.exports = app;
