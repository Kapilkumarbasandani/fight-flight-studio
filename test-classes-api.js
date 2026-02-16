// Quick test script to check classes API
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Fetching classes from API...');
    const response = await fetch('http://localhost:3000/api/classes');
    const data = await response.json();
    
    console.log('\n=== API RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Classes found:', data.length);
    console.log('\n=== CLASSES DATA ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.length === 0) {
      console.log('\n⚠️ WARNING: No classes found in database!');
      console.log('Please create a class from admin panel first.');
    } else {
      console.log('\n✅ Classes are in database. Check if they have active: true');
      data.forEach((cls, i) => {
        console.log(`\nClass ${i + 1}:`);
        console.log(`  Name: ${cls.name}`);
        console.log(`  Day: ${cls.day}`);
        console.log(`  Active: ${cls.active}`);
        console.log(`  Type: ${cls.type}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
