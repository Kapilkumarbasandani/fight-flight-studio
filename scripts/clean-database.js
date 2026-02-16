const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function cleanDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('fight-flight-studio');

    // Remove all dummy/test data from users
    const usersCollection = db.collection('users');
    
    // Remove specific test fields or reset credits/data
    const updateResult = await usersCollection.updateMany(
      {},
      {
        $unset: {
          // Remove any test fields
          testField: "",
          dummyData: ""
        }
      }
    );

    console.log('🧹 Cleaned user dummy fields:', updateResult.modifiedCount);

    // Clear all classes (so we can start fresh)
    const classesResult = await db.collection('classes').deleteMany({});
    console.log('🗑️ Deleted classes:', classesResult.deletedCount);

    // Clear all bookings
    const bookingsResult = await db.collection('bookings').deleteMany({});
    console.log('🗑️ Deleted bookings:', bookingsResult.deletedCount);

    // Clear all credit transactions
    const creditsResult = await db.collection('credittransactions').deleteMany({});
    console.log('🗑️ Deleted credit transactions:', creditsResult.deletedCount);

    // Clear all form submissions
    const formsResult = await db.collection('formsubmissions').deleteMany({});
    console.log('🗑️ Deleted form submissions:', formsResult.deletedCount);

    console.log('✨ Database cleaned successfully!');
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await client.close();
  }
}

cleanDatabase();
