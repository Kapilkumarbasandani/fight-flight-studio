const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'fight-flight-studio';

async function boostHeroStats() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Find user by email
    const userEmail = 'kkbasandani74@gmail.com';
    let user = await usersCollection.findOne({ email: userEmail });

    // If user doesn't exist, create them
    if (!user) {
      console.log(`User with email ${userEmail} not found. Creating new user...`);
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      const newUser = {
        email: userEmail,
        password: hashedPassword,
        role: 'user',
        profile: {
          name: 'KK Basandani',
          phone: '',
          gender: 'male'
        },
        credits: {
          balance: 10,
          lifetime: 10
        },
        stats: {
          strength: 0,
          agility: 0,
          endurance: 0,
          flexibility: 0,
          totalClasses: 0
        },
        hero: {
          level: 1,
          levelName: 'Beginner Warrior',
          achievements: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const insertResult = await usersCollection.insertOne(newUser);
      console.log(`✅ User created with ID: ${insertResult.insertedId}`);
      
      user = await usersCollection.findOne({ _id: insertResult.insertedId });
    }

    console.log(`\nFound user: ${user.email}`);
    console.log('Current stats:', user.stats);
    console.log('Current hero:', user.hero);

    // Define all achievement IDs
    const allAchievements = [
      'first-strike',
      'aerial-queen',
      'iron-body',
      'early-bird',
      'sharp-shooter',
      'loyalist'
    ];

    // Update user with boosted hero stats
    const updateResult = await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          'hero.level': 5,
          'hero.levelName': 'Master Warrior',
          'hero.achievements': allAchievements,
          'stats.strength': 42,
          'stats.agility': 38,
          'stats.endurance': 45,
          'stats.flexibility': 40,
          'stats.totalClasses': 50,
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.modifiedCount > 0) {
      console.log('\n✅ Hero stats boosted successfully!');
      console.log('Updated stats:');
      console.log('  Level: 5 (Master Warrior)');
      console.log('  Strength: 42/50');
      console.log('  Agility: 38/50');
      console.log('  Endurance: 45/50');
      console.log('  Flexibility: 40/50');
      console.log('  Total Classes: 50');
      console.log('  Achievements: All unlocked (6/6)');
      console.log('\n🔑 Login with:');
      console.log(`  Email: ${userEmail}`);
      console.log('  Password: password123');
    } else {
      console.log('No changes were made');
    }

    // Verify update
    const updatedUser = await usersCollection.findOne({ _id: user._id });
    console.log('\nVerification - Updated user data:');
    console.log('Stats:', updatedUser.stats);
    console.log('Hero:', updatedUser.hero);

  } catch (error) {
    console.error('Error boosting hero stats:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

boostHeroStats();
