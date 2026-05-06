const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/fight-flight-studio';

async function checkDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('fight-flight-studio');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections in database:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log('');

    // Check users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log(`👥 Users collection: ${usersCount} user(s)`);
    
    if (usersCount > 0) {
      const users = await db.collection('users').find({}).toArray();
      console.log('\n📋 Users in database:');
      users.forEach(user => {
        console.log(`   - Name: ${user.name || 'N/A'}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Role: ${user.role || 'user'}`);
        console.log(`     Credits: ${user.credits?.balance || 0}`);
        console.log('');
      });
    }

    // Check other collections
    const classesCount = await db.collection('classes').countDocuments();
    console.log(`📚 Classes collection: ${classesCount} class(es)`);
    
    const bookingsCount = await db.collection('bookings').countDocuments();
    console.log(`📅 Bookings collection: ${bookingsCount} booking(s)`);
    
    const activitiesCount = await db.collection('activities').countDocuments();
    console.log(`📊 Activities collection: ${activitiesCount} activity(ies)`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

checkDatabase();
