// This is a utility script to help you set up the first admin user
// You can run this in the browser console after signing up with your first account

import { doc, updateDoc } from 'firebase/firestore'
import { getFirestoreInstance } from '@/lib/firebase'

export async function makeUserAdmin(userId: string) {
  try {
    const userDoc = doc(getFirestoreInstance(), 'users', userId)
    await updateDoc(userDoc, {
      isAdmin: true,
      updatedAt: new Date()
    })
    console.log('User successfully made admin!')
    return true
  } catch (error) {
    console.error('Error making user admin:', error)
    return false
  }
}

// Instructions for setting up the first admin:
// 1. Sign up for an account using the normal sign-up process
// 2. Copy your user ID from the browser console or Firebase Auth
// 3. Run: makeUserAdmin('YOUR_USER_ID_HERE')
// 4. Refresh the page to see admin privileges

console.log('Admin setup utility loaded. Use makeUserAdmin(userId) to grant admin privileges.')