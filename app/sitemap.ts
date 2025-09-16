import { MetadataRoute } from 'next'
import { promptsService } from '@/lib/firestore-service'

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
    }
  ]

  try {
    // Get all approved prompts for dynamic pages
    const prompts = await promptsService.getApprovedPrompts()
    
    const promptPages = prompts.map((prompt) => ({
      url: `${baseUrl}/prompts/${prompt.slug}`,
      lastModified: prompt.updatedAt?.toDate() || prompt.createdAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    return [...staticPages, ...promptPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if prompt fetching fails
    return staticPages
  }
}