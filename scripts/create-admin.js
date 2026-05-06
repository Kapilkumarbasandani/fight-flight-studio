const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/fight-flight-studio';

async function createAdminUser() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('fight-flight-studio');
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ 
      $or: [
        { email: 'admin@fightflight.com' },
        { role: 'admin' }
      ]
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      
      // Update password if needed
      const hashedPassword = await bcrypt.hash('Qwerty@123', 10);
      await usersCollection.updateOne(
        { _id: existingAdmin._id },
        { 
          $set: { 
            password: hashedPassword,
            updatedAt: new Date()
          } 
        }
      );
      console.log('✓ Password updated to: Qwerty@123');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Qwerty@123', 10);

    // Create admin user
    const adminUser = {
      name: 'Administrator',
      email: 'admin@fightflight.com',
      whatsapp: '+1234567890',
      password: hashedPassword,
      role: 'admin',
      profile: {
        address: 'Bangalore, India',
        birthday: '1990-01-01',
        gender: 'male'
      },
      credits: {
        balance: 999,
        expiringCredits: []
      },
      stats: {
        totalClasses: 100,
        muayThaiClasses: 50,
        aerialClasses: 50,
        strength: 50,
        agility: 50,
        endurance: 50,
        flexibility: 50
      },
      hero: {
        level: 10,
        levelName: 'Supreme Master',
        achievements: [
          'first-strike',
          'aerial-queen',
          'iron-body',
          'early-bird',
          'sharp-shooter',
          'loyalist'
        ]
      },
      formsCompleted: [],
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(adminUser);
    
    console.log('✓ Admin user created successfully!');
    console.log('Email: admin@fightflight.com');
    console.log('Password: Qwerty@123');
    console.log('User ID:', result.insertedId);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

createAdminUser();
