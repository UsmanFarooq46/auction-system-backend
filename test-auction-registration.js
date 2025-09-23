const axios = require('axios');

const BASE_URL = 'http://localhost:3200/api';

// Test auction user registration
async function testAuctionRegistration() {
  try {
    console.log('Testing Auction User Registration...\n');

    // Test data for auction user registration
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      role: 'bidder', // or 'seller'
      location: {
        country: 'United States',
        state: 'California',
        city: 'Los Angeles'
      },
      currency: 'USD',
      language: 'en',
      timezone: 'America/Los_Angeles'
    };

    // Register auction user
    const response = await axios.post(`${BASE_URL}/auction/register`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration Successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    // Test login
    console.log('\n--- Testing Login ---');
    const loginData = {
      email: userData.email,
      password: userData.password
    };

    const loginResponse = await axios.post(`${BASE_URL}/auction/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login Successful!');
    console.log('Status:', loginResponse.status);
    console.log('Auth Token:', loginResponse.headers['auth-token']);
    console.log('User Data:', JSON.stringify(loginResponse.data.data.user, null, 2));

    // Test profile retrieval
    console.log('\n--- Testing Profile Retrieval ---');
    const profileResponse = await axios.get(`${BASE_URL}/auction/profile`, {
      headers: {
        'auth-token': loginResponse.headers['auth-token']
      }
    });

    console.log('✅ Profile Retrieved!');
    console.log('Status:', profileResponse.status);
    console.log('Profile:', JSON.stringify(profileResponse.data.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.log('Validation Errors:', error.response.data.errors);
    }
  }
}

// Test different user roles
async function testDifferentRoles() {
  console.log('\n=== Testing Different User Roles ===\n');

  const roles = ['bidder', 'seller'];
  
  for (const role of roles) {
    try {
      console.log(`Testing ${role} registration...`);
      
      const userData = {
        firstName: `Test${role.charAt(0).toUpperCase() + role.slice(1)}`,
        lastName: 'User',
        email: `test.${role}@example.com`,
        password: 'password123',
        role: role,
        location: {
          country: 'United States',
          state: 'New York',
          city: 'New York'
        }
      };

      const response = await axios.post(`${BASE_URL}/auction/register`, userData);
      console.log(`✅ ${role} registration successful!`);
      console.log(`User ID: ${response.data.data.id}`);
      console.log(`Role: ${response.data.data.role}\n`);

    } catch (error) {
      console.error(`❌ ${role} registration failed:`, error.response?.data?.message || error.message);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Auction Registration API Tests\n');
  console.log('Make sure the server is running on http://localhost:3200\n');
  
  await testAuctionRegistration();
  await testDifferentRoles();
  
  console.log('\n🏁 Tests completed!');
}

runTests();
