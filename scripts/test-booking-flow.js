const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function testBookingFlow() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('fight-flight-studio');

    // Get test user
    const user = await db.collection('users').findOne({ email: 'kkbasandani74@gmail.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 User:', user.name);
    console.log('💳 Credits:', user.credits?.balance || 0);

    // Get available classes
    const classes = await db.collection('classes').find({ active: true }).toArray();
    console.log('\n📝 Available Classes:', classes.length);
    
    if (classes.length > 0) {
      const testClass = classes[0];
      console.log('\n🎯 Test Class:');
      console.log('   Name:', testClass.name);
      console.log('   Day:', testClass.day);
      console.log('   Time:', testClass.time);
      console.log('   Instructor:', testClass.instructor);

      // Calculate next occurrence date
      const getNextClassDate = (dayName, time) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const targetDayIndex = daysOfWeek.indexOf(dayName);
        const now = new Date();
        const currentDayIndex = now.getDay();
        
        let daysUntil = targetDayIndex - currentDayIndex;
        
        if (daysUntil === 0) {
          const [timeStr, period] = time.split(' ');
          const [hours, minutes] = timeStr.split(':').map(Number);
          let classHour = hours;
          
          if (period === 'PM' && hours !== 12) {
            classHour += 12;
          } else if (period === 'AM' && hours === 12) {
            classHour = 0;
          }
          
          const classTime = new Date(now);
          classTime.setHours(classHour, minutes, 0, 0);
          
          if (now > classTime) {
            daysUntil = 7;
          }
        } else if (daysUntil < 0) {
          daysUntil += 7;
        }
        
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + daysUntil);
        
        return nextDate.toISOString().split('T')[0];
      };

      const nextDate = getNextClassDate(testClass.day, testClass.time);
      console.log('\n📅 Next Occurrence Date:', nextDate);

      // Check existing bookings
      const existingBookings = await db.collection('bookings').find({ userId: user._id.toString() }).toArray();
      console.log('\n📚 Existing Bookings:', existingBookings.length);
      
      existingBookings.forEach((booking, index) => {
        console.log(`\n${index + 1}. ${booking.className}`);
        console.log(`   Date: ${booking.date}`);
        console.log(`   Time: ${booking.time}`);
        console.log(`   Status: ${booking.status}`);
        
        // Check if it would appear in upcoming
        const bookingDate = new Date(booking.date);
        const now = new Date();
        const [timeStr, period] = booking.time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        let classHour = hours;
        
        if (period === 'PM' && hours !== 12) {
          classHour += 12;
        } else if (period === 'AM' && hours === 12) {
          classHour = 0;
        }
        
        bookingDate.setHours(classHour, minutes, 0, 0);
        
        const isPast = now > bookingDate;
        const showInUpcoming = !isPast && booking.status !== 'cancelled';
        
        console.log(`   📌 Show in Upcoming: ${showInUpcoming ? '✅ YES' : '❌ NO'}`);
        console.log(`   📌 Show in History: ${isPast || booking.status === 'cancelled' ? '✅ YES' : '❌ NO'}`);
      });
      
      console.log('\n✨ Booking Flow Test Complete!');
      console.log('\nTo test:');
      console.log('1. Go to http://localhost:3001/app/schedule');
      console.log('2. Book the class:', testClass.name);
      console.log('3. Check http://localhost:3001/app/bookings (Upcoming tab)');
      console.log('4. The booking should appear there with date:', nextDate);
    } else {
      console.log('⚠️ No classes available. Create one from admin panel first.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testBookingFlow();
