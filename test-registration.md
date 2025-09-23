# E-commerce User Registration API

## Base URL
```
http://localhost:3000/api/auth
```

## Endpoints

### 1. User Registration
**POST** `/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**With Profile Image (multipart/form-data):**
```
Form Data:
- firstName: "John"
- lastName: "Doe"
- email: "john.doe@example.com"
- password: "password123"
- phone: "+1234567890"
- dateOfBirth: "1990-01-01"
- gender: "male"
- profileImage: [file upload]
```
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "customer",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "isActive": true,
    "isDeleted": false,
    "totalOrders": 0,
    "totalSpent": 0,
    "loyaltyPoints": 0,
    "referralCode": "ABC123",
    "profileImage": null,
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### 2. User Login
**POST** `/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userData": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "customer",
    "lastLogin": "2023-09-06T10:35:00.000Z"
  }
}
```

### 3. Get Current User Profile
**GET** `/profile`
**Headers:** `auth-token: <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "customer",
    "totalOrders": 0,
    "totalSpent": 0,
    "loyaltyPoints": 0
  }
}
```

### 4. Update User Profile
**PUT** `/profile`
**Headers:** `auth-token: <token>`

**Request Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "notes": "Some notes about the user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "profileImage": "uploads/profile-images/profile-1234567890.jpg"
  }
}
```

**Note:** Profile images can be accessed via: `http://localhost:3200/uploads/profile-images/filename.jpg`

### 5. Update Profile Image
**PATCH** `/profile/image`
**Headers:** `auth-token: <token>`
**Content-Type:** `multipart/form-data`

**Request Body:**
```
Form Data:
- profileImage: [file upload]
```

**Response:**
```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "data": {
    "profileImage": "uploads/profile-images/profile-1234567890.jpg"
  }
}
```

**Note:** Profile images can be accessed via: `http://localhost:3200/uploads/profile-images/filename.jpg`

### 6. Forgot Password
**POST** `/forgot-password`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "newPass": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

## Features Implemented

✅ **User Registration** with comprehensive validation
✅ **Profile Image Upload** with multer middleware
✅ **Profile Update** functionality
✅ **Automatic creation** of Preferences and Cart for new users
✅ **Password hashing** with bcrypt (12 rounds)
✅ **Email uniqueness** validation
✅ **JWT token** generation for authentication
✅ **Login with** email/password validation
✅ **Profile management** with protected routes
✅ **Admin routes** for user management
✅ **Proper error handling** and responses
✅ **Input validation** using Joi schemas
✅ **File upload validation** (image types, size limits)

## Database Models Created

- **User Model**: Core user information and authentication
- **Preferences Model**: User preferences and settings
- **Cart Model**: Shopping cart functionality
- **Wishlist Model**: Product wishlist
- **Payment Method Model**: Payment information
- **Address Model**: User addresses

## Next Steps

1. Test the registration API with Postman or similar tool
2. Implement email verification functionality
3. Add password reset via email
4. Create controllers for other models (Cart, Address, etc.)
5. Implement product management APIs
6. Add order management functionality
