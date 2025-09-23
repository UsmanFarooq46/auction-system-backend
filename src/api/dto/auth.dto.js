/**
 * Data Transfer Objects for Authentication
 */

class UserRegistrationDTO {
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email?.toLowerCase();
    this.password = data.password;
    this.phone = data.phone;
    this.dateOfBirth = data.dateOfBirth;
    this.gender = data.gender;
    this.role = data.role || 'customer';
    this.currency = data.currency;
    this.language = data.language;
    this.timezone = data.timezone;
  }

  // Remove sensitive data before sending to client
  toSafeObject() {
    const { password, ...safeData } = this;
    return safeData;
  }
}

class UserLoginDTO {
  constructor(data) {
    this.email = data.email?.toLowerCase();
    this.password = data.password;
  }
}

class UserResponseDTO {
  constructor(user) {
    this.id = user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
    this.dateOfBirth = user.dateOfBirth;
    this.gender = user.gender;
    this.role = user.role;
    this.isEmailVerified = user.isEmailVerified;
    this.isPhoneVerified = user.isPhoneVerified;
    this.isActive = user.isActive;
    this.profileImage = user.profileImage;
    this.totalOrders = user.totalOrders;
    this.totalSpent = user.totalSpent;
    this.lastOrderDate = user.lastOrderDate;
    this.referralCode = user.referralCode;
    this.loyaltyPoints = user.loyaltyPoints;
    this.lastLogin = user.lastLogin;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

class AuthResponseDTO {
  constructor(user, token) {
    this.user = new UserResponseDTO(user);
    this.token = token;
  }
}

module.exports = {
  UserRegistrationDTO,
  UserLoginDTO,
  UserResponseDTO,
  AuthResponseDTO
};
