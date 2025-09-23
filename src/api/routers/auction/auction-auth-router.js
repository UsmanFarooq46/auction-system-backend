const express = require("express");
const router = express.Router();
const { registerAuctionUser, getAuctionProfile, updateAuctionProfile, loginAuctionUser } = require("../../controllers/auction/auction-auth-controller");
const authCheck = require("../../../middleware/auth_check");
const upload = require("../../../middleware/upload");

// Public routes
router.post("/register", upload.single('profileImage'), registerAuctionUser);
router.post("/login", loginAuctionUser);

// Protected routes
router.get("/profile", authCheck, getAuctionProfile);
router.put("/profile", authCheck, upload.single('profileImage'), updateAuctionProfile);

module.exports = router;


