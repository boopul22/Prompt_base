import { StructuredData } from "@/components/structured-data"
import { PromptsPageClient } from "@/components/prompts-page-client"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import { getCategories } from "@/lib/migrate-categories"
import { Category } from "@/lib/category-service"
import type { Metadata } from "next"

interface SerializedPrompt extends Omit<FirestorePrompt, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt?: string
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "All Free AI Prompts - Complete Collection",
    description: "Browse our complete collection of free AI prompts for ChatGPT, Claude, Gemini, and all models. Download tested templates for content creation, marketing, SEO, and business growth.",
    keywords: [
      "AI prompts",
      "ChatGPT prompts",
      "Claude prompts",
      "Gemini prompts",
      "free AI prompts",
      "prompt templates",
      "content creation prompts",
      "marketing prompts",
      "SEO prompts",
      "business prompts"
    ],
    openGraph: {
      title: "All Free AI Prompts - Complete Collection",
      description: "Browse our complete collection of free AI prompts for ChatGPT, Claude, Gemini, and all models.",
      url: "/prompts",
      type: "website",
      siteName: "Free PromptBase",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "AI Prompts Collection"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "All Free AI Prompts - Complete Collection",
      description: "Browse our complete collection of free AI prompts for ChatGPT, Claude, Gemini, and all models.",
      images: ["/og-image.png"]
    }
  }
}

export default async function PromptsPage() {
  try {
    // Load data server-side
    const [dbCategories, approvedPrompts] = await Promise.all([
      getCategories().catch(error => {
        console.error('Categories loading failed:', error)
        return [] as Category[]
      }),
      promptsService.getLightweightPrompts().catch(error => {
        console.error('Prompts loading failed:', error)
        return [] as FirestorePrompt[]
      })
    ])

    // Serialize timestamps for client component
    const serializedPrompts = approvedPrompts.map(prompt => ({
      ...prompt,
      createdAt: prompt.createdAt && typeof prompt.createdAt === 'object' && 'toDate' in prompt.createdAt
        ? prompt.createdAt.toDate().toISOString()
        : prompt.createdAt || new Date().toISOString(),
      updatedAt: prompt.updatedAt && typeof prompt.updatedAt === 'object' && 'toDate' in prompt.updatedAt
        ? prompt.updatedAt.toDate().toISOString()
        : prompt.updatedAt
    }))

    const categorySchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "All Free AI Prompts - Complete Collection",
      "description": "Browse our complete collection of free AI prompts for ChatGPT, Claude, Gemini, and all models. Download tested templates for content creation, marketing, SEO, and business growth.",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || ''}/prompts`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": serializedPrompts.length,
        "itemListElement": serializedPrompts.map((prompt, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || ''}/prompts/${prompt.slug}`
        }))
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": process.env.NEXT_PUBLIC_SITE_URL || ''
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "All Prompts",
            "item": `${process.env.NEXT_PUBLIC_SITE_URL || ''}/prompts`
          }
        ]
      }
    }

    return (
      <main className="min-h-screen bg-background">
        <StructuredData isHomepage={false} customSchema={categorySchema} />

        <div className="px-3 md:px-4 py-8 md:py-16 max-w-7xl mx-auto">
          <PromptsPageClient
            initialPrompts={serializedPrompts}
            initialCategories={dbCategories}
            initialSelectedCategory="All"
          />
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading prompts page:', error)

    // Fallback UI for error cases
    return (
      <main className="min-h-screen bg-background">
        <StructuredData isHomepage={false} />

        <div className="px-3 md:px-4 py-8 md:py-16 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="brutalist-border bg-card p-8 brutalist-shadow">
              <h2 className="text-2xl font-bold mb-4">ALL FREE AI PROMPTS</h2>
              <p className="text-muted-foreground mb-6">
                We're experiencing some technical difficulties. Please check back soon for our complete collection of AI prompts.
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }
}