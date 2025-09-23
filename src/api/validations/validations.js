const joi = require("@hapi/joi");

const registrationValidation = (data) => {
  const schema = joi.object({
    firstName: joi.string().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
    lastName: joi.string().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
    email: joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    phone: joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional().messages({
      'string.pattern.base': 'Please enter a valid phone number'
    }),
    dateOfBirth: joi.date().max('now').optional().messages({
      'date.max': 'Date of birth must be in the past'
    }),
    gender: joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').optional(),
    role: joi.string().valid('bidder', 'seller', 'admin', 'moderator', 'guest').optional(),
    // Optional preferences
    currency: joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK').optional(),
    language: joi.string().valid('en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar').optional(),
    timezone: joi.string().optional()
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: joi.string().required().messages({
      'any.required': 'Password is required'
    }),
  });
  return schema.validate(data);
};

const profileUpdateValidation = (data) => {
  const schema = joi.object({
    firstName: joi.string().min(2).max(50).optional().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters'
    }),
    lastName: joi.string().min(2).max(50).optional().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
    phone: joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional().messages({
      'string.pattern.base': 'Please enter a valid phone number'
    }),
    dateOfBirth: joi.date().max('now').optional().messages({
      'date.max': 'Date of birth must be in the past'
    }),
    gender: joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').optional(),
    notes: joi.string().max(500).optional().messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
  });
  return schema.validate(data);
};

const forgotPassValidations = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    newPass: joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'New password is required'
    }),
  });
  return schema.validate(data);
};

// Auction-specific registration validation
const auctionRegistrationValidation = (data) => {
  const schema = joi.object({
    firstName: joi.string().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
    lastName: joi.string().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
    email: joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    phone: joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional().messages({
      'string.pattern.base': 'Please enter a valid phone number'
    }),
    dateOfBirth: joi.date().max('now').optional().messages({
      'date.max': 'Date of birth must be in the past'
    }),
    gender: joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').optional(),
    role: joi.string().valid('bidder', 'seller', 'admin', 'moderator', 'guest').default('bidder'),
    // Auction-specific fields
    location: joi.object({
      country: joi.string().required().messages({
        'any.required': 'Country is required for auction participation'
      }),
      state: joi.string().optional(),
      city: joi.string().optional()
    }).required(),
    // Optional preferences
    currency: joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK').default('USD'),
    language: joi.string().valid('en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar').default('en'),
    timezone: joi.string().optional()
  });
  return schema.validate(data);
};

module.exports = {
  registrationValidation,
  loginValidation,
  profileUpdateValidation,
  forgotPassValidations,
  auctionRegistrationValidation,
};
