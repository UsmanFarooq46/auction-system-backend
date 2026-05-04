const { AuthService } = require("../../services");
const { sendSuccess, sendError } = require("../../../utils/response_handler");
const validations = require("../../validations/validations");

/**
 * Controller for auction-specific user authentication and profile
 */
class AuctionAuthController {
  /**
   * Register a new auction user
   */
  static async register(req, res, next) {
    try {
      const { error } = validations.auctionRegistrationValidation(req.body);
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

      const profileImagePath = req.file ? req.file.path : null;
      const user = await AuthService.registerUser(req.body, profileImagePath);
      
      const userResponse = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        location: user.location,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt
      };

      sendSuccess(res, 201, "Auction user registered successfully", userResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login auction user
   */
  static async login(req, res, next) {
    try {
      const { error } = validations.loginValidation(req.body);
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

      const authResult = await AuthService.loginUser(req.body.email, req.body.password);
      
      const authResponse = {
        user: {
          id: authResult.user._id,
          firstName: authResult.user.firstName,
          lastName: authResult.user.lastName,
          email: authResult.user.email,
          role: authResult.user.role
        },
        token: authResult.token
      };

      res.header("auth-token", authResult.token);
      sendSuccess(res, 200, "Auction user login successful", authResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get auction user profile
   */
  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getUserById(req.user._id);
      
      // Add auction statistics (placeholders for now)
      const userProfile = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        location: user.location,
        totalAuctions: 0,
        totalBids: 0,
        totalWon: 0,
        totalSold: 0,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive
      };

      sendSuccess(res, 200, "Auction profile retrieved successfully", userProfile);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update auction user profile
   */
  static async updateProfile(req, res, next) {
    try {
      const user = await AuthService.updateUserProfile(req.user._id, req.body);
      
      const userResponse = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        location: user.location
      };

      sendSuccess(res, 200, "Auction profile updated successfully", userResponse);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuctionAuthController;
