import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { mockPrompts } from '@/lib/prompts-data'

// This function migrates mock data to Firestore
// Should only be run once in development
export async function migrateMockDataToFirestore() {
  try {
    // Check if data already exists
    const existingPrompts = await getDocs(collection(db, 'prompts'))
    if (!existingPrompts.empty) {
      console.log('Prompts already exist in Firestore, skipping migration')
      return
    }

    console.log('Migrating mock data to Firestore...')

    // Create a system user ID for the mock prompts
    const systemUserId = 'system-user'

    for (const prompt of mockPrompts) {
      await addDoc(collection(db, 'prompts'), {
        title: prompt.title,
        description: prompt.description,
        category: prompt.category,
        fullPrompt: prompt.fullPrompt,
        slug: prompt.slug,
        tags: prompt.tags,
        status: 'approved', // Auto-approve system prompts
        createdAt: serverTimestamp(),
        createdBy: systemUserId,
        approvedBy: systemUserId,
        upvotes: 0,
        downvotes: 0
      })
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Error migrating data:', error)
    throw error
  }
}