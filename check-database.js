const { MongoClient } = require('mongodb');

async function checkDatabase() {
  const uri = 'mongodb://localhost:27017/fight-flight-studio';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('fight-flight-studio');
    const classes = await db.collection('classes').find({}).toArray();
    
    console.log(`\n📊 Total classes in database: ${classes.length}`);
    
    if (classes.length === 0) {
      console.log('\n⚠️  NO CLASSES FOUND!');
      console.log('Action required: Create a class from admin panel');
    } else {
      console.log('\n=== ALL CLASSES ===\n');
      classes.forEach((cls, i) => {
        console.log(`Class ${i + 1}:`);
        console.log(`  _id: ${cls._id}`);
        console.log(`  Name: ${cls.name || 'N/A'}`);
        console.log(`  Day: ${cls.day || 'N/A'}`);
        console.log(`  Time: ${cls.time || 'N/A'}`);
        console.log(`  Type: ${cls.type || 'N/A'}`);
        console.log(`  Instructor: ${cls.instructor || 'N/A'}`);
        console.log(`  Active: ${cls.active}`);
        console.log(`  Capacity: ${cls.capacity || 'N/A'}`);
        console.log(`  Booked Count: ${cls.bookedCount || 0}`);
        console.log('');
      });
      
      const activeClasses = classes.filter(c => c.active === true);
      const inactiveClasses = classes.filter(c => c.active !== true);
      
      console.log(`✅ Active classes: ${activeClasses.length}`);
      console.log(`❌ Inactive classes: ${inactiveClasses.length}`);
      
      if (activeClasses.length === 0) {
        console.log('\n⚠️  WARNING: No ACTIVE classes!');
        console.log('All classes have active: false or missing active field');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkDatabase();
