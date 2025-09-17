import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { categoriesService, generateCategorySlug } from '@/lib/category-service'

// Default categories with descriptions
const defaultCategories = [
  {
    name: "Content Creation",
    description: "AI prompts for creating engaging content, social media posts, and marketing materials",
    isActive: true
  },
  {
    name: "Programming", 
    description: "Code review, debugging, development assistance and technical problem solving",
    isActive: true
  },
  {
    name: "Business",
    description: "Strategy, planning, analysis and business development prompts",
    isActive: true
  },
  {
    name: "Writing",
    description: "Creative writing, copywriting, editing and storytelling assistance",
    isActive: true
  },
  {
    name: "Data Science",
    description: "Data analysis, machine learning, statistics and insights generation",
    isActive: true
  },
  {
    name: "Design",
    description: "UX/UI design, visual design feedback and creative direction",
    isActive: true
  },
  {
    name: "Marketing",
    description: "Digital marketing, advertising campaigns and brand strategy",
    isActive: true
  },
  {
    name: "Education",
    description: "Learning materials, tutoring, course creation and educational content",
    isActive: true
  }
]

// Migration function to populate categories in Firestore
export async function migrateCategoriestoFirestore(systemUserId: string = 'system-user') {
  try {
    // Check if categories already exist
    const existingCategories = await categoriesService.getAllCategories()
    if (existingCategories.length > 0) {
      console.log('Categories already exist in Firestore, skipping migration')
      return existingCategories
    }

    console.log('Migrating categories to Firestore...')

    const migratedCategories = []

    for (const category of defaultCategories) {
      const slug = generateCategorySlug(category.name)
      
      const categoryId = await categoriesService.createCategory({
        name: category.name,
        slug,
        description: category.description,
        isActive: category.isActive,
        createdBy: systemUserId
      })

      migratedCategories.push({
        id: categoryId,
        ...category,
        slug
      })

      console.log(`Created category: ${category.name}`)
    }

    console.log('Category migration completed successfully!')
    return migratedCategories

  } catch (error) {
    console.error('Error migrating categories:', error)
    throw error
  }
}

// Function to get categories from database only - NO AUTOMATIC SEEDING
export async function getCategories() {
  try {
    // Simply return categories from database - no seeding, no fallbacks
    const allCategories = await categoriesService.getAllCategories()

    // Return only active categories
    const activeCategories = allCategories.filter(cat => cat.isActive)

    console.log(`Found ${activeCategories.length} active categories in database`)
    return activeCategories
  } catch (error) {
    console.error('Error getting categories:', error)
    // Return empty array on error - no fallbacks
    return []
  }
}