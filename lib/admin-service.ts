import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { usersService, promptsService, generateSlug } from '@/lib/firestore-service'
import { categoriesService } from '@/lib/category-service'

export interface AdminStats {
  totalUsers: number
  totalPrompts: number
  pendingPrompts: number
  approvedPrompts: number
  rejectedPrompts: number
}

// Admin Service for managing users and admin roles
export const adminService = {
  // Get admin dashboard stats
  async getAdminStats(): Promise<AdminStats> {
    try {
      const [usersSnapshot, promptsSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'prompts'))
      ])

      const totalUsers = usersSnapshot.size
      const allPrompts = promptsSnapshot.docs.map(doc => doc.data())
      
      const totalPrompts = allPrompts.length
      const pendingPrompts = allPrompts.filter(p => p.status === 'pending').length
      const approvedPrompts = allPrompts.filter(p => p.status === 'approved').length
      const rejectedPrompts = allPrompts.filter(p => p.status === 'rejected').length

      return {
        totalUsers,
        totalPrompts,
        pendingPrompts,
        approvedPrompts,
        rejectedPrompts
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      throw error
    }
  },

  // Get all users for admin management
  async getAllUsersForAdmin() {
    try {
      return await usersService.getAllUsers()
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Assign admin role to user
  async assignAdminRole(userId: string, adminId: string) {
    try {
      await usersService.makeUserAdmin(userId)
      
      // Log the admin action
      console.log(`Admin ${adminId} assigned admin role to user ${userId}`)
      
      return { success: true }
    } catch (error) {
      console.error('Error assigning admin role:', error)
      throw error
    }
  },

  // Remove admin role from user
  async removeAdminRole(userId: string, adminId: string) {
    try {
      await usersService.removeAdmin(userId)
      
      // Log the admin action
      console.log(`Admin ${adminId} removed admin role from user ${userId}`)
      
      return { success: true }
    } catch (error) {
      console.error('Error removing admin role:', error)
      throw error
    }
  },

  // Get pending prompts for review
  async getPendingPrompts() {
    try {
      const q = query(
        collection(db, 'prompts'), 
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error fetching pending prompts:', error)
      throw error
    }
  },

  // Approve prompt
  async approvePrompt(promptId: string, adminId: string) {
    try {
      const docRef = doc(db, 'prompts', promptId)
      await updateDoc(docRef, {
        status: 'approved',
        approvedBy: adminId,
        updatedAt: serverTimestamp()
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error approving prompt:', error)
      throw error
    }
  },

  // Reject prompt
  async rejectPrompt(promptId: string, adminId: string) {
    try {
      const docRef = doc(db, 'prompts', promptId)
      await updateDoc(docRef, {
        status: 'rejected',
        approvedBy: adminId,
        updatedAt: serverTimestamp()
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error rejecting prompt:', error)
      throw error
    }
  },

  // Check if user is admin
  async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const userProfile = await usersService.getUserProfile(userId)
      return userProfile?.isAdmin || false
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  },

  // Bulk create prompts
  async bulkCreatePrompts(prompts: any[], adminId: string) {
    const batch = writeBatch(db)
    const categoryPromptCounts = new Map<string, number>()

    for (const prompt of prompts) {
      if (!prompt.title || !prompt.fullPrompt) {
        console.warn("Skipping prompt with missing title or fullPrompt:", prompt)
        continue
      }

      const slug = generateSlug(prompt.title)
      const newPromptRef = doc(collection(db, "prompts"))
      const category = prompt.category || "Uncategorized"

      const newPrompt = {
        title: prompt.title,
        description: prompt.description || "",
        category,
        fullPrompt: prompt.fullPrompt,
        slug,
        tags: prompt.tags ? prompt.tags.split(",").map((tag: string) => tag.trim()) : [],
        images: [],
        status: 'approved',
        createdBy: adminId,
        approvedBy: adminId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      batch.set(newPromptRef, newPrompt)

      // Track category counts
      categoryPromptCounts.set(category, (categoryPromptCounts.get(category) || 0) + 1)
    }

    await batch.commit()

    // Update category prompt counts and create categories if they don't exist
    for (const [categoryName, count] of categoryPromptCounts) {
      try {
        // Check if category exists
        const categories = await categoriesService.getAllCategories()
        const existingCategory = categories.find(cat => cat.name === categoryName)

        if (!existingCategory) {
          // Create the category if it doesn't exist
          const categorySlug = categoryName
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

          await categoriesService.createCategory({
            name: categoryName,
            slug: categorySlug,
            description: `Auto-created category for ${categoryName} prompts`,
            isActive: true,
            createdBy: adminId
          })
        }

        await categoriesService.updatePromptCount(categoryName, count)
      } catch (error) {
        console.warn(`Failed to update prompt count for category "${categoryName}":`, error)
      }
    }
  }
}
