const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required"]
  },
  
  // Notification Content
  title: {
    type: String,
    required: [true, "Notification title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  message: {
    type: String,
    required: [true, "Notification message is required"],
    trim: true,
    maxlength: [1000, "Message cannot exceed 1000 characters"]
  },
  
  // Notification Type
  type: {
    type: String,
    enum: [
      'bid_placed',
      'bid_outbid',
      'bid_won',
      'bid_lost',
      'auction_ending',
      'auction_ended',
      'auction_cancelled',
      'price_threshold_reached',
      'watchlist_auction_ending',
      'payment_required',
      'payment_received',
      'item_shipped',
      'item_delivered',
      'feedback_received',
      'system_announcement',
      'promotional'
    ],
    required: [true, "Notification type is required"]
  },
  
  // Related Entities
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction'
  },
  bid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  },
  
  // Notification Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  
  // Delivery Information
  deliveryMethod: {
    type: String,
    enum: ['in_app', 'email', 'sms', 'push'],
    default: 'in_app'
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  
  // Priority and Urgency
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  // Action Information
  actionUrl: {
    type: String,
    trim: true
  },
  actionText: {
    type: String,
    trim: true,
    maxlength: [50, "Action text cannot exceed 50 characters"]
  },
  
  // Expiration
  expiresAt: {
    type: Date
  },
  
  // Soft Delete
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time since creation
notificationSchema.virtual('timeSinceCreated').get(function() {
  return Date.now() - this.createdAt;
});

// Virtual for is expired
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Indexes for better query performance
notificationSchema.index({ user: 1, isRead: 1, isDeleted: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ auction: 1 });
notificationSchema.index({ bid: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ priority: 1, isUrgent: 1 });
notificationSchema.index({ expiresAt: 1 });

// Pre-save middleware to set expiration date based on type
notificationSchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    // Set expiration based on notification type
    const now = new Date();
    switch (this.type) {
      case 'bid_placed':
      case 'bid_outbid':
        this.expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        break;
      case 'auction_ending':
        this.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day
        break;
      case 'auction_ended':
      case 'bid_won':
      case 'bid_lost':
        this.expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        break;
      case 'payment_required':
        this.expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
        break;
      case 'system_announcement':
        this.expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
        break;
      default:
        this.expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
    }
  }
  
  next();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Method to mark as delivered
notificationSchema.methods.markAsDelivered = function() {
  this.isDelivered = true;
  this.deliveredAt = new Date();
  return this.save();
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    user: userId,
    isRead: false,
    isDeleted: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Static method to get notifications for user
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    limit = 20,
    skip = 0,
    type,
    isRead,
    priority,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;
  
  const query = {
    user: userId,
    isDeleted: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  };
  
  if (type) query.type = type;
  if (isRead !== undefined) query.isRead = isRead;
  if (priority) query.priority = priority;
  
  return this.find(query)
    .populate('auction', 'title currentBid endTime status')
    .populate('bid', 'amount bidTime')
    .sort({ [sortBy]: sortOrder })
    .limit(limit)
    .skip(skip);
};

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
