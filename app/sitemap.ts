import { MetadataRoute } from 'next'
import { promptsService } from '@/lib/firestore-service'
import { blogService, blogCategoriesService } from '@/lib/blog-service'
import fs from 'fs'
import path from 'path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

  // Core static pages that always exist
  const corePages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/prompts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  ]

  // Dynamically discover all page.tsx files in the app directory
  const dynamicPages: MetadataRoute.Sitemap = []

  try {
    const appDir = path.join(process.cwd(), 'app')
    const discoverPages = (dir: string, basePath = ''): void => {
      const items = fs.readdirSync(dir, { withFileTypes: true })

      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('[') && !item.name.startsWith('_')) {
          const itemPath = path.join(dir, item.name)
          const routePath = `${basePath}/${item.name}`

          // Check if this directory has a page.tsx
          const pagePath = path.join(itemPath, 'page.tsx')
          if (fs.existsSync(pagePath)) {
            // Skip blocked paths
            if (!['admin', 'api', 'private', 'add-prompt', 'profile'].includes(item.name)) {
              dynamicPages.push({
                url: `${baseUrl}${routePath}`,
                lastModified: new Date(),
                changeFrequency: routePath.includes('prompt') ? 'weekly' as const : 'monthly' as const,
                priority: routePath.includes('prompt') ? 0.8 : 0.7,
              })
            }
          }

          // Recursively check subdirectories (but not dynamic routes)
          discoverPages(itemPath, routePath)
        }
      }
    }

    discoverPages(appDir)
  } catch (error) {
    console.error('Error discovering pages:', error)
  }

  try {
    // Get all dynamic content from database
    const [prompts, blogPosts, blogCategories] = await Promise.all([
      promptsService.getApprovedPrompts(),
      blogService.getPublishedPosts(),
      blogCategoriesService.getAllCategories()
    ])

    // Individual prompt pages
    const promptPages = prompts.map((prompt) => ({
      url: `${baseUrl}/prompts/${prompt.slug}`,
      lastModified: prompt.updatedAt?.toDate() || prompt.createdAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // Individual blog post pages
    const blogPostPages = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt?.toDate() || post.publishedAt?.toDate() || post.createdAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Blog category pages
    const blogCategoryPages = blogCategories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: category.updatedAt?.toDate() || category.createdAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Remove duplicates by URL (in case core pages overlap with discovered pages)
    const allPages = [...corePages, ...dynamicPages, ...promptPages, ...blogPostPages, ...blogCategoryPages]
    const uniquePages = allPages.filter((page, index, self) =>
      index === self.findIndex(p => p.url === page.url)
    )

    return uniquePages
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return core pages and discovered pages if database fails
    return [...corePages, ...dynamicPages]
  }
}