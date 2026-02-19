const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function findAdmin() {
  try {
    await client.connect();
    const db = client.db('fight-flight-studio');
    
    // Search for admin user
    const adminUser = await db.collection('users').findOne({ 
      $or: [
        { email: 'admin' },
        { email: 'Admin' },
        { role: 'admin' }
      ]
    });
    
    console.log('Admin user found:', adminUser ? 'Yes' : 'No');
    if (adminUser) {
      console.log(JSON.stringify(adminUser, null, 2));
    } else {
      console.log('\nNo admin user found. Listing all users:');
      const users = await db.collection('users').find({}).toArray();
      users.forEach(user => {
        console.log(`- ${user.email} (${user.role || 'user'})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

findAdmin();
