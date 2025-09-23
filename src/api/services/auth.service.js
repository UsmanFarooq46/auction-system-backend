const { User, Preferences, Cart } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppError } = require("../../utils/app_error");
const { asyncHandler } = require("../../utils/async_handler");

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} profileImagePath - Path to uploaded profile image
   * @returns {Promise<Object>} - User data without password
   */
  static async registerUser(userData, profileImagePath = null) {
    // Check if email already exists
    const existingUser = await User.findOne({
      email: userData.email.toLowerCase(),
      isDeleted: false
    });
    
    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    // Set default role
    userData.role = userData.role || "customer";
    
    // Handle profile image
    if (profileImagePath) {
      userData.profileImage = profileImagePath;
    }
    
    // Hash password
    if (userData.password) {
      const salt = await bcrypt.genSalt(12);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    // Create user
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    // Create default preferences
    const defaultPreferences = new Preferences({
      userId: savedUser._id,
      currency: userData.currency || 'Rs',
      language: userData.language || 'en',
      timezone: userData.timezone || 'Asia/Karachi'
    });
    await defaultPreferences.save();

    // Create empty cart
    const newCart = new Cart({
      userId: savedUser._id
    });
    await newCart.save();

    // Return user without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    return userResponse;
  }

  /**
   * Authenticate user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and token
   */
  static async loginUser(email, password) {
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isDeleted: false 
    });
    
    if (!user) {
      throw new AppError(`User not found under the email ${email}`, 404);
    }

    if (!user.isActive) {
      throw new AppError(
        "Your account has been disabled. Please contact admin to activate it",
        400
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 400);
    }

    // Update last login
    user.lastLogin = new Date();
    user.loginAttempts = 0;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        _id: user._id, 
        role: user.role, 
        email: user.email,
        date: new Date().toDateString() 
      },
      process.env.token_private,
      { expiresIn: "14d" }
    );

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      token: token
    };
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User data without password
   */
  static async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user || user.isDeleted) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated user data
   */
  static async updateUserProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user || user.isDeleted) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

module.exports = AuthService;
