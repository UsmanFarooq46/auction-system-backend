const { AuthService } = require("../../services");
const { UserRegistrationDTO, UserResponseDTO, UserLoginDTO, AuthResponseDTO } = require("../../dto");
const { sendSuccess, sendError } = require("../../../utils/response_handler");
const validations = require("../../validations/validations");

// Auction-specific user registration
const registerAuctionUser = async (req, res, next) => {
  try {
    // Validate request data using auction-specific validation
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

    // Create DTO from request data
    const userData = new UserRegistrationDTO(req.body);
    
    // Handle profile image if provided
    const profileImagePath = req.file ? req.file.path : null;

    // Call service layer
    const user = await AuthService.registerUser(userData, profileImagePath);

    // Create response DTO
    const userResponse = new UserResponseDTO(user);

    // Send success response
    sendSuccess(res, 201, "Auction user registered successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

// Get auction user profile
const getAuctionProfile = async (req, res, next) => {
  try {
    const user = await AuthService.getUserById(req.user._id);
    const userResponse = new UserResponseDTO(user);
    sendSuccess(res, 200, "Auction profile retrieved successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

// Update auction user profile
const updateAuctionProfile = async (req, res, next) => {
  try {
    // Validate request data
    const { error } = validations.profileUpdateValidation(req.body);
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

    // Handle profile image if provided
    const updateData = { ...req.body };
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const user = await AuthService.updateUserProfile(req.user._id, updateData);
    const userResponse = new UserResponseDTO(user);
    sendSuccess(res, 200, "Auction profile updated successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

// Login for auction users
const loginAuctionUser = async (req, res, next) => {
  try {
    // Validate request data
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

    // Create DTO from request data
    const loginData = new UserLoginDTO(req.body);

    // Call service layer
    const authResult = await AuthService.loginUser(loginData.email, loginData.password);

    // Create response DTO
    const authResponse = new AuthResponseDTO(authResult.user, authResult.token);

    res.header("auth-token", authResult.token);
    sendSuccess(res, 200, "Auction user login successful", authResponse);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerAuctionUser,
  getAuctionProfile,
  updateAuctionProfile,
  loginAuctionUser
};

