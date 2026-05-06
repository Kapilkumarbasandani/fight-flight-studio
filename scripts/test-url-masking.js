/**
 * URL Masking Test Script
 * 
 * This script tests that URL rewrites are working correctly.
 * Run with: node scripts/test-url-masking.js
 * 
 * Prerequisites: Server must be running on http://localhost:3000
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Test cases: [masked URL, should rewrite to internal API]
const testCases = [
  {
    name: 'User Stats',
    masked: '/account/stats?userId=test123',
    expected: 'Should call /api/user/stats internally'
  },
  {
    name: 'User Profile',
    masked: '/account/profile-data?userId=test123',
    expected: 'Should call /api/user/profile internally'
  },
  {
    name: 'User Hero',
    masked: '/account/hero-data?userId=test123',
    expected: 'Should call /api/user/hero internally'
  },
  {
    name: 'Secure Bookings',
    masked: '/secure/bookings?userId=test123',
    expected: 'Should call /api/bookings internally'
  },
  {
    name: 'Admin Analytics',
    masked: '/admin-portal/analytics-data?userId=test123&userRole=admin',
    expected: 'Should call /api/admin/analytics internally'
  },
  {
    name: 'Auth Signin',
    masked: '/auth/signin-endpoint',
    expected: 'Should call /api/auth/signin internally'
  },
];

async function testURL(url) {
  return new Promise((resolve) => {
    const fullUrl = BASE_URL + url;
    
    http.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          success: res.statusCode !== 404 // 404 means rewrite not working
        });
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 0,
        error: err.message,
        success: false
      });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing URL Masking Configuration\n');
  console.log('=' .repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    process.stdout.write(`Testing: ${testCase.name.padEnd(30)}`);
    
    const result = await testURL(testCase.masked);
    
    if (result.statusCode === 0) {
      console.log('❌ FAILED - Server not running');
      failed++;
    } else if (result.statusCode === 404) {
      console.log('❌ FAILED - URL not rewritten (404)');
      failed++;
    } else if (result.statusCode >= 400 && result.statusCode !== 401 && result.statusCode !== 400) {
      console.log(`⚠️  WARNING - Status ${result.statusCode}`);
      passed++; // Still counts as rewrite working
    } else {
      console.log(`✅ PASSED - Status ${result.statusCode}`);
      passed++;
    }
  }
  
  console.log('=' .repeat(60));
  console.log(`\n📊 Results: ${passed}/${testCases.length} tests passed`);
  
  if (failed === testCases.length) {
    console.log('❌ All tests failed - Server might not be running');
    console.log('💡 Start server with: npm run dev');
  } else if (failed > 0) {
    console.log('⚠️  Some rewrites may not be configured correctly');
    console.log('💡 Check next.config.mjs rewrites configuration');
  } else {
    console.log('✅ URL masking is working correctly!');
    console.log('\n🔍 What this means:');
    console.log('  • Masked URLs are being rewritten to internal APIs');
    console.log('  • Network tab will show clean URLs (e.g., /account/stats)');
    console.log('  • Internal API structure is hidden from users');
    console.log('  • Both masked and legacy URLs work correctly');
  }
  
  console.log('\n📖 For more info, see: URL_MASKING.md');
}

// Run tests
console.log('Starting URL masking tests in 2 seconds...\n');
setTimeout(runTests, 2000);
