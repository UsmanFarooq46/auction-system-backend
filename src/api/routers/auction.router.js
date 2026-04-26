const express = require('express');
const router = express.Router();
const AuctionAuthController = require('../controllers/auth/auction-auth.controller');
const AuctionController = require('../controllers/auction.controller');
const { authVerify } = require('../../middleware/auth_check');
const { uploadSingleProfileImage, uploadAuctionImages, handleUploadError } = require('../../middleware/upload');
const asyncHandler = require('../../utils/async_handler');

/**
 * --- Auction USER Routes ---
 */

// Register auction user
router.post('/register', uploadSingleProfileImage, handleUploadError, asyncHandler(AuctionAuthController.register));

// Login auction user
router.post('/login', asyncHandler(AuctionAuthController.login));

// Get auction profile
router.get('/profile', authVerify, asyncHandler(AuctionAuthController.getProfile));

// Update auction profile
router.put('/profile', authVerify, asyncHandler(AuctionAuthController.updateProfile));


/**
 * --- Auction ITEM Routes ---
 */

// Create a new auction
router.post(
  '/',
  authVerify,
  uploadAuctionImages,
  handleUploadError,
  asyncHandler(AuctionController.createAuction)
);

// Get all auctions (with filters)
router.get('/', asyncHandler(AuctionController.getAllAuctions));

// Get current user's auctions
router.get('/my-auctions', authVerify, asyncHandler(AuctionController.getMyAuctions));

// Get auction by ID
router.get('/:id', asyncHandler(AuctionController.getAuctionById));

// Update auction
router.put('/:id', authVerify, uploadAuctionImages, handleUploadError, asyncHandler(AuctionController.updateAuction));

// Delete auction
router.delete('/:id', authVerify, asyncHandler(AuctionController.deleteAuction));

module.exports = router;
