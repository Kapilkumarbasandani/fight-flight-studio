const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function fixClassTimes() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('fight-flight-studio');

    // Convert 24-hour time to 12-hour format with AM/PM
    const convert24To12Hour = (time24) => {
      // Check if already in 12-hour format
      if (time24.includes('AM') || time24.includes('PM')) {
        return time24;
      }

      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${hour12}:${minutes} ${period}`;
    };

    const classes = await db.collection('classes').find({}).toArray();
    console.log('📝 Found', classes.length, 'classes\n');

    for (const cls of classes) {
      const originalTime = cls.time;
      const convertedTime = convert24To12Hour(cls.time);

      if (originalTime !== convertedTime) {
        await db.collection('classes').updateOne(
          { _id: cls._id },
          { $set: { time: convertedTime } }
        );
        console.log(`✅ Updated: ${cls.name}`);
        console.log(`   ${originalTime} → ${convertedTime}\n`);
      } else {
        console.log(`✓ Already correct: ${cls.name} at ${originalTime}\n`);
      }
    }

    console.log('✨ Time format update complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixClassTimes();
