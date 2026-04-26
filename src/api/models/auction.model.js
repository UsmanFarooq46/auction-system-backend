const mongoose = require("mongoose");

const auctionModelSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [10, "Title must be at least 10 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [5, "Description must be at least 5 characters"],
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ['electronics', 'art-collectibles', 'jewelry', 'vehicles', 'real-estate', 'antiques', 'books', 'clothing', 'sports', 'other'],
    default: 'other'
  },
  condition: {
    type: String,
    required: [true, "Condition is required"],
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    default: 'good'
  },

  // Seller Information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Seller is required"]
  },

  // Pricing Information
  startingPrice: {
    type: Number,
    required: [true, "Starting price is required"],
    min: [1, "Starting price must be greater than 0"]
  },
  reservePrice: {
    type: Number,
    min: [1, "Reserve price must be greater than 0"],
    default: null
  },
  currentBid: {
    type: Number,
    default: 0
  },

  // Auction Timing
  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"]
  },
  duration: {
    type: Number, // In days
    required: [true, "Duration is required"],
    min: [1, "Duration must be at least 1 day"],
    max: [90, "Duration cannot exceed 90 days"]
  },

  // Location
  isPublic: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    minlength: [5, "Location must be at least 5 characters"]
  },

  // Images
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(value) {
        return value.length > 0 && value.length <= 10;
      },
      message: "At least 1 image and maximum 10 images are required"
    }
  },

  // Auction Status
  status: {
    type: String,
    enum: ['pending', 'live', 'ended', 'sold', 'unsold', 'cancelled'],
    default: 'pending'
  },

  // Auction Statistics
  totalBids: {
    type: Number,
    default: 0
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },

  // Soft Delete
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index for queries
auctionModelSchema.index({ seller: 1, isDeleted: 1 });
auctionModelSchema.index({ status: 1, isDeleted: 1 });
auctionModelSchema.index({ category: 1, isDeleted: 1 });
auctionModelSchema.index({ endDate: 1 });

const Auction = mongoose.model("Auction", auctionModelSchema);

module.exports = Auction;
