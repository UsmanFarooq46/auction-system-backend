const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for profile images
const profileImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const profileImagesDir = path.join(uploadsDir, 'profile-images');
    if (!fs.existsSync(profileImagesDir)) {
      fs.mkdirSync(profileImagesDir, { recursive: true });
    }
    cb(null, profileImagesDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer for profile image uploads
const uploadProfileImage = multer({
  storage: profileImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file
  }
});

// Middleware for single profile image upload
const uploadSingleProfileImage = uploadProfileImage.single('profileImage');

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file is allowed.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (jpg, png, gif, etc.) are allowed.'
    });
  }
  
  next(error);
};

// Configure storage for auction images
const auctionImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const auctionImagesDir = path.join(uploadsDir, 'auction-images');
    if (!fs.existsSync(auctionImagesDir)) {
      fs.mkdirSync(auctionImagesDir, { recursive: true });
    }
    cb(null, auctionImagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'auction-' + uniqueSuffix + ext);
  }
});

// Configure multer for auction image uploads (multiple)
const uploadAuctionImagesMulter = multer({
  storage: auctionImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per image
    files: 10 // Max 10 images
  }
});

// Middleware for multiple auction images upload
const uploadAuctionImages = uploadAuctionImagesMulter.array('images', 10);

module.exports = {
  uploadSingleProfileImage,
  uploadAuctionImages,
  handleUploadError
};
