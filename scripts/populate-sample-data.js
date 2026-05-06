const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'fight-flight-studio';

async function populateSampleData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Get a regular user (not admin)
    const users = await db.collection('users').find({ role: { $ne: 'admin' } }).toArray();
    
    if (users.length === 0) {
      console.log('No regular users found. Please create a user account first by signing up.');
      return;
    }

    const user = users[0];
    const userId = user._id.toString();
    console.log(`Adding sample data for user: ${user.name} (${user.email})`);

    // 1. Update user with credits and stats
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          'credits.balance': 12,
          'credits.expiringCredits': [
            {
              amount: 5,
              expiryDate: new Date('2026-02-25') // 14 days from now
            },
            {
              amount: 7,
              expiryDate: new Date('2026-03-15') // More in future
            }
          ],
          'stats.totalClasses': 45,
          'stats.muayThaiClasses': 28,
          'stats.aerialClasses': 17,
          'stats.strength': 32,
          'stats.agility': 45,
          'stats.endurance': 28,
          'stats.flexibility': 38,
          'hero.level': 24,
          'hero.levelName': 'Immortal Warrior',
          'hero.achievements': ['first-strike', 'aerial-queen', 'early-bird'],
          'profile.gender': 'female',
          'formsCompleted': ['waiver', 'health', 'emergency']
        }
      }
    );
    console.log('✅ Updated user with credits and stats');

    // 2. Add sample bookings
    const classes = await db.collection('classes').find({ active: true }).limit(3).toArray();
    
    if (classes.length > 0) {
      const bookings = [
        {
          userId,
          classId: classes[0]._id.toString(),
          className: classes[0].type,
          classType: classes[0].type.toLowerCase().includes('muay') ? 'muay-thai' : 'aerial',
          instructor: classes[0].instructor,
          date: '2026-02-11', // Today
          time: classes[0].time,
          status: 'confirmed',
          creditsUsed: 1,
          createdAt: new Date()
        },
        {
          userId,
          classId: classes[1]._id.toString(),
          className: classes[1].type,
          classType: classes[1].type.toLowerCase().includes('muay') ? 'muay-thai' : 'aerial',
          instructor: classes[1].instructor,
          date: '2026-02-12', // Tomorrow
          time: classes[1].time,
          status: 'confirmed',
          creditsUsed: 1,
          createdAt: new Date()
        },
        {
          userId,
          classId: classes[2]._id.toString(),
          className: classes[2].type,
          classType: classes[2].type.toLowerCase().includes('muay') ? 'muay-thai' : 'aerial',
          instructor: classes[2].instructor,
          date: '2026-02-13', // Day after tomorrow
          time: classes[2].time,
          status: 'waitlist',
          creditsUsed: 1,
          createdAt: new Date()
        }
      ];

      // Clear existing bookings for this user
      await db.collection('bookings').deleteMany({ userId });
      await db.collection('bookings').insertMany(bookings);
      console.log(`✅ Added ${bookings.length} sample bookings`);
    }

    // 3. Add sample activities
    const activities = [
      {
        userId,
        action: 'Completed Aerial Hoop class',
        type: 'class_completion',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        userId,
        action: 'Booked Muay Thai session',
        type: 'booking',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        userId,
        action: 'Purchased 10 class credits',
        type: 'purchase',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    // Clear existing activities for this user
    await db.collection('activities').deleteMany({ userId });
    await db.collection('activities').insertMany(activities);
    console.log(`✅ Added ${activities.length} sample activities`);

    // 4. Add sample credit transactions
    const transactions = [
      {
        userId,
        type: 'debit',
        amount: 1,
        description: 'Class Booking: Muay Thai Foundations',
        balanceAfter: 12,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        userId,
        type: 'credit',
        amount: 10,
        description: 'Package Purchase: 10 Credits',
        balanceAfter: 13,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiryDate: new Date('2026-05-15'),
        invoiceUrl: '/invoices/INV-001.pdf',
        orderId: 'order_123456',
        paymentId: 'pay_123456'
      },
      {
        userId,
        type: 'debit',
        amount: 2,
        description: 'Class Booking: Aerial Silks',
        balanceAfter: 3,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      }
    ];

    // Clear existing transactions for this user
    await db.collection('credit_transactions').deleteMany({ userId });
    await db.collection('credit_transactions').insertMany(transactions);
    console.log(`✅ Added ${transactions.length} sample credit transactions`);

    // 5. Add sample form submissions
    const formSubmissions = [
      {
        userId,
        formId: 'waiver',
        formData: {
          fullName: user.name,
          dateOfBirth: '1990-01-01',
          emergencyContact: 'John Doe - 555-0100'
        },
        signature: 'data:image/png;base64,mock-signature',
        submittedAt: new Date('2026-01-10')
      },
      {
        userId,
        formId: 'health',
        formData: {
          medicalHistory: 'None',
          medications: 'None',
          injuries: 'None',
          fitnessLevel: 'Intermediate'
        },
        submittedAt: new Date('2026-01-10')
      },
      {
        userId,
        formId: 'emergency',
        formData: {
          contactName: 'Jane Doe',
          relationship: 'Spouse',
          phoneNumber: '555-0101'
        },
        submittedAt: new Date('2026-01-15')
      }
    ];

    // Clear existing form submissions for this user
    await db.collection('form_submissions').deleteMany({ userId });
    await db.collection('form_submissions').insertMany(formSubmissions);
    console.log(`✅ Added ${formSubmissions.length} sample form submissions`);

    console.log('\n🎉 Sample data successfully populated!');
    console.log(`\nYou can now login with:`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: (your password)`);
    console.log(`\nOr use Admin account:`);
    console.log(`Email: admin`);
    console.log(`Password: Qwerty@123`);

  } catch (error) {
    console.error('Error populating sample data:', error);
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

populateSampleData();
