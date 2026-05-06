const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function checkAllUsers() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('fight-flight-studio');
    const users = await db.collection('users').find({}).toArray();
    
    console.log(`📋 Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Stats:`, user.stats || 'No stats');
      console.log(`   Hero:`, user.hero || 'No hero data');
      console.log(`   Credits: ${user.credits?.balance || 0}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkAllUsers();
