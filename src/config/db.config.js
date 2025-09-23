const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

function connectMongoos() {
  // console.log("dot env variable: ",process.env.DB_connect);
  mongoose
    .connect(
      // "mongodb+srv://UsmanFarooq:03074324285@cluster0.9coy9.mongodb.net/HosspitalManagement?retryWrites=true&w=majority"
      // "mongodb://127.0.0.1:27017/crypto_wallet",
      // "mongodb://127.0.0.1:27017/ecommerce_system",
      "mongodb://127.0.0.1:27017/auction-system",
      // process.env.DB_connect,
      { useNewUrlParser: true }
      // "mongodb://127.0.0.1:27017/nakashtesting"
    )
    .then(() => {
      console.log("Data Base connected");
    })
    .catch((err) => {
      console.log("not connected");
    });
}

module.exports = connectMongoos;
