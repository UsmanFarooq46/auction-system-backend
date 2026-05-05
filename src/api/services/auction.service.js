const { Auction, Bid } = require("../models");
const { AppError } = require("../../utils/app_error");

class AuctionService {
  /**
   * Create a new auction
   * @param {Object} auctionData - Auction data
   * @param {string} sellerId - Seller user ID
   * @param {Array} imagePaths - Paths to uploaded images
   * @returns {Promise<Object>} - Created auction
   */
  static async createAuction(auctionData, sellerId, imagePaths = []) {
    try {
      // Add seller and images to auction data
      const auctionPayload = {
        ...auctionData,
        seller: sellerId,
        images: imagePaths,
        status: 'pending',
        currentBid: auctionData.startingPrice
      };

      const newAuction = new Auction(auctionPayload);
      const savedAuction = await newAuction.save();

      // Populate seller information
      const populatedAuction = await savedAuction.populate('seller', 'firstName lastName email profileImage');

      return populatedAuction;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get auction by ID
   * @param {string} auctionId - Auction ID
   * @returns {Promise<Object>} - Auction data
   */
  static async getAuctionById(auctionId) {
    try {
      const auction = await Auction.findById(auctionId)
        .populate('seller', 'firstName lastName email profileImage phone')
        .populate('highestBidder', 'firstName lastName');

      if (!auction || auction.isDeleted) {
        throw new AppError("Auction not found", 404);
      }

      // Fetch recent bids for this auction
      const bids = await Bid.find({ auction: auctionId })
        .populate('bidder', 'firstName lastName profileImage')
        .sort({ amount: -1 })
        .limit(10);

      // Convert to plain object to attach bids
      const auctionObj = auction.toObject();
      auctionObj.bids = bids;

      return auctionObj;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all auctions
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} - List of auctions
   */
  static async getAllAuctions(filters = {}) {
    try {
      // Auto-update statuses before fetching
      await this.refreshAuctionStatuses();

      const query = { 
        isDeleted: false, 
        isPublic: true, 
        status: { $in: ['live', 'pending'] } 
      };

      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.category) query.category = filters.category;
      if (filters.minPrice) query.startingPrice = { $gte: filters.minPrice };
      if (filters.maxPrice) query.startingPrice = { ...query.startingPrice, $lte: filters.maxPrice };
      if (filters.location) query.location = new RegExp(filters.location, 'i');
      if (filters.seller) query.seller = filters.seller;

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const auctions = await Auction.find(query)
        .populate('seller', 'firstName lastName profileImage')
        .populate('highestBidder', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Auction.countDocuments(query);

      return {
        auctions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get auctions by seller
   * @param {string} sellerId - Seller ID
   * @returns {Promise<Array>} - List of seller's auctions
   */
  static async getAuctionsBySeller(sellerId) {
    try {
      const auctions = await Auction.find({
        seller: sellerId,
        isDeleted: false
      })
        .populate('highestBidder', 'firstName lastName')
        .sort({ createdAt: -1 });

      return auctions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get auctions where user is highest bidder
   * @param {string} bidderId - Bidder ID
   * @returns {Promise<Array>} - List of auctions
   */
  static async getAuctionsByBidder(bidderId) {
    try {
      const auctions = await Auction.find({
        highestBidder: bidderId,
        isDeleted: false
      })
        .populate('seller', 'firstName lastName profileImage')
        .sort({ updatedAt: -1 });

      return auctions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update auction
   * @param {string} auctionId - Auction ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User ID (to verify ownership)
   * @returns {Promise<Object>} - Updated auction
   */
  static async updateAuction(auctionId, updateData, userId) {
    try {
      const auction = await Auction.findById(auctionId);

      if (!auction || auction.isDeleted) {
        throw new AppError("Auction not found", 404);
      }

      // Only seller can update
      if (auction.seller.toString() !== userId.toString()) {
        throw new AppError("You don't have permission to update this auction", 403);
      }

      // Can't update if auction is live or ended
      if (auction.status === 'live' || auction.status === 'ended') {
        throw new AppError("Cannot update a live or ended auction", 400);
      }

      const updatedAuction = await Auction.findByIdAndUpdate(
        auctionId,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('seller', 'firstName lastName email profileImage')
        .populate('highestBidder', 'firstName lastName');

      return updatedAuction;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete auction (soft delete)
   * @param {string} auctionId - Auction ID
   * @param {string} userId - User ID (to verify ownership)
   * @returns {Promise<void>}
   */
  static async deleteAuction(auctionId, userId) {
    try {
      const auction = await Auction.findById(auctionId);

      if (!auction || auction.isDeleted) {
        throw new AppError("Auction not found", 404);
      }

      // Only seller can delete
      if (auction.seller.toString() !== userId.toString()) {
        throw new AppError("You don't have permission to delete this auction", 403);
      }

      // Can't delete if auction is live or ended
      if (auction.status === 'live' || auction.status === 'ended') {
        throw new AppError("Cannot delete a live or ended auction", 400);
      }

      auction.isDeleted = true;
      await auction.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update auction status
   * @param {string} auctionId - Auction ID
   * @param {string} status - New status
   * @returns {Promise<Object>} - Updated auction
   */
  static async updateAuctionStatus(auctionId, status) {
    try {
      const auction = await Auction.findByIdAndUpdate(
        auctionId,
        { status },
        { new: true, runValidators: true }
      );

      if (!auction || auction.isDeleted) {
        throw new AppError("Auction not found", 404);
      }

      return auction;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search auctions
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} - Search results
   */
  static async searchAuctions(searchTerm) {
    try {
      const auctions = await Auction.find({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ],
        isDeleted: false
      })
        .populate('seller', 'firstName lastName profileImage')
        .limit(20);

      return auctions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Place a bid on an auction
   * @param {string} auctionId - Auction ID
   * @param {string} bidderId - Bidder user ID
   * @param {number} bidAmount - Bid amount
   * @returns {Promise<Object>} - Updated auction
   */
  static async placeBid(auctionId, bidderId, bidAmount) {
    try {
      const auction = await Auction.findById(auctionId);

      if (!auction || auction.isDeleted) {
        throw new AppError("Auction not found", 404);
      }

      if (auction.status !== 'live') {
        throw new AppError("You can only bid on live auctions", 400);
      }

      if (auction.seller.toString() === bidderId.toString()) {
        throw new AppError("You cannot bid on your own auction", 400);
      }

      if (bidAmount <= auction.currentBid) {
        throw new AppError(`Bid must be greater than current bid: ${auction.currentBid}`, 400);
      }

      auction.currentBid = bidAmount;
      auction.highestBidder = bidderId;
      auction.totalBids += 1;
      
      const savedAuction = await auction.save();

      // Record the bid in history
      await Bid.create({
        auction: auctionId,
        bidder: bidderId,
        amount: bidAmount
      });

      return await savedAuction.populate('highestBidder', 'firstName lastName');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh auction statuses based on current time
   * Updates pending -> live and live -> ended
   */
  static async refreshAuctionStatuses() {
    try {
      const now = new Date();

      // 1. Update pending to live if startDate has passed
      const startResult = await Auction.updateMany(
        {
          status: 'pending',
          startDate: { $lte: now },
          isDeleted: false
        },
        { status: 'live' }
      );

      if (startResult.modifiedCount > 0) {
        console.log(`[AuctionService] Activated ${startResult.modifiedCount} auctions`);
      }

      // 2. Update live to ended if endDate has passed
      const endResult = await Auction.updateMany(
        {
          status: 'live',
          endDate: { $lte: now },
          isDeleted: false
        },
        { status: 'ended' }
      );

      if (endResult.modifiedCount > 0) {
        console.log(`[AuctionService] Ended ${endResult.modifiedCount} auctions`);
      }
    } catch (error) {
      console.error('[AuctionService] Error refreshing auction statuses:', error);
    }
  }
}

module.exports = AuctionService;
