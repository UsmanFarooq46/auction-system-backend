const { AuctionService } = require("../services");
const { sendSuccess, sendError } = require("../../utils/response_handler");
const validations = require("../validations/validations");

/**
 * Controller for auction related operations
 */
class AuctionController {
  /**
   * Create a new auction
   */
  static async createAuction(req, res, next) {
    try {
      // Clean up fields not allowed in create
      delete req.body.existingImages;

      // Validate request data
      const { error } = validations.auctionCreateValidation(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }))
        });
      }

      // Handle image uploads
      const imagePaths = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          // Robustly get path relative to uploads folder
          // Split by 'uploads' and take the last part
          const pathSegments = file.path.split(/[\\/]uploads[\\/]/);
          const relativePath = pathSegments.length > 1 ? pathSegments[1] : pathSegments[0];
          imagePaths.push('uploads/' + relativePath.replace(/\\/g, '/'));
        });
      } else if (req.file) {
        const pathSegments = req.file.path.split(/[\\/]uploads[\\/]/);
        const relativePath = pathSegments.length > 1 ? pathSegments[1] : pathSegments[0];
        imagePaths.push('uploads/' + relativePath.replace(/\\/g, '/'));
      }

      // At least one image is required by the model
      if (imagePaths.length === 0) {
        return sendError(res, 400, "At least one image is required for the auction");
      }

      // Call service layer
      const auction = await AuctionService.createAuction(
        req.body,
        req.user._id,
        imagePaths
      );

      sendSuccess(res, 201, "Auction created successfully", auction);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get auction by ID
   */
  static async getAuctionById(req, res, next) {
    try {
      const auction = await AuctionService.getAuctionById(req.params.id);
      sendSuccess(res, 200, "Auction retrieved successfully", auction);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all auctions with filtering
   */
  static async getAllAuctions(req, res, next) {
    try {
      const result = await AuctionService.getAllAuctions(req.query);
      sendSuccess(res, 200, "Auctions retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get my auctions (for logged in seller)
   */
  static async getMyAuctions(req, res, next) {
    try {
      const auctions = await AuctionService.getAuctionsBySeller(req.user._id);
      sendSuccess(res, 200, "Your auctions retrieved successfully", auctions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update auction
   */
  static async updateAuction(req, res, next) {
    try {
      // Validate update data
      const { error } = validations.auctionUpdateValidation(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }))
        });
      }

      // Handle new image uploads
      const newImagePaths = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const pathSegments = file.path.split(/[\\/]uploads[\\/]/);
          const relativePath = pathSegments.length > 1 ? pathSegments[1] : pathSegments[0];
          newImagePaths.push('uploads/' + relativePath.replace(/\\/g, '/'));
        });
      }

      // Handle existing images
      let finalImagePaths = [];
      if (req.body.existingImages) {
        try {
          finalImagePaths = JSON.parse(req.body.existingImages);
        } catch (e) {
          finalImagePaths = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
        }
      }

      // Merge new images
      finalImagePaths = [...finalImagePaths, ...newImagePaths];

      // Prepare update object
      const updateData = { ...req.body };
      if (finalImagePaths.length > 0) {
        updateData.images = finalImagePaths;
      }
      
      // Clean up fields that shouldn't be directly updated or are handled separately
      delete updateData.existingImages;

      const auction = await AuctionService.updateAuction(
        req.params.id,
        updateData,
        req.user._id
      );
      sendSuccess(res, 200, "Auction updated successfully", auction);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete auction
   */
  static async deleteAuction(req, res, next) {
    try {
      await AuctionService.deleteAuction(req.params.id, req.user._id);
      sendSuccess(res, 200, "Auction deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuctionController;
