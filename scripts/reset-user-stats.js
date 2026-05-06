const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function resetUserStats() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('fight-flight-studio');

    // Reset all users' stats to 0 and remove dummy data
    const result = await db.collection('users').updateMany(
      {},
      {
        $set: {
          'stats.totalClasses': 0,
          'stats.muayThaiClasses': 0,
          'stats.aerialClasses': 0,
          'stats.strength': 0,
          'stats.agility': 0,
          'stats.endurance': 0,
          'stats.flexibility': 0,
          'hero.level': 1,
          'hero.levelName': 'Beginner Warrior',
          'hero.achievements': []
        }
      }
    );

    console.log('🔄 Reset stats for', result.modifiedCount, 'users');
    console.log('\n✅ All users now have clean stats (starting from 0)');
    console.log('Stats will increment as users:');
    console.log('  - Book and attend classes');
    console.log('  - Complete workouts');
    console.log('  - Achieve milestones\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

resetUserStats();
