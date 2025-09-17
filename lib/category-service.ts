import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Category {
  id?: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  promptCount?: number
  createdAt: Timestamp
  updatedAt?: Timestamp
  createdBy: string
}

// Categories Service
export const categoriesService = {
  // Create a new category
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'promptCount'>) {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: serverTimestamp(),
      promptCount: 0
    })
    return docRef.id
  },

  // Get all active categories
  async getActiveCategories() {
    try {
      const snapshot = await getDocs(collection(db, 'categories'))
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category))
      
      return categories
        .filter(cat => cat.isActive)
        .sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Error fetching active categories:', error)
      return []
    }
  },

  // Get all categories (admin only)
  async getAllCategories() {
    try {
      const snapshot = await getDocs(collection(db, 'categories'))
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category))

      // Sort by creation date (newest first)
      return categories.sort((a, b) => {
        const aTime = a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt
          ? a.createdAt.toDate().getTime()
          : new Date().getTime()
        const bTime = b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt
          ? b.createdAt.toDate().getTime()
          : new Date().getTime()
        return bTime - aTime
      })
    } catch (error) {
      console.error('Error fetching all categories:', error)
      return []
    }
  },

  // Get category by slug
  async getCategoryBySlug(slug: string) {
    try {
      const snapshot = await getDocs(collection(db, 'categories'))
      const category = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Category))
        .find(cat => cat.slug === slug)
      return category || null
    } catch (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }
  },

  // Update category
  async updateCategory(categoryId: string, updates: Partial<Category>) {
    const docRef = doc(db, 'categories', categoryId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Delete category
  async deleteCategory(categoryId: string) {
    await deleteDoc(doc(db, 'categories', categoryId))
  },

  // Toggle category active status
  async toggleCategoryStatus(categoryId: string, isActive: boolean) {
    await this.updateCategory(categoryId, { isActive })
  },

  // Update prompt count for category
  async updatePromptCount(categoryName: string, increment: number = 1) {
    try {
      const categories = await this.getAllCategories()
      // Use case-insensitive matching for category names
      const category = categories.find(cat =>
        cat.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
      )

      if (category && category.id) {
        const newCount = Math.max(0, (category.promptCount || 0) + increment)
        await this.updateCategory(category.id, { promptCount: newCount })
      }
    } catch (error) {
      console.error('Error updating prompt count:', error)
    }
  }
}

// Utility function to generate slug from category name
export function generateCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}