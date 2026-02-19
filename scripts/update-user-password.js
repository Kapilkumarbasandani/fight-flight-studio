const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'fight-flight-studio';

async function updatePassword() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    const userEmail = 'kkbasandani74@gmail.com';
    const newPassword = 'Qwerty@123';

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updateResult = await usersCollection.updateOne(
      { email: userEmail },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.modifiedCount > 0) {
      console.log('\n✅ Password updated successfully!');
      console.log(`Email: ${userEmail}`);
      console.log(`New Password: ${newPassword}`);
    } else {
      console.log('No changes were made. User may not exist.');
    }

  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

updatePassword();
