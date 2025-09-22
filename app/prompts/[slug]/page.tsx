import { notFound } from "next/navigation"
import { PromptDetailClient } from "@/components/prompt-detail-client"
import { promptsService, usersService } from "@/lib/firestore-service"
import type { Metadata } from "next"

interface PromptPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  try {
    const prompt = await promptsService.getPromptBySlug(params.slug)
    
    if (!prompt) {
      return {
        title: "Prompt Not Found",
        description: "The requested AI prompt could not be found."
      }
    }

    const title = `${prompt.title} - Free AI Prompt`
    const description = `${prompt.description} - Get this viral AI prompt for ${prompt.category.toLowerCase()}. Copy, customize and create amazing content with this tested prompt.`
    const url = `/prompts/${params.slug}`

    return {
      title,
      description,
      keywords: [
        ...prompt.tags,
        `${prompt.category} prompts`,
        "AI prompt",
        "ChatGPT prompt",
        "viral prompt",
        "free AI prompt",
        prompt.category.toLowerCase()
      ],
      alternates: {
        canonical: url
      },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        siteName: "Free PromptBase",
        images: [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: prompt.title
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og-image.png"]
      },
      other: {
        "article:author": "Free PromptBase",
        "article:section": prompt.category,
        "article:tag": prompt.tags.join(", ")
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "AI Prompt | Free PromptBase",
      description: "Discover viral AI prompts for content creation and business growth."
    }
  }
}

export default async function PromptPage({ params }: PromptPageProps) {
  try {
    const prompt = await promptsService.getPromptBySlug(params.slug)
    
    if (!prompt) {
      notFound()
    }

    // Get creator details
    let creator = null
    if (prompt.createdBy) {
      const rawCreator = await usersService.getUserById(prompt.createdBy)
      if (rawCreator) {
        // Serialize timestamps in user profile
        creator = {
          ...rawCreator,
          createdAt: rawCreator.createdAt && typeof rawCreator.createdAt === 'object' && 'toDate' in rawCreator.createdAt
            ? rawCreator.createdAt.toDate().toISOString()
            : rawCreator.createdAt,
          updatedAt: rawCreator.updatedAt && typeof rawCreator.updatedAt === 'object' && 'toDate' in rawCreator.updatedAt
            ? rawCreator.updatedAt.toDate().toISOString()
            : rawCreator.updatedAt
        }
      }
    }

    // Get related prompts (efficient query - only loads what we need)
    const relatedPrompts = await promptsService.getRelatedPrompts(prompt.id, prompt.category, 3)

    // Serialize the prompt data to avoid timestamp serialization issues
    const serializedPrompt = {
      ...prompt,
      createdAt: prompt.createdAt && typeof prompt.createdAt === 'object' && 'toDate' in prompt.createdAt
        ? prompt.createdAt.toDate().toISOString()
        : prompt.createdAt,
      updatedAt: prompt.updatedAt && typeof prompt.updatedAt === 'object' && 'toDate' in prompt.updatedAt
        ? prompt.updatedAt.toDate().toISOString()
        : prompt.updatedAt
    }

    // Serialize related prompts
    const serializedRelatedPrompts = relatedPrompts.map(p => ({
      ...p,
      createdAt: p.createdAt && typeof p.createdAt === 'object' && 'toDate' in p.createdAt
        ? p.createdAt.toDate().toISOString()
        : p.createdAt,
      updatedAt: p.updatedAt && typeof p.updatedAt === 'object' && 'toDate' in p.updatedAt
        ? p.updatedAt.toDate().toISOString()
        : p.updatedAt
    }))

    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
          <PromptDetailClient 
            prompt={serializedPrompt} 
            creator={creator} 
            relatedPrompts={serializedRelatedPrompts}
          />
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading prompt:', error)
    notFound()
  }
}