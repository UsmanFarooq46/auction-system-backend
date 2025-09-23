const express = require("express");
const router = express.Router();
const authController = require('./../../controllers/auth/auth-controller');
const { authVerify } = require('./../../../middleware/auth_check');
const asyncHandler = require('../../../utils/async_handler');
const { uploadSingleProfileImage, handleUploadError } = require('../../../middleware/upload');

// Public routes (no authentication required)
router.post("/register", uploadSingleProfileImage, handleUploadError, asyncHandler(authController.addNewUser));
router.post("/login", asyncHandler(authController.login));

// Protected routes (authentication required)
router.get("/profile", authVerify, asyncHandler(authController.getProfile));
router.put("/profile", authVerify, uploadSingleProfileImage, handleUploadError, asyncHandler(authController.updateProfile));

module.exports = router;