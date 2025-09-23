# E-commerce User Registration API

A comprehensive Node.js/Express API for e-commerce user management with profile image uploads, authentication, and modular database design.

## 🚀 Features

- **User Registration & Authentication**
- **Profile Image Upload** with multer middleware
- **JWT Token Authentication**
- **Password Hashing** with bcrypt
- **Input Validation** with Joi
- **Modular Database Models**
- **File Upload Management**
- **Admin User Management**
- **Error Handling & Logging**

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SMS_Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
PORT=3200
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
SMS_Backend/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   └── auth/
│   │   │       └── auth-controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── preferences.model.js
│   │   │   ├── cart.model.js
│   │   │   ├── wishlist.model.js
│   │   │   ├── payment-method.model.js
│   │   │   ├── address.model.js
│   │   │   └── index.js
│   │   ├── routers/
│   │   │   └── auth/
│   │   │       └── auth-router.js
│   │   └── validations/
│   │       └── validations.js
│   ├── config/
│   │   └── db.config.js
│   ├── middleware/
│   │   ├── auth_check.js
│   │   ├── custome_error.js
│   │   └── upload.js
│   ├── utils/
│   │   ├── async_handler.js
│   │   └── error_response.js
│   └── uploads/
│       └── profile-images/
├── app.js
├── index.js
├── package.json
└── README.md
```

## 🗄️ Database Models

### User Model
- Authentication (email, password)
- Personal information (firstName, lastName, phone, etc.)
- E-commerce stats (totalOrders, totalSpent, loyaltyPoints)
- Security features (2FA, password reset tokens)
- Profile management (profileImage, notes)

### Related Models
- **Preferences**: User settings, currency, language, notifications
- **Cart**: Shopping cart with items, totals, coupons
- **Wishlist**: Product wishlist with priorities
- **Payment Methods**: Secure payment information storage
- **Addresses**: Multiple addresses for billing/shipping

## 🔌 API Endpoints

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration (with optional profile image) |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Password reset |

### Protected Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update user profile (with optional image) |
| PATCH | `/api/auth/profile/image` | Update profile image only |
| GET | `/api/auth/users` | Get all users (admin) |
| GET | `/api/auth/users/active` | Get active users only |
| GET | `/api/auth/users/:id` | Get specific user |

### Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/api/auth/users/:id/disable` | Disable user (admin only) |

## 📝 API Examples

### User Registration
```javascript
// Basic registration
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1234567890',
    gender: 'male'
  })
});

// Registration with profile image
const formData = new FormData();
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('email', 'john@example.com');
formData.append('password', 'password123');
formData.append('profileImage', imageFile);

const response = await fetch('/api/auth/register', {
  method: 'POST',
  body: formData
});
```

### User Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const { token, userData } = await response.json();
```

### Update Profile
```javascript
const response = await fetch('/api/auth/profile', {
  method: 'PUT',
  headers: { 
    'Content-Type': 'application/json',
    'auth-token': token 
  },
  body: JSON.stringify({
    firstName: 'John Updated',
    lastName: 'Doe Updated',
    phone: '+9876543210'
  })
});
```

## 🖼️ File Upload Features

### Supported Features
- **Image Types**: JPG, PNG, GIF, WebP, etc.
- **File Size**: Up to 5MB
- **Storage**: Local file system with organized directories
- **Security**: File type validation, unique naming
- **Access**: Static file serving via `/uploads/` endpoint

### File Access
Profile images are accessible via:
```
http://localhost:3200/uploads/profile-images/filename.jpg
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive Joi schemas
- **File Upload Security**: Type and size validation
- **Role-based Access**: Admin and user permissions
- **Error Handling**: Secure error responses

## 🧪 Testing

Run the test script to verify API functionality:
```bash
node test-api.js
```

## 📦 Dependencies

### Core Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `multer`: File upload handling
- `@hapi/joi`: Input validation
- `cors`: Cross-origin resource sharing
- `morgan`: HTTP request logging

### Development Dependencies
- `nodemon`: Auto-restart on file changes
- `axios`: HTTP client for testing

## 🚀 Deployment

1. **Environment Variables**
   - Set production MongoDB URI
   - Configure JWT secret
   - Set appropriate port

2. **File Uploads**
   - Configure cloud storage (AWS S3, etc.)
   - Update upload middleware for cloud storage

3. **Security**
   - Enable HTTPS
   - Configure CORS properly
   - Set up rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the test examples

---

**Happy Coding! 🎉**
