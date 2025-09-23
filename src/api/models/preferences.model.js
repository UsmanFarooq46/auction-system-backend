const mongoose = require("mongoose");

const preferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currency: {
    type: String,
    default: 'Rs',
    enum: ['USD', 'EUR', 'Rs']
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar']
  },
  timezone: {
    type: String,
    default: 'Asia/Karachi'
  },
  dateFormat: {
    type: String,
    default: 'MM/DD/YYYY',
    enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']
  },
  newsletter: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  marketingEmails: {
    type: Boolean,
    default: true
  },
  orderUpdates: {
    type: Boolean,
    default: true
  },
  priceAlerts: {
    type: Boolean,
    default: true
  },
  stockNotifications: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    default: 'light',
    enum: ['light', 'dark', 'auto']
  },
  itemsPerPage: {
    type: Number,
    default: 20,
    min: 10,
    max: 100
  }
}, {
  timestamps: true
});

preferencesSchema.index({ userId: 1 });

const Preferences = mongoose.model("Preferences", preferencesSchema);
module.exports = Preferences;
