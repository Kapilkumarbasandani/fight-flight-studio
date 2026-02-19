const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017';
const dbName = 'fight-flight-studio';

async function createTestUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Check if users already exist
    const existingUsers = await usersCollection.countDocuments({ role: { $ne: 'admin' } });
    
    if (existingUsers > 0) {
      console.log(`✅ ${existingUsers} user(s) already exist in the database`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test users
    const users = [
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        whatsapp: '+1234567890',
        password: hashedPassword,
        role: 'user',
        credits: {
          balance: 8,
          expiringCredits: [
            {
              amount: 8,
              expiryDate: new Date('2026-05-15')
            }
          ]
        },
        stats: {
          totalClasses: 15,
          muayThaiClasses: 10,
          aerialClasses: 5,
          strength: 25,
          agility: 30,
          endurance: 20,
          flexibility: 28
        },
        hero: {
          level: 15,
          levelName: 'Warrior',
          achievements: ['first-strike', 'early-bird']
        },
        formsCompleted: ['waiver', 'health', 'emergency'],
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date()
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        whatsapp: '+1234567891',
        password: hashedPassword,
        role: 'user',
        credits: {
          balance: 3,
          expiringCredits: [
            {
              amount: 3,
              expiryDate: new Date('2026-04-20')
            }
          ]
        },
        stats: {
          totalClasses: 5,
          muayThaiClasses: 3,
          aerialClasses: 2,
          strength: 15,
          agility: 18,
          endurance: 12,
          flexibility: 10
        },
        hero: {
          level: 5,
          levelName: 'Trainee',
          achievements: ['first-strike']
        },
        formsCompleted: ['waiver', 'health', 'emergency'],
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date()
      },
      {
        name: 'Emma Davis',
        email: 'emma@example.com',
        whatsapp: '+1234567892',
        password: hashedPassword,
        role: 'user',
        credits: {
          balance: 15,
          expiringCredits: [
            {
              amount: 15,
              expiryDate: new Date('2026-06-30')
            }
          ]
        },
        stats: {
          totalClasses: 50,
          muayThaiClasses: 25,
          aerialClasses: 25,
          strength: 40,
          agility: 45,
          endurance: 38,
          flexibility: 42
        },
        hero: {
          level: 30,
          levelName: 'Immortal Warrior',
          achievements: ['first-strike', 'aerial-queen', 'early-bird', 'centurion']
        },
        formsCompleted: ['waiver', 'health', 'emergency'],
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date()
      },
      {
        name: 'James Wilson',
        email: 'james@example.com',
        whatsapp: '+1234567893',
        password: hashedPassword,
        role: 'user',
        credits: {
          balance: 0,
          expiringCredits: []
        },
        stats: {
          totalClasses: 2,
          muayThaiClasses: 1,
          aerialClasses: 1,
          strength: 8,
          agility: 10,
          endurance: 5,
          flexibility: 6
        },
        hero: {
          level: 2,
          levelName: 'Sidekick',
          achievements: []
        },
        formsCompleted: ['waiver', 'health', 'emergency'],
        createdAt: new Date('2026-02-10'),
        updatedAt: new Date()
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
        whatsapp: '+1234567894',
        password: hashedPassword,
        role: 'user',
        credits: {
          balance: 12,
          expiringCredits: [
            {
              amount: 12,
              expiryDate: new Date('2026-05-01')
            }
          ]
        },
        stats: {
          totalClasses: 30,
          muayThaiClasses: 18,
          aerialClasses: 12,
          strength: 32,
          agility: 35,
          endurance: 28,
          flexibility: 30
        },
        hero: {
          level: 20,
          levelName: 'Superhero',
          achievements: ['first-strike', 'early-bird', 'aerial-queen']
        },
        formsCompleted: ['waiver', 'health', 'emergency'],
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date()
      }
    ];

    // Insert users
    const result = await usersCollection.insertMany(users);
    console.log(`✅ Successfully created ${result.insertedCount} test users`);

    console.log('\n📝 Test Users Created:');
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.credits.balance} credits`);
    });

    console.log('\n🔑 All users have password: password123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

createTestUsers();
