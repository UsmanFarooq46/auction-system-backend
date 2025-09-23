const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'apple_pay', 'google_pay', 'crypto'],
    required: true
  },
  // For card payments
  lastFour: {
    type: String,
    validate: {
      validator: function(value) {
        if (['credit_card', 'debit_card'].includes(this.type)) {
          return /^\d{4}$/.test(value);
        }
        return true;
      },
      message: "Last four digits must be exactly 4 digits"
    }
  },
  brand: {
    type: String,
    enum: ['visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', 'unionpay'],
    validate: {
      validator: function(value) {
        if (['credit_card', 'debit_card'].includes(this.type)) {
          return value !== undefined;
        }
        return true;
      },
      message: "Brand is required for card payments"
    }
  },
  expiryMonth: {
    type: Number,
    min: 1,
    max: 12,
    validate: {
      validator: function(value) {
        if (['credit_card', 'debit_card'].includes(this.type)) {
          return value !== undefined;
        }
        return true;
      },
      message: "Expiry month is required for card payments"
    }
  },
  expiryYear: {
    type: Number,
    min: new Date().getFullYear(),
    validate: {
      validator: function(value) {
        if (['credit_card', 'debit_card'].includes(this.type)) {
          return value !== undefined;
        }
        return true;
      },
      message: "Expiry year is required for card payments"
    }
  },
  // For PayPal
  paypalEmail: {
    type: String,
    lowercase: true,
    validate: {
      validator: function(value) {
        if (this.type === 'paypal') {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
        }
        return true;
      },
      message: "Valid PayPal email is required"
    }
  },
  // For bank transfers
  bankName: String,
  accountType: {
    type: String,
    enum: ['checking', 'savings', 'business']
  },
  routingNumber: {
    type: String,
    validate: {
      validator: function(value) {
        if (this.type === 'bank_transfer') {
          return /^\d{9}$/.test(value);
        }
        return true;
      },
      message: "Routing number must be 9 digits"
    }
  },
  // For crypto payments
  cryptoAddress: String,
  cryptoType: {
    type: String,
    enum: ['bitcoin', 'ethereum', 'litecoin', 'bitcoin_cash']
  },
  // Common fields
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  nickname: {
    type: String,
    maxlength: [50, "Nickname cannot exceed 50 characters"]
  },
  // Security
  tokenId: String, // For tokenized payments
  fingerprint: String, // For fraud detection
  addedAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: Date,
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
paymentMethodSchema.index({ userId: 1, isActive: 1 });
paymentMethodSchema.index({ userId: 1, isDefault: 1 });
paymentMethodSchema.index({ userId: 1, type: 1 });

// Pre-save middleware to ensure only one default payment method per user
paymentMethodSchema.pre('save', async function(next) {
  if (this.isDefault && this.isActive) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);
module.exports = PaymentMethod;
