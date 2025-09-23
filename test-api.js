const axios = require('axios');

const BASE_URL = 'http://localhost:3200/api/auth';

// Test data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'password123',
  phone: '+1234567890',
  gender: 'male'
};

async function testAPI() {
  try {
    console.log('🚀 Testing E-commerce User Registration API\n');

    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('User ID:', registerResponse.data.data._id);
    console.log('');

    // Test 2: User Login
    console.log('2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    const token = loginResponse.data.token;
    console.log('Token received:', token.substring(0, 20) + '...');
    console.log('');

    // Test 3: Get User Profile
    console.log('3. Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: { 'auth-token': token }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('User:', profileResponse.data.data.firstName, profileResponse.data.data.lastName);
    console.log('');

    // Test 4: Update User Profile
    console.log('4. Testing Update User Profile...');
    const updateResponse = await axios.put(`${BASE_URL}/profile`, {
      firstName: 'Updated',
      lastName: 'Name',
      phone: '+9876543210'
    }, {
      headers: { 'auth-token': token }
    });
    console.log('✅ Profile updated successfully:', updateResponse.data.message);
    console.log('');

    // Test 5: Get All Users (Admin function)
    console.log('5. Testing Get All Users...');
    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: { 'auth-token': token }
    });
    console.log('✅ Users retrieved successfully');
    console.log('Total users:', usersResponse.data.count);
    console.log('');

    console.log('🎉 All tests passed successfully!');
    console.log('\n📝 API Endpoints tested:');
    console.log('- POST /register');
    console.log('- POST /login');
    console.log('- GET /profile');
    console.log('- PUT /profile');
    console.log('- GET /users');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAPI();
