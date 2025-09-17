import { MetadataRoute } from 'next'
import { promptsService } from '@/lib/firestore-service'
import { blogService, blogCategoriesService } from '@/lib/blog-service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/add-prompt`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chatgpt-prompts`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/seo-prompts`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/prompt-engineering`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  ]

  try {
    // Get all approved prompts and published blog posts for dynamic pages
    const [prompts, blogPosts, blogCategories] = await Promise.all([
      promptsService.getApprovedPrompts(),
      blogService.getPublishedPosts(),
      blogCategoriesService.getAllCategories()
    ])

    const promptPages = prompts.map((prompt) => ({
      url: `${baseUrl}/prompts/${prompt.slug}`,
      lastModified: prompt.updatedAt?.toDate() || prompt.createdAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    const blogPostPages = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt?.toDate() || post.publishedAt?.toDate() || post.createdAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const blogCategoryPages = blogCategories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: category.updatedAt?.toDate() || category.createdAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...promptPages, ...blogPostPages, ...blogCategoryPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if fetching fails
    return staticPages
  }
}