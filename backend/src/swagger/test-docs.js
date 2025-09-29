#!/usr/bin/env node

/**
 * Test script to verify Swagger documentation is working correctly
 * This script tests the API documentation endpoints and validates the setup
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const DOCS_PATH = '/api-docs';

async function testSwaggerDocumentation() {
  console.log('🧪 Testing Swagger Documentation...\n');

  try {
    // Test 1: Check if Swagger UI is accessible
    console.log('1. Testing Swagger UI accessibility...');
    const swaggerResponse = await axios.get(`${API_BASE_URL}${DOCS_PATH}`, {
      timeout: 5000,
      validateStatus: (status) => status < 500, // Accept redirects
    });
    
    if (swaggerResponse.status === 200 || swaggerResponse.status === 301 || swaggerResponse.status === 302) {
      console.log('✅ Swagger UI is accessible');
    } else {
      console.log('❌ Swagger UI is not accessible');
      return false;
    }

    // Test 2: Check if OpenAPI JSON is available
    console.log('\n2. Testing OpenAPI JSON endpoint...');
    const openApiResponse = await axios.get(`${API_BASE_URL}${DOCS_PATH}-json`, {
      timeout: 5000,
    });
    
    if (openApiResponse.status === 200) {
      console.log('✅ OpenAPI JSON is available');
      
      // Validate OpenAPI structure
      const openApiSpec = openApiResponse.data;
      
      // Check required fields
      const requiredFields = ['openapi', 'info', 'paths', 'components'];
      const missingFields = requiredFields.filter(field => !openApiSpec[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ OpenAPI specification is valid');
      } else {
        console.log(`❌ OpenAPI specification missing fields: ${missingFields.join(', ')}`);
        return false;
      }
      
      // Check for our custom tags
      const expectedTags = [
        'Authentication',
        'Gossip', 
        'Rooms',
        'XP & Levels',
        'Wallet',
        'Polls',
        'Chat History',
        'Rate Limiting',
        'Error Handling',
        'Token Gifts'
      ];
      
      const availableTags = openApiSpec.tags?.map(tag => tag.name) || [];
      const foundTags = expectedTags.filter(tag => availableTags.includes(tag));
      
      console.log(`✅ Found ${foundTags.length}/${expectedTags.length} expected tags: ${foundTags.join(', ')}`);
      
      // Check for key endpoints
      const expectedEndpoints = [
        '/auth/register',
        '/auth/login',
        '/rooms/create',
        '/xp/add',
        '/wallet/balance/{userId}',
        '/polls',
        '/chat-history/history'
      ];
      
      const availablePaths = Object.keys(openApiSpec.paths || {});
      const foundEndpoints = expectedEndpoints.filter(endpoint => 
        availablePaths.some(path => path.includes(endpoint.replace('{userId}', '')))
      );
      
      console.log(`✅ Found ${foundEndpoints.length}/${expectedEndpoints.length} expected endpoints: ${foundEndpoints.join(', ')}`);
      
      // Check for authentication setup
      if (openApiSpec.components?.securitySchemes?.JWT) {
        console.log('✅ JWT authentication is configured');
      } else {
        console.log('❌ JWT authentication is not configured');
        return false;
      }
      
      // Check for examples in responses
      const pathsWithExamples = Object.values(openApiSpec.paths || {})
        .flatMap(path => Object.values(path))
        .filter(operation => 
          operation.responses && 
          Object.values(operation.responses).some(response => 
            response.content && 
            Object.values(response.content).some(content => content.example)
          )
        );
      
      console.log(`✅ Found ${pathsWithExamples.length} endpoints with response examples`);
      
    } else {
      console.log('❌ OpenAPI JSON is not available');
      return false;
    }

    // Test 3: Test authentication endpoints
    console.log('\n3. Testing authentication endpoints...');
    
    // Test register endpoint
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123'
      }, {
        timeout: 5000,
        validateStatus: () => true, // Accept any status
      });
      
      if (registerResponse.status === 201 || registerResponse.status === 409) {
        console.log('✅ Register endpoint is working');
      } else {
        console.log(`⚠️  Register endpoint returned status ${registerResponse.status}`);
      }
    } catch (error) {
      console.log('⚠️  Register endpoint test failed:', error.message);
    }

    // Test 4: Test rate limiting
    console.log('\n4. Testing rate limiting...');
    
    try {
      const rateLimitResponse = await axios.get(`${API_BASE_URL}/rate-limit/stats`, {
        timeout: 5000,
        validateStatus: () => true, // Accept any status
      });
      
      if (rateLimitResponse.status === 200 || rateLimitResponse.status === 401) {
        console.log('✅ Rate limiting endpoint is working');
      } else {
        console.log(`⚠️  Rate limiting endpoint returned status ${rateLimitResponse.status}`);
      }
    } catch (error) {
      console.log('⚠️  Rate limiting endpoint test failed:', error.message);
    }

    // Test 5: Test health endpoint
    console.log('\n5. Testing health endpoint...');
    
    try {
      const healthResponse = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000,
        validateStatus: () => true, // Accept any status
      });
      
      if (healthResponse.status === 200) {
        console.log('✅ Health endpoint is working');
      } else {
        console.log(`⚠️  Health endpoint returned status ${healthResponse.status}`);
      }
    } catch (error) {
      console.log('⚠️  Health endpoint test failed:', error.message);
    }

    console.log('\n🎉 Swagger documentation test completed successfully!');
    console.log('\n📚 Access your API documentation at:');
    console.log(`   ${API_BASE_URL}${DOCS_PATH}`);
    console.log('\n📖 OpenAPI JSON available at:');
    console.log(`   ${API_BASE_URL}${DOCS_PATH}-json`);
    
    return true;

  } catch (error) {
    console.error('❌ Swagger documentation test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:');
      console.log('   npm run start:dev');
    }
    
    return false;
  }
}

// Run the test
if (require.main === module) {
  testSwaggerDocumentation()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test failed with error:', error);
      process.exit(1);
    });
}

module.exports = { testSwaggerDocumentation };
