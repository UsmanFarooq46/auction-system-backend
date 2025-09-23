const { AuthService } = require("../../services");
const { UserRegistrationDTO, UserResponseDTO, UserLoginDTO, AuthResponseDTO } = require("../../dto");
const { sendSuccess, sendError } = require("../../../utils/response_handler");
const validations = require("../../validations/validations");

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await AuthService.getUserById(req.user._id);
    const userResponse = new UserResponseDTO(user);
    sendSuccess(res, 200, "Profile retrieved successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
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
    sendSuccess(res, 200, "Profile updated successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

const addNewUser = async (req, res, next) => {
   const { error } = validations.registrationValidation(req.body);
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
   const userData = new UserRegistrationDTO(req.body);
   const profileImagePath = req.file ? req.file.path : null;
   const user = await AuthService.registerUser(userData, profileImagePath);
   const userResponse = new UserResponseDTO(user);
   sendSuccess(res, 201, "User registered successfully", userResponse);
};

const login = async (req, res, next) => {
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
    sendSuccess(res, 200, "Login successful", authResponse);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewUser,
  login,
  getProfile,
  updateProfile
};
