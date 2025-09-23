# Three-Layer Architecture Implementation

## Overview
This project now follows a proper three-layer architecture pattern that separates concerns and makes the codebase more maintainable, testable, and scalable.

## Architecture Layers

### 1. Presentation Layer (Controllers + Routers)
**Location**: `src/api/controllers/` and `src/api/routers/`

**Responsibilities**:
- Handle HTTP requests and responses
- Input validation
- Route requests to appropriate services
- Transform data using DTOs
- Handle file uploads and middleware

**Key Files**:
- `src/api/controllers/auth/auth-controller.js` - Authentication endpoints
- `src/api/routers/auth/auth-router.js` - Route definitions

**Example Controller Method**:
```javascript
const addNewUser = async (req, res, next) => {
  try {
    // 1. Validate input
    const { error } = validations.registrationValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
      });
    }

    // 2. Create DTO
    const userData = new UserRegistrationDTO(req.body);
    
    // 3. Call service layer
    const user = await AuthService.registerUser(userData, profileImagePath);

    // 4. Transform response
    const userResponse = new UserResponseDTO(user);

    // 5. Send response
    sendSuccess(res, 201, "User registered successfully", userResponse);
  } catch (error) {
    next(error);
  }
};
```

### 2. Business Logic Layer (Services)
**Location**: `src/api/services/`

**Responsibilities**:
- Implement business rules and logic
- Coordinate between different models
- Handle complex operations
- Data transformation and validation
- Database operations coordination

**Key Files**:
- `src/api/services/auth.service.js` - Authentication business logic
- `src/api/services/index.js` - Service exports

**Example Service Method**:
```javascript
static async registerUser(userData, profileImagePath = null) {
  // Business logic for user registration
  const existingUser = await User.findOne({
    email: userData.email.toLowerCase(),
    isDeleted: false
  });
  
  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  // Hash password, create user, preferences, cart, etc.
  // Return processed data
}
```

### 3. Data Access Layer (Models)
**Location**: `src/api/models/`

**Responsibilities**:
- Define database schemas
- Handle database operations
- Data validation at model level
- Relationships between entities

**Key Files**:
- `src/api/models/user.model.js` - User schema and validation
- `src/api/models/index.js` - Model exports

## Supporting Components

### Data Transfer Objects (DTOs)
**Location**: `src/api/dto/`

**Purpose**: 
- Standardize data structure between layers
- Control what data is exposed to clients
- Transform data for different contexts

**Example**:
```javascript
class UserResponseDTO {
  constructor(user) {
    this.id = user._id;
    this.firstName = user.firstName;
    this.email = user.email;
    // Only include safe fields, exclude password
  }
}
```

### Error Handling
**Location**: `src/utils/app_error.js` and `src/middleware/custome_error.js`

**Features**:
- Custom error classes
- Centralized error handling
- Consistent error response format
- Automatic error logging

### Response Utilities
**Location**: `src/utils/response_handler.js`

**Features**:
- Standardized success responses
- Consistent error responses
- Support for metadata (pagination, etc.)

## API Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "meta": {
    // Optional metadata (pagination, etc.)
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required",
      "value": null
    }
  ]
}
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Easy to modify business logic without affecting other layers
3. **Testability**: Each layer can be tested independently
4. **Scalability**: Easy to add new features and endpoints
5. **Reusability**: Services can be reused across different controllers
6. **Consistency**: Standardized response format and error handling
7. **Security**: DTOs control data exposure, preventing sensitive data leaks

## File Structure
```
src/
├── api/
│   ├── controllers/          # Presentation Layer
│   │   └── auth/
│   ├── services/             # Business Logic Layer
│   │   └── auth.service.js
│   ├── models/               # Data Access Layer
│   │   └── user.model.js
│   ├── dto/                  # Data Transfer Objects
│   │   └── auth.dto.js
│   ├── routers/              # Route definitions
│   │   └── auth/
│   └── validations/          # Input validation
├── middleware/               # Express middleware
├── utils/                    # Utility functions
└── config/                   # Configuration files
```

## Best Practices Implemented

1. **Single Responsibility**: Each class/function has one clear purpose
2. **Dependency Injection**: Services are injected into controllers
3. **Error Handling**: Centralized and consistent error management
4. **Validation**: Input validation at controller level
5. **Data Transformation**: DTOs handle data structure changes
6. **Async/Await**: Proper async handling throughout
7. **Logging**: Error logging for debugging
8. **Security**: Password exclusion, input sanitization

## Next Steps

1. Add more service layers for other entities (products, orders, etc.)
2. Implement caching layer for better performance
3. Add comprehensive logging system
4. Implement rate limiting
5. Add API documentation with Swagger
6. Add unit tests for each layer
7. Implement database transactions for complex operations
