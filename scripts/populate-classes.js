const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'fight-flight-studio';

async function populateClasses() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const classesCollection = db.collection('classes');

    // Clear existing classes
    await classesCollection.deleteMany({});
    console.log('✅ Cleared existing classes');

    // Define weekday classes
    const classes = [
      // MONDAY Classes
      {
        name: 'Morning Muay Thai - All Levels',
        type: 'muay-thai',
        instructor: 'Coach Alex',
        day: 'Monday',
        time: '6:00 AM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Start your week strong with fundamental Muay Thai techniques',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Silks - Beginner',
        type: 'aerial',
        instructor: 'Sarah Chen',
        day: 'Monday',
        time: '10:00 AM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Introduction to aerial silks focusing on basic climbs and wraps',
        level: 'beginner',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Muay Thai Technique - Intermediate',
        type: 'muay-thai',
        instructor: 'Coach Mike',
        day: 'Monday',
        time: '12:00 PM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Refine your combinations and sparring techniques',
        level: 'intermediate',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Evening Muay Thai - Advanced',
        type: 'muay-thai',
        instructor: 'Coach Alex',
        day: 'Monday',
        time: '6:30 PM',
        duration: 90,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Advanced training with sparring and fight conditioning',
        level: 'advanced',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Hoop - All Levels',
        type: 'aerial',
        instructor: 'Emma Davis',
        day: 'Monday',
        time: '7:30 PM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Dynamic movements and poses on the lyra hoop',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // TUESDAY Classes
      {
        name: 'Morning Muay Thai - All Levels',
        type: 'muay-thai',
        instructor: 'Coach Mike',
        day: 'Tuesday',
        time: '6:00 AM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'High-energy morning session to kickstart your day',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Silks - Intermediate',
        type: 'aerial',
        instructor: 'Sarah Chen',
        day: 'Tuesday',
        time: '10:00 AM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Progress to more complex drops and sequences',
        level: 'intermediate',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Basics - Beginner',
        type: 'aerial',
        instructor: 'Emma Davis',
        day: 'Tuesday',
        time: '12:00 PM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Perfect for those new to aerial arts',
        level: 'beginner',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Muay Thai Combinations',
        type: 'muay-thai',
        instructor: 'Coach Alex',
        day: 'Tuesday',
        time: '6:30 PM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Master powerful offensive and defensive combinations',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Flow - Advanced',
        type: 'aerial',
        instructor: 'Sarah Chen',
        day: 'Tuesday',
        time: '7:30 PM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Seamless transitions and choreography on silks',
        level: 'advanced',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // WEDNESDAY Classes
      {
        name: 'Morning Muay Thai - All Levels',
        type: 'muay-thai',
        instructor: 'Coach Alex',
        day: 'Wednesday',
        time: '6:00 AM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Mid-week motivation with Muay Thai fundamentals',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Hoop - Beginner',
        type: 'aerial',
        instructor: 'Emma Davis',
        day: 'Wednesday',
        time: '10:00 AM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Learn the basics of aerial hoop in a supportive environment',
        level: 'beginner',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Muay Thai Power - Intermediate',
        type: 'muay-thai',
        instructor: 'Coach Mike',
        day: 'Wednesday',
        time: '12:00 PM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Build explosive power with bag work and pad drills',
        level: 'intermediate',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Evening Muay Thai - Advanced',
        type: 'muay-thai',
        instructor: 'Coach Alex',
        day: 'Wednesday',
        time: '6:30 PM',
        duration: 90,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Technical sparring and advanced fight strategies',
        level: 'advanced',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Mix - All Levels',
        type: 'aerial',
        instructor: 'Sarah Chen',
        day: 'Wednesday',
        time: '7:30 PM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Explore multiple aerial apparatuses in one session',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // THURSDAY Classes
      {
        name: 'Morning Muay Thai - All Levels',
        type: 'muay-thai',
        instructor: 'Coach Mike',
        day: 'Thursday',
        time: '6:00 AM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Build consistency with your morning training routine',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Silks - Intermediate',
        type: 'aerial',
        instructor: 'Emma Davis',
        day: 'Thursday',
        time: '10:00 AM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Continue your silks journey with new sequences',
        level: 'intermediate',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Fundamentals - Beginner',
        type: 'aerial',
        instructor: 'Sarah Chen',
        day: 'Thursday',
        time: '12:00 PM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Build a strong foundation in aerial movement',
        level: 'beginner',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Muay Thai Fitness',
        type: 'muay-thai',
        instructor: 'Coach Alex',
        day: 'Thursday',
        time: '6:30 PM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'High-intensity conditioning meets striking technique',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Performance - Advanced',
        type: 'aerial',
        instructor: 'Emma Davis',
        day: 'Thursday',
        time: '7:30 PM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Create beautiful sequences with artistic expression',
        level: 'advanced',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // FRIDAY Classes
      {
        name: 'Morning Muay Thai - All Levels',
        type: 'muay-thai',
        instructor: 'Coach Alex',
        day: 'Friday',
        time: '6:00 AM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'End your week strong with explosive training',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Hoop - Beginner',
        type: 'aerial',
        instructor: 'Sarah Chen',
        day: 'Friday',
        time: '10:00 AM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Friday flow with beginner-friendly hoop sequences',
        level: 'beginner',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Muay Thai Elite - Intermediate',
        type: 'muay-thai',
        instructor: 'Coach Mike',
        day: 'Friday',
        time: '12:00 PM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Precision strikes and tactical training',
        level: 'intermediate',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Friday Fight Night - Advanced',
        type: 'muay-thai',
        instructor: 'Coach Alex',
        day: 'Friday',
        time: '6:30 PM',
        duration: 90,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Intense sparring and competition prep',
        level: 'advanced',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Weekend Warm-up - Aerial',
        type: 'aerial',
        instructor: 'Emma Davis',
        day: 'Friday',
        time: '7:30 PM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Celebrate the weekend with creative aerial flow',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // SATURDAY Classes
      {
        name: 'Saturday Warriors - Muay Thai',
        type: 'muay-thai',
        instructor: 'Coach Alex',
        day: 'Saturday',
        time: '9:00 AM',
        duration: 75,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Extended weekend session for all skill levels',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Exploration - Beginner',
        type: 'aerial',
        instructor: 'Sarah Chen',
        day: 'Saturday',
        time: '10:00 AM',
        duration: 75,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Try different apparatus and find your favorite',
        level: 'beginner',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Muay Thai Masterclass',
        type: 'muay-thai',
        instructor: 'Coach Mike',
        day: 'Saturday',
        time: '11:00 AM',
        duration: 75,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Deep dive into technique with one-on-one attention',
        level: 'intermediate',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Choreography - Advanced',
        type: 'aerial',
        instructor: 'Emma Davis',
        day: 'Saturday',
        time: '2:00 PM',
        duration: 90,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Create stunning routines to music',
        level: 'advanced',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // SUNDAY Classes
      {
        name: 'Sunday Recovery - Muay Thai',
        type: 'muay-thai',
        instructor: 'Coach Mike',
        day: 'Sunday',
        time: '10:00 AM',
        duration: 60,
        capacity: 15,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Light technical work and stretching',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aerial Basics - Beginner',
        type: 'aerial',
        instructor: 'Sarah Chen',
        day: 'Sunday',
        time: '11:00 AM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'Gentle introduction to aerial arts',
        level: 'beginner',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sunday Flow - Aerial',
        type: 'aerial',
        instructor: 'Emma Davis',
        day: 'Sunday',
        time: '3:00 PM',
        duration: 60,
        capacity: 10,
        bookedCount: 0,
        creditsRequired: 1,
        description: 'End your week peacefully with flowing movements',
        level: 'all-levels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert all classes
    const result = await classesCollection.insertMany(classes);
    console.log(`✅ Successfully created ${result.insertedCount} classes`);

    // Display summary
    const muayThaiCount = classes.filter(c => c.type === 'muay-thai').length;
    const aerialCount = classes.filter(c => c.type === 'aerial').length;
    
    console.log('\n📊 Classes Summary:');
    console.log(`   Muay Thai Classes: ${muayThaiCount}`);
    console.log(`   Aerial Classes: ${aerialCount}`);
    console.log(`   Total Classes: ${classes.length}`);
    console.log('\n🎉 Classes successfully populated!');

  } catch (error) {
    console.error('❌ Error populating classes:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

populateClasses();
