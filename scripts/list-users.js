const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'fight-flight-studio';

async function listUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Get all users
    const users = await usersCollection.find({}).toArray();

    console.log(`\nFound ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.profile?.name || 'N/A'}`);
      console.log(`   Role: ${user.role || 'user'}`);
      console.log(`   Credits: ${user.credits?.balance || 0}`);
      console.log(`   Level: ${user.hero?.level || 1}`);
      console.log(`   Achievements: ${user.hero?.achievements?.length || 0}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await client.close();
  }
}

listUsers();
