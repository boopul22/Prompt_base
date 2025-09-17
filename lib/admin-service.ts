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

  // Bulk create prompts with smart category matching
  async bulkCreatePrompts(prompts: any[], adminId: string) {
    const batch = writeBatch(db)
    const categoryPromptCounts = new Map<string, number>()

    // Get all existing categories to standardize names
    const allCategories = await categoriesService.getAllCategories()
    console.log(`Bulk upload: Found ${allCategories.length} existing categories in database`)

    for (const prompt of prompts) {
      if (!prompt.title || !prompt.fullPrompt) {
        console.warn("Skipping prompt with missing title or fullPrompt:", prompt)
        continue
      }

      const slug = generateSlug(prompt.title)
      const newPromptRef = doc(collection(db, "prompts"))

      // Standardize category name by finding existing category with comprehensive matching
      let category = prompt.category || "Uncategorized"
      const csvCategoryName = category.toLowerCase().trim()

      // Generate the slug for this CSV category
      const csvCategorySlug = category
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Try to find existing category by multiple methods:
      // 1. Exact name match (case-insensitive)
      // 2. Slug match (case-insensitive)
      // 3. Similar name variations
      const existingCategory = allCategories.find(cat => {
        const dbCategoryName = cat.name.toLowerCase().trim()
        const dbCategorySlug = cat.slug.toLowerCase().trim()

        // Method 1: Direct name match (case-insensitive)
        if (dbCategoryName === csvCategoryName) {
          return true
        }

        // Method 2: Slug match (case-insensitive)
        if (dbCategorySlug === csvCategorySlug) {
          return true
        }

        // Method 3: Handle common variations
        // Remove spaces, hyphens, underscores for comparison
        const normalizedDbName = dbCategoryName.replace(/[\s\-_]+/g, '')
        const normalizedCsvName = csvCategoryName.replace(/[\s\-_]+/g, '')

        if (normalizedDbName === normalizedCsvName) {
          return true
        }

        return false
      })

      if (existingCategory) {
        category = existingCategory.name // Use the exact name from database
        console.log(`CSV category "${prompt.category}" matched to existing category "${existingCategory.name}"`)
      }

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
    // (allCategories was already fetched above)
    for (const [categoryName, count] of categoryPromptCounts) {
      try {
        // Use the same comprehensive matching logic for category creation
        const csvCategoryName = categoryName.toLowerCase().trim()
        const csvCategorySlug = categoryName
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()

        // Check if category already exists using comprehensive matching
        const existingCategory = allCategories.find(cat => {
          const dbCategoryName = cat.name.toLowerCase().trim()
          const dbCategorySlug = cat.slug.toLowerCase().trim()

          // Method 1: Direct name match
          if (dbCategoryName === csvCategoryName) {
            return true
          }

          // Method 2: Slug match
          if (dbCategorySlug === csvCategorySlug) {
            return true
          }

          // Method 3: Normalized comparison (remove spaces, hyphens, underscores)
          const normalizedDbName = dbCategoryName.replace(/[\s\-_]+/g, '')
          const normalizedCsvName = csvCategoryName.replace(/[\s\-_]+/g, '')

          if (normalizedDbName === normalizedCsvName) {
            return true
          }

          return false
        })

        if (!existingCategory) {
          // Create new category only if no match found
          try {
            const newCategoryId = await categoriesService.createCategory({
              name: categoryName,
              slug: csvCategorySlug,
              description: `Auto-created category for ${categoryName} prompts`,
              isActive: true,
              createdBy: adminId
            })

            // Add to local list to prevent duplicates in same batch
            allCategories.push({
              id: newCategoryId,
              name: categoryName,
              slug: csvCategorySlug,
              description: `Auto-created category for ${categoryName} prompts`,
              isActive: true,
              createdBy: adminId,
              createdAt: new Date() as any,
              promptCount: 0
            })

            console.log(`Created new category "${categoryName}" from CSV upload`)
          } catch (error) {
            console.warn(`Failed to create category "${categoryName}":`, error)
            // If creation fails, try to find if it was created by another process
            const refreshedCategories = await categoriesService.getAllCategories()
            const laterExistingCategory = refreshedCategories.find(cat =>
              cat.name.toLowerCase().trim() === csvCategoryName ||
              cat.slug.toLowerCase().trim() === csvCategorySlug
            )
            if (laterExistingCategory) {
              console.log(`Found category created by another process: "${laterExistingCategory.name}"`)
              allCategories.push(laterExistingCategory)
            }
          }
        } else {
          console.log(`Using existing category "${existingCategory.name}" for CSV category "${categoryName}"`)
        }

        await categoriesService.updatePromptCount(categoryName, count)
      } catch (error) {
        console.warn(`Failed to update prompt count for category "${categoryName}":`, error)
      }
    }
  },

  // Bulk delete prompts with progress tracking
  async bulkDeletePrompts(
    promptIds: string[],
    adminId: string,
    onProgress?: (progress: number, stage: string) => void
  ) {
    try {
      const totalSteps = promptIds.length + 1 // +1 for category count updates
      let currentStep = 0
      const categoryDecrementCounts = new Map<string, number>()

      onProgress?.(0, 'Preparing deletion...')

      // Process prompts in smaller batches for better progress tracking
      const batchSize = 10
      const batches: any[] = []

      for (let i = 0; i < promptIds.length; i += batchSize) {
        const batchIds = promptIds.slice(i, i + batchSize)
        const batch = writeBatch(db)

        // Get prompts to track category counts and add to batch
        for (const promptId of batchIds) {
          onProgress?.(
            (currentStep / totalSteps) * 100,
            `Processing prompt ${currentStep + 1} of ${promptIds.length}...`
          )

          const promptDoc = await promptsService.getPromptById(promptId)
          if (promptDoc && promptDoc.category) {
            categoryDecrementCounts.set(
              promptDoc.category,
              (categoryDecrementCounts.get(promptDoc.category) || 0) + 1
            )
          }

          // Add to batch delete
          const docRef = doc(db, 'prompts', promptId)
          batch.delete(docRef)
          currentStep++
        }

        batches.push(batch)
      }

      onProgress?.(70, 'Deleting prompts...')

      // Execute all batches
      await Promise.all(batches.map(batch => batch.commit()))

      onProgress?.(90, 'Updating categories...')

      // Update category prompt counts (decrement)
      for (const [categoryName, count] of categoryDecrementCounts) {
        try {
          await categoriesService.updatePromptCount(categoryName, -count)
        } catch (error) {
          console.warn(`Failed to update prompt count for category "${categoryName}":`, error)
        }
      }

      onProgress?.(100, 'Deletion complete!')

      console.log(`Admin ${adminId} bulk deleted ${promptIds.length} prompts`)
      return { success: true, deletedCount: promptIds.length }
    } catch (error) {
      console.error('Error bulk deleting prompts:', error)
      throw error
    }
  },

  // Clean up duplicate categories
  async cleanupDuplicateCategories(adminId: string) {
    try {
      console.log('Starting cleanup of duplicate categories...')

      // Get all categories
      const allCategories = await categoriesService.getAllCategories()

      // Find duplicates by slug
      const slugMap = new Map<string, any[]>()
      allCategories.forEach(category => {
        const slug = category.slug.toLowerCase().trim()
        if (!slugMap.has(slug)) {
          slugMap.set(slug, [])
        }
        slugMap.get(slug)!.push(category)
      })

      // Process duplicates
      const duplicatesFound = []
      const batch = writeBatch(db)

      for (const [slug, categories] of slugMap) {
        if (categories.length > 1) {
          // Sort by creation date (keep the oldest one)
          categories.sort((a, b) => {
            const aTime = a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt
              ? a.createdAt.toDate().getTime()
              : 0
            const bTime = b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt
              ? b.createdAt.toDate().getTime()
              : 0
            return aTime - bTime
          })

          const keepCategory = categories[0]
          const duplicateCategories = categories.slice(1)

          duplicatesFound.push({
            slug,
            kept: keepCategory.name,
            removed: duplicateCategories.map(cat => cat.name)
          })

          let totalPromptCount = keepCategory.promptCount || 0

          // For each duplicate category, update prompts to use the kept category
          for (const dupCategory of duplicateCategories) {
            // Get all prompts using this duplicate category
            const promptsSnapshot = await getDocs(
              query(collection(db, 'prompts'), where('category', '==', dupCategory.name))
            )

            // Update prompts to use the kept category name
            promptsSnapshot.forEach(doc => {
              batch.update(doc.ref, { category: keepCategory.name })
            })

            // Add to total prompt count
            totalPromptCount += dupCategory.promptCount || 0

            // Delete the duplicate category
            batch.delete(doc(db, 'categories', dupCategory.id!))
          }

          // Update the kept category's prompt count
          batch.update(doc(db, 'categories', keepCategory.id!), {
            promptCount: totalPromptCount,
            updatedAt: serverTimestamp()
          })
        }
      }

      // Execute all updates
      if (duplicatesFound.length > 0) {
        await batch.commit()
        console.log(`Cleaned up ${duplicatesFound.length} duplicate category groups`)
      }

      return {
        success: true,
        duplicatesFound,
        message: duplicatesFound.length > 0
          ? `Successfully cleaned up ${duplicatesFound.length} duplicate category groups`
          : 'No duplicate categories found'
      }
    } catch (error) {
      console.error('Error cleaning up duplicate categories:', error)
      throw error
    }
  }
}
