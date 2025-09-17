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
import { getFirestoreInstance } from '@/lib/firebase'

export interface BlogPost {
  id?: string
  title: string
  content: string
  excerpt: string
  slug: string
  featuredImage?: string
  images?: string[] // Content images
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  author: string // User ID
  createdAt: Timestamp
  updatedAt?: Timestamp
  publishedAt?: Timestamp
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  readTime?: number // in minutes
  views?: number
}

export interface BlogCategory {
  id?: string
  name: string
  slug: string
  description?: string
  color?: string
  postCount: number
  createdAt: Timestamp
  updatedAt?: Timestamp
}

// Blog Posts Service
export const blogService = {
  // Create a new blog post
  async createPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>) {
    const docRef = await addDoc(collection(getFirestoreInstance(), 'blog-posts'), {
      ...postData,
      createdAt: serverTimestamp(),
      views: 0
    })
    return docRef.id
  },

  // Get all published blog posts
  async getPublishedPosts(categorySlug?: string, limitCount?: number) {
    try {
      let q;

      if (categorySlug && categorySlug !== 'all') {
        q = query(
          collection(getFirestoreInstance(), 'blog-posts'),
          where('status', '==', 'published'),
          where('category', '==', categorySlug)
        )
      } else {
        q = query(
          collection(getFirestoreInstance(), 'blog-posts'),
          where('status', '==', 'published')
        )
      }

      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const snapshot = await getDocs(q)
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))

      // Sort on client side by publishedAt or createdAt
      return posts.sort((a, b) => {
        const aTime = a.publishedAt && typeof a.publishedAt === 'object' && 'toDate' in a.publishedAt
          ? a.publishedAt.toDate().getTime()
          : (a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt
            ? a.createdAt.toDate().getTime()
            : new Date().getTime())
        const bTime = b.publishedAt && typeof b.publishedAt === 'object' && 'toDate' in b.publishedAt
          ? b.publishedAt.toDate().getTime()
          : (b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt
            ? b.createdAt.toDate().getTime()
            : new Date().getTime())
        return bTime - aTime // Descending order (newest first)
      })
    } catch (error) {
      console.error('Error fetching published posts:', error)
      return []
    }
  },

  // Get all blog posts (admin only)
  async getAllPosts() {
    try {
      const snapshot = await getDocs(collection(getFirestoreInstance(), 'blog-posts'))
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))

      // Sort on client side
      return posts.sort((a, b) => {
        const aTime = a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt
          ? a.createdAt.toDate().getTime()
          : new Date().getTime()
        const bTime = b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt
          ? b.createdAt.toDate().getTime()
          : new Date().getTime()
        return bTime - aTime // Descending order (newest first)
      })
    } catch (error) {
      console.error('Error fetching all posts:', error)
      return []
    }
  },

  // Get posts by author
  async getPostsByAuthor(authorId: string) {
    try {
      const q = query(
        collection(getFirestoreInstance(), 'blog-posts'),
        where('author', '==', authorId)
      )
      const snapshot = await getDocs(q)
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))

      return posts.sort((a, b) => {
        const aTime = a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt
          ? a.createdAt.toDate().getTime()
          : new Date().getTime()
        const bTime = b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt
          ? b.createdAt.toDate().getTime()
          : new Date().getTime()
        return bTime - aTime
      })
    } catch (error) {
      console.error('Error fetching posts by author:', error)
      return []
    }
  },

  // Get blog post by slug
  async getPostBySlug(slug: string) {
    try {
      const q = query(collection(getFirestoreInstance(), 'blog-posts'), where('slug', '==', slug))
      const snapshot = await getDocs(q)
      if (snapshot.empty) return null
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() } as BlogPost
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }
  },

  // Update blog post
  async updatePost(postId: string, updates: Partial<BlogPost>) {
    const docRef = doc(getFirestoreInstance(), 'blog-posts', postId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Delete blog post
  async deletePost(postId: string) {
    await deleteDoc(doc(getFirestoreInstance(), 'blog-posts', postId))
  },

  // Publish post
  async publishPost(postId: string) {
    await this.updatePost(postId, {
      status: 'published',
      publishedAt: serverTimestamp()
    })
  },

  // Archive post
  async archivePost(postId: string) {
    await this.updatePost(postId, {
      status: 'archived'
    })
  },

  // Increment views
  async incrementViews(postId: string) {
    try {
      const postRef = doc(getFirestoreInstance(), 'blog-posts', postId)
      const postDoc = await getDoc(postRef)
      if (postDoc.exists()) {
        const currentViews = postDoc.data().views || 0
        await updateDoc(postRef, {
          views: currentViews + 1
        })
      }
    } catch (error) {
      console.error('Error incrementing views:', error)
    }
  },

  // Get related posts
  async getRelatedPosts(currentPostId: string, category: string, limit: number = 3) {
    try {
      const q = query(
        collection(getFirestoreInstance(), 'blog-posts'),
        where('status', '==', 'published'),
        where('category', '==', category)
      )
      const snapshot = await getDocs(q)
      const posts = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
        .filter(post => post.id !== currentPostId)
        .slice(0, limit)

      return posts
    } catch (error) {
      console.error('Error fetching related posts:', error)
      return []
    }
  }
}

// Blog Categories Service
export const blogCategoriesService = {
  // Create a new category
  async createCategory(categoryData: Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt' | 'postCount'>) {
    const docRef = await addDoc(collection(getFirestoreInstance(), 'blog-categories'), {
      ...categoryData,
      createdAt: serverTimestamp(),
      postCount: 0
    })
    return docRef.id
  },

  // Get all categories
  async getAllCategories() {
    try {
      const snapshot = await getDocs(collection(getFirestoreInstance(), 'blog-categories'))
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogCategory))

      return categories.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  // Get category by slug
  async getCategoryBySlug(slug: string) {
    try {
      const q = query(collection(getFirestoreInstance(), 'blog-categories'), where('slug', '==', slug))
      const snapshot = await getDocs(q)
      if (snapshot.empty) return null
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() } as BlogCategory
    } catch (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }
  },

  // Update category
  async updateCategory(categoryId: string, updates: Partial<BlogCategory>) {
    const docRef = doc(getFirestoreInstance(), 'blog-categories', categoryId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  // Delete category
  async deleteCategory(categoryId: string) {
    await deleteDoc(doc(getFirestoreInstance(), 'blog-categories', categoryId))
  },

  // Update post count for category
  async updatePostCount(categorySlug: string, increment: boolean = true) {
    try {
      const category = await this.getCategoryBySlug(categorySlug)
      if (category) {
        const newCount = Math.max(0, category.postCount + (increment ? 1 : -1))
        await this.updateCategory(category.id!, { postCount: newCount })
      }
    } catch (error) {
      console.error('Error updating post count:', error)
    }
  }
}

// Utility function to generate slug from title
export function generateBlogSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Utility function to calculate read time
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Utility function to generate excerpt
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '').trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }

  return truncated + '...'
}