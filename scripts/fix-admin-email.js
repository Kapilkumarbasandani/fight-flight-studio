const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function fixAdminEmail() {
  try {
    await client.connect();
    const db = client.db('fight-flight-studio');
    
    // Update Admin to admin
    const result = await db.collection('users').updateOne(
      { email: 'Admin' },
      { $set: { email: 'admin', updatedAt: new Date() } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✓ Updated email from "Admin" to "admin"');
    } else {
      console.log(' No user with email "Admin" found');
    }
    
    // Verify the admin user
    const adminUser = await db.collection('users').findOne({ email: 'admin' });
    if (adminUser) {
      console.log('✓ Admin user verified:');
      console.log('  Email:', adminUser.email);
      console.log('  Role:', adminUser.role);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminEmail();
