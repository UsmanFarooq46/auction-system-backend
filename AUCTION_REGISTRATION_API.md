# Auction System Registration API

This document describes the auction-specific registration API endpoints that have been added to the system.

## Overview

The auction system now includes specialized registration endpoints that handle auction-specific user roles and requirements.

## API Endpoints

### Base URL
```
http://localhost:3200/api/auction
```

## 1. Register Auction User

**Endpoint:** `POST /api/auction/register`

**Description:** Register a new user for the auction system with auction-specific fields.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "role": "bidder",
  "location": {
    "country": "United States",
    "state": "California",
    "city": "Los Angeles"
  },
  "currency": "USD",
  "language": "en",
  "timezone": "America/Los_Angeles"
}
```

**Required Fields:**
- `firstName` (string, 2-50 characters)
- `lastName` (string, 2-50 characters)
- `email` (valid email address)
- `password` (string, minimum 6 characters)
- `location.country` (string, required for auction participation)

**Optional Fields:**
- `phone` (valid phone number format)
- `dateOfBirth` (date in the past)
- `gender` (male, female, other, prefer_not_to_say)
- `role` (bidder, seller, admin, moderator, guest) - defaults to "bidder"
- `location.state` (string)
- `location.city` (string)
- `currency` (USD, EUR, GBP, CAD, AUD, JPY, CHF, SEK, NOK, DKK) - defaults to "USD"
- `language` (en, es, fr, de, it, pt, ru, zh, ja, ko, ar) - defaults to "en"
- `timezone` (string)

**Response:**
```json
{
  "success": true,
  "message": "Auction user registered successfully",
  "data": {
    "id": "user_id_here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "bidder",
    "location": {
      "country": "United States",
      "state": "California",
      "city": "Los Angeles"
    },
    "isEmailVerified": false,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 2. Login Auction User

**Endpoint:** `POST /api/auction/login`

**Description:** Login for auction system users.

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
  "message": "Auction user login successful",
  "data": {
    "user": {
      "id": "user_id_here",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "bidder"
    },
    "token": "jwt_token_here"
  }
}
```

## 3. Get Auction Profile

**Endpoint:** `GET /api/auction/profile`

**Description:** Get current user's auction profile.

**Headers:**
```
auth-token: jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Auction profile retrieved successfully",
  "data": {
    "id": "user_id_here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "bidder",
    "location": {
      "country": "United States",
      "state": "California",
      "city": "Los Angeles"
    },
    "totalAuctions": 0,
    "totalBids": 0,
    "totalWon": 0,
    "totalSold": 0,
    "isEmailVerified": false,
    "isActive": true
  }
}
```

## 4. Update Auction Profile

**Endpoint:** `PUT /api/auction/profile`

**Description:** Update current user's auction profile.

**Headers:**
```
auth-token: jwt_token_here
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "location": {
    "country": "United States",
    "state": "California",
    "city": "San Francisco"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Auction profile updated successfully",
  "data": {
    "id": "user_id_here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "bidder",
    "location": {
      "country": "United States",
      "state": "California",
      "city": "San Francisco"
    }
  }
}
```

## User Roles

### Bidder
- Default role for new users
- Can participate in auctions by placing bids
- Can watch auctions
- Can view auction history

### Seller
- Can create and manage auctions
- Can view bid history for their auctions
- Can manage auction settings

### Admin
- Full system access
- Can manage all auctions and users
- Can moderate content

### Moderator
- Can moderate auctions and users
- Can review and approve content

### Guest
- Limited access
- Can view public auctions only

## Testing

Use the provided test file to test the registration API:

```bash
node test-auction-registration.js
```

Make sure the server is running on `http://localhost:3200` before running the tests.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message",
      "value": "invalid_value"
    }
  ]
}
```

## Validation Rules

- **Email**: Must be a valid email format and unique
- **Password**: Minimum 6 characters
- **Phone**: Must match pattern `^[\+]?[1-9][\d]{0,15}$`
- **Date of Birth**: Must be in the past
- **Location Country**: Required for auction participation
- **Role**: Must be one of the valid auction roles

## Next Steps

This registration API provides the foundation for the auction system. Future enhancements will include:

1. Auction creation and management
2. Bidding system
3. Category management
4. Payment integration
5. Notification system
6. Search and filtering
7. User verification system
