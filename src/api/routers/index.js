
const express = require("express");
const router = express();

const authRouter=require('./auth/auth-router')
router.use("/auth",authRouter);

const adminDefinitions=require("./admin/definitions.router")
router.use("/admin_definitions",adminDefinitions);

const auctionRouter = require('./auction.router');
router.use("/auction", auctionRouter);

const chatRouter = require("./chat.router");
router.use("/chat", chatRouter);

module.exports = router;