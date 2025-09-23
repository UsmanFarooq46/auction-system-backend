const express = require("express");
const app = express();
const morgan = require("morgan");
const errorHandler=require("./src/middleware/custome_error")
const routers = require('./src/api/routers');
const path = require('path');

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
app.listen(port, () => {
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
