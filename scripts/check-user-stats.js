const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function checkUserStats() {
  try {
    await client.connect();
    const db = client.db('fight-flight-studio');

    // Find the user
    const user = await db.collection('users').findOne({ email: 'kkbasandani74@gmail.com' });
    
    if (user) {
      console.log('\n👤 User:', user.name);
      console.log('\n📊 Stats:', user.stats);
      console.log('\n🦸 Hero:', user.hero);
      console.log('\n💳 Credits:', user.credits);
    } else {
      console.log('User not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkUserStats();
