// Script to cleanup duplicate categories in Firestore
// This script will merge CHATGPT category into ChatGPT category

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json'); // You'll need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanupDuplicateCategories() {
  try {
    console.log('Starting cleanup of duplicate categories...');

    // Get all prompts with "CHATGPT" category
    const promptsSnapshot = await db.collection('prompts')
      .where('category', '==', 'CHATGPT')
      .get();

    console.log(`Found ${promptsSnapshot.size} prompts with CHATGPT category`);

    // Update all prompts to use "ChatGPT" instead of "CHATGPT"
    const batch = db.batch();
    let updateCount = 0;

    promptsSnapshot.forEach(doc => {
      batch.update(doc.ref, { category: 'ChatGPT' });
      updateCount++;
    });

    // Commit the batch update
    await batch.commit();
    console.log(`Updated ${updateCount} prompts to use "ChatGPT" category`);

    // Update the ChatGPT category prompt count (26 + 56 = 82)
    const chatgptCategoryRef = db.collection('categories').doc('CyMy0OzCRXn7sQRSEDQk');
    await chatgptCategoryRef.update({
      promptCount: 82,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Updated ChatGPT category prompt count to 82');

    // Delete the duplicate CHATGPT category
    await db.collection('categories').doc('v76AWMWgK76T1vLe7Jn4').delete();
    console.log('Deleted duplicate CHATGPT category');

    console.log('Cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    process.exit();
  }
}

cleanupDuplicateCategories();