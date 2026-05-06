const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/fight-flight-studio';

async function createRegularUser() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('fight-flight-studio');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ 
      email: 'user@test.com'
    });
    
    if (existingUser) {
      console.log('Regular user already exists!');
      console.log('Email:', existingUser.email);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Test@123', 10);

    // Create regular user
    const regularUser = {
      name: 'Test User',
      email: 'user@test.com',
      whatsapp: '+9876543210',
      password: hashedPassword,
      role: 'user',
      profile: {
        address: 'Bangalore, India',
        birthday: '1995-06-15',
        gender: 'female'
      },
      credits: {
        balance: 10,
        expiringCredits: []
      },
      stats: {
        totalClasses: 0,
        muayThaiClasses: 0,
        aerialClasses: 0,
        strength: 0,
        agility: 0,
        endurance: 0,
        flexibility: 0
      },
      hero: {
        level: 1,
        levelName: 'Beginner Warrior',
        achievements: []
      },
      formsCompleted: [],
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(regularUser);
    
    console.log('✓ Regular user created successfully!');
    console.log('Email: user@test.com');
    console.log('Password: Test@123');
    console.log('Role: user');
    console.log('User ID:', result.insertedId);

  } catch (error) {
    console.error('Error creating regular user:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

createRegularUser();
