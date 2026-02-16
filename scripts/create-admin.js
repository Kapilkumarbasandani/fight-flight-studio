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
    const existingAdmin = await usersCollection.findOne({ email: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Qwerty@123', 10);

    // Create admin user
    const adminUser = {
      name: 'Administrator',
      email: 'admin',
      whatsapp: '+1234567890',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      profile: {
        address: '',
        birthday: ''
      },
      membership: {
        type: 'unlimited',
        startDate: new Date(),
        creditsRemaining: 999
      }
    };

    const result = await usersCollection.insertOne(adminUser);
    
    console.log('✓ Admin user created successfully!');
    console.log('Email: admin');
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
