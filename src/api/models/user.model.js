const mongoose = require("mongoose");

const userModelSchema = new mongoose.Schema({
  // Basic Authentication & Profile
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    maxlength: [50, "First name cannot exceed 50 characters"]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    maxlength: [50, "Last name cannot exceed 50 characters"]
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"]
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value < new Date();
      },
      message: "Date of birth must be in the past"
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    default: 'prefer_not_to_say'
  },
  
  // Auction System Specific Fields
  role: {
    type: String,
    enum: ['bidder', 'seller', 'admin', 'moderator', 'guest'],
    default: 'bidder',
    required: [true, "Role is required"]
  },
  
  // Account Status & Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // Auction Statistics
  totalAuctions: {
    type: Number,
    default: 0
  },
  totalBids: {
    type: Number,
    default: 0
  },
  totalWon: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  lastBidDate: {
    type: Date
  },
  lastAuctionDate: {
    type: Date
  },
  
  // Auction Reputation & Rating
  sellerRating: {
    average: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"]
    },
    count: {
      type: Number,
      default: 0
    }
  },
  bidderRating: {
    average: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"]
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Account Verification
  isIdentityVerified: {
    type: Boolean,
    default: false
  },
  isPaymentVerified: {
    type: Boolean,
    default: false
  },
  
  // Social & Marketing
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  
  // Security & Authentication
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Profile Image
  profileImage: {
    type: String,
    default: null
  },

  // Additional Notes
  notes: {
    type: String,
    maxlength: [500, "Notes cannot exceed 500 characters"]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userModelSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userModelSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for better query performance
userModelSchema.index({ email: 1 });
userModelSchema.index({ role: 1 });
userModelSchema.index({ isActive: 1, isDeleted: 1 });
userModelSchema.index({ createdAt: -1 });

// Pre-save middleware to generate referral code
userModelSchema.pre('save', function(next) {
  if (this.isNew && !this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

const userModel = mongoose.model("User", userModelSchema);
module.exports = userModel;
