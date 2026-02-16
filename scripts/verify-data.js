const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function verifyData() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('fight-flight-studio');

    // Check classes
    const classes = await db.collection('classes').find({}).toArray();
    console.log('📝 CLASSES:', classes.length);
    
    if (classes.length > 0) {
      classes.forEach((cls, index) => {
        console.log(`  ${index + 1}. ${cls.name} - ${cls.day} at ${cls.time} (${cls.type})`);
        console.log(`      Capacity: ${cls.bookedCount || 0}/${cls.capacity}, Instructor: ${cls.instructor}`);
      });
    } else {
      console.log('  ⚠️ No classes found. Create one from: http://localhost:3001/admin/classes\n');
    }

    // Check users
    const users = await db.collection('users').find({}).toArray();
    console.log('\n👥 USERS:', users.length);
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email})`);
      console.log(`      Credits: ${user.credits?.balance || 0}, Role: ${user.role || 'user'}`);
    });

    // Check bookings
    const bookings = await db.collection('bookings').find({}).toArray();
    console.log('\n📅 BOOKINGS:', bookings.length);

    // Check forms
    const formSubmissions = await db.collection('form_submissions').find({}).toArray();
    console.log('📋 FORM SUBMISSIONS:', formSubmissions.length);

    // Check credit transactions
    const creditTransactions = await db.collection('credittransactions').find({}).toArray();
    console.log('💳 CREDIT TRANSACTIONS:', creditTransactions.length);

    console.log('\n✅ Database verification complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

verifyData();
