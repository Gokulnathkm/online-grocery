// Simple test script to verify API endpoints
const API = 'http://localhost:5050/api';

async function testAPI() {
  console.log('Testing API endpoints...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthRes = await fetch(`${API}/health`);
    const healthData = await healthRes.json();
    console.log('Health check:', healthData);
    console.log('');
    
    // Test products endpoint
    console.log('2. Testing products endpoint...');
    const productsRes = await fetch(`${API}/products`);
    const productsData = await productsRes.json();
    console.log('Products count:', productsData.length);
    console.log('First product:', productsData[0] || 'No products found');
    console.log('');
    
    // Test creating a product (without auth - should fail)
    console.log('3. Testing product creation without auth...');
    const createRes = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Product',
        price: 100,
        stock: 50,
        image: 'https://example.com/test.jpg'
      })
    });
    console.log('Create product status:', createRes.status);
    const createData = await createRes.json();
    console.log('Create product response:', createData);
    console.log('');
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
testAPI();
