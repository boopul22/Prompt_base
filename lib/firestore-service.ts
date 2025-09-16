import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface FirestorePrompt {
  id?: string
  title: string
  description: string
  category: string
  fullPrompt: string
  slug: string
  tags: string[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Timestamp
  updatedAt?: Timestamp
  createdBy: string // User ID
  approvedBy?: string // Admin ID
  upvotes: number
  downvotes: number
}

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  isAdmin: boolean
  createdAt: Timestamp
  updatedAt?: Timestamp
}

// Prompts Service
export const promptsService = {
  // Create a new prompt
  async createPrompt(promptData: Omit<FirestorePrompt, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes'>) {
    const docRef = await addDoc(collection(db, 'prompts'), {
      ...promptData,
      createdAt: serverTimestamp(),
      upvotes: 0,
      downvotes: 0
    })
    return docRef.id
  },

  // Get all approved prompts
  async getApprovedPrompts(category?: string) {
    try {
      let q;
      
      if (category && category !== 'All') {
        // Simple query without ordering to avoid index requirements
        q = query(
          collection(db, 'prompts'), 
          where('status', '==', 'approved'),
          where('category', '==', category)
        )
      } else {
        // Simple query without ordering to avoid index requirements
        q = query(
          collection(db, 'prompts'), 
          where('status', '==', 'approved')
        )
      }
      
      const snapshot = await getDocs(q)
      const prompts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestorePrompt))
      
      // Sort on client side instead of server side to avoid index requirements
      return prompts.sort((a, b) => {
        const aTime = a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt 
          ? a.createdAt.toDate().getTime() 
          : new Date().getTime()
        const bTime = b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt 
          ? b.createdAt.toDate().getTime() 
          : new Date().getTime()
        return bTime - aTime // Descending order (newest first)
      })
    } catch (error) {
      console.error('Error fetching approved prompts:', error)
      return []
    }
  },

  // Get all prompts (admin only)
  async getAllPrompts() {
    try {
      const snapshot = await getDocs(collection(db, 'prompts'))
      const prompts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestorePrompt))
      
      // Sort on client side
      return prompts.sort((a, b) => {
        const aTime = a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt 
          ? a.createdAt.toDate().getTime() 
          : new Date().getTime()
        const bTime = b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt 
          ? b.createdAt.toDate().getTime() 
          : new Date().getTime()
        return bTime - aTime // Descending order (newest first)
      })
    } catch (error) {
      console.error('Error fetching all prompts:', error)
      return []
    }
  },

  // Get prompts by user
  async getPromptsByUser(userId: string) {
    const q = query(
      collection(db, 'prompts'), 
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestorePrompt))
  },

  // Get prompt by slug
  async getPromptBySlug(slug: string) {
    const q = query(collection(db, 'prompts'), where('slug', '==', slug))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as FirestorePrompt
  },

  // Update prompt
  async updatePrompt(promptId: string, updates: Partial<FirestorePrompt>) {
    const docRef = doc(db, 'prompts', promptId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Delete prompt
  async deletePrompt(promptId: string) {
    await deleteDoc(doc(db, 'prompts', promptId))
  },

  // Approve prompt (admin only)
  async approvePrompt(promptId: string, adminId: string) {
    await this.updatePrompt(promptId, {
      status: 'approved',
      approvedBy: adminId
    })
  },

  // Reject prompt (admin only)
  async rejectPrompt(promptId: string, adminId: string) {
    await this.updatePrompt(promptId, {
      status: 'rejected',
      approvedBy: adminId
    })
  }
}

// Users Service
export const usersService = {
  // Get user profile
  async getUserProfile(userId: string) {
    const docRef = doc(db, 'users', userId)
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) return null
    return { id: snapshot.id, ...snapshot.data() } as UserProfile
  },

  // Get all users (admin only)
  async getAllUsers() {
    const snapshot = await getDocs(collection(db, 'users'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile))
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Make user admin
  async makeUserAdmin(userId: string) {
    await this.updateUserProfile(userId, { isAdmin: true })
  },

  // Remove admin privileges
  async removeAdmin(userId: string) {
    await this.updateUserProfile(userId, { isAdmin: false })
  }
}

// Utility function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}