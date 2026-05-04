const { Auction } = require("../models");
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

      return auction;
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
}

module.exports = AuctionService;
