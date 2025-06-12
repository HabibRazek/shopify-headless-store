// Simple test script to verify authentication endpoints
const baseUrl = 'http://localhost:3000';

async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Check auth status endpoint
    console.log('1. Testing /api/auth/status endpoint...');
    const statusResponse = await fetch(`${baseUrl}/api/auth/status`);
    const statusData = await statusResponse.json();
    
    console.log('Status Response:', {
      status: statusResponse.status,
      authenticated: statusData.authenticated,
      hasSession: !!statusData.session,
      environment: statusData.debug?.environment
    });

    // Test 2: Check if profile page redirects properly
    console.log('\n2. Testing /profile page redirect...');
    const profileResponse = await fetch(`${baseUrl}/profile`, {
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    console.log('Profile Response:', {
      status: profileResponse.status,
      location: profileResponse.headers.get('location'),
      redirected: profileResponse.status >= 300 && profileResponse.status < 400
    });

    // Test 3: Check NextAuth session endpoint
    console.log('\n3. Testing NextAuth session endpoint...');
    const sessionResponse = await fetch(`${baseUrl}/api/auth/session`);
    const sessionData = await sessionResponse.json();
    
    console.log('Session Response:', {
      status: sessionResponse.status,
      hasUser: !!sessionData.user,
      user: sessionData.user || 'No user'
    });

    console.log('\n✅ Authentication tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testAuthEndpoints();
