const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

function connectMongoos() {
  // console.log("dot env variable: ",process.env.DB_connect);
  mongoose
    .connect(
      "mongodb://127.0.0.1:27017/auction-system",
      // process.env.DB_connect,
      { useNewUrlParser: true }
    )
    .then(() => {
      console.log("Data Base connected");
    })
    .catch((err) => {
      console.log("not connected");
    });
}

module.exports = connectMongoos;
