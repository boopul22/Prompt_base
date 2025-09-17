"use client"

import { useState, useEffect } from "react"
import { PromptCard } from "@/components/prompt-card"
import { StructuredData } from "@/components/structured-data"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import Link from "next/link"

export default function SEOPromptsPage() {
  const [prompts, setPrompts] = useState<FirestorePrompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const seoPrompts = await promptsService.getApprovedPrompts("SEO")
        // Serialize timestamps before setting state
        const serializedPrompts = seoPrompts.map(prompt => ({
          ...prompt,
          createdAt: prompt.createdAt && typeof prompt.createdAt === 'object' && 'toDate' in prompt.createdAt
            ? prompt.createdAt.toDate().toISOString()
            : prompt.createdAt,
          updatedAt: prompt.updatedAt && typeof prompt.updatedAt === 'object' && 'toDate' in prompt.updatedAt
            ? prompt.updatedAt.toDate().toISOString()
            : prompt.updatedAt
        }))
        setPrompts(serializedPrompts)
      } catch (error) {
        console.error('Error loading SEO prompts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [])

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free SEO AI Prompts - ChatGPT Templates & Examples",
    "description": "Download free SEO AI prompts for keyword research, content optimization, and search engine ranking. Browse tested templates for SEO strategy and growth.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/seo-prompts`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": prompts.length,
      "itemListElement": prompts.map((prompt, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/prompts/${prompt.slug}`
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": process.env.NEXT_PUBLIC_SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "SEO Prompts",
          "item": `${process.env.NEXT_PUBLIC_SITE_URL}/seo-prompts`
        }
      ]
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are SEO AI prompts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SEO AI prompts are specialized text instructions designed to help AI tools like ChatGPT create search engine optimized content, conduct keyword research, and develop SEO strategies. Our free collection includes prompts for on-page SEO, technical SEO, and content optimization."
        }
      },
      {
        "@type": "Question",
        "name": "How can AI help with SEO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI can help with SEO by generating keyword-optimized content, creating meta descriptions, suggesting title tags, analyzing competitors, and developing content strategies. Our SEO prompts are tested to produce results that align with search engine best practices."
        }
      },
      {
        "@type": "Question",
        "name": "Are these SEO prompts effective for ranking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our SEO prompts are designed based on current SEO best practices and search engine guidelines. They help create content that targets relevant keywords, provides value to users, and follows technical SEO recommendations."
        }
      }
    ]
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      
      <div className="px-3 md:px-4 py-8 md:py-16 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link> / <span>SEO Prompts</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance">
            Free SEO AI Prompts - Templates & Examples
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-pretty max-w-4xl">
            Download free SEO AI prompts for keyword research, content optimization, and search engine ranking. Browse tested templates for SEO strategy and content marketing. All prompts work with ChatGPT, Claude, Gemini, and other AI models.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Keyword Research</h3>
              <p className="text-sm text-muted-foreground">Discover high-value keywords, analyze search intent, and develop keyword strategies.</p>
            </div>
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Content Optimization</h3>
              <p className="text-sm text-muted-foreground">Create SEO-optimized content that ranks well and engages readers.</p>
            </div>
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Technical SEO</h3>
              <p className="text-sm text-muted-foreground">Generate meta tags, structured data, and technical SEO recommendations.</p>
            </div>
          </div>

          <div className="brutalist-border bg-accent/10 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Boost Your SEO with AI Prompts</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Generate keyword-rich content that ranks higher</li>
              <li>• Create compelling meta descriptions and title tags</li>
              <li>• Develop comprehensive content strategies</li>
              <li>• Analyze competitors and identify content gaps</li>
              <li>• Optimize for featured snippets and voice search</li>
            </ul>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">LOADING SEO PROMPTS...</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Please wait while we fetch the latest SEO prompts.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {prompts.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">NO SEO PROMPTS FOUND</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Check back later for new SEO prompts and templates.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-12 md:mt-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">SEO Prompt Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/chatgpt-prompts" className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors">
                  <h3 className="font-bold text-lg mb-3">ChatGPT Prompts</h3>
                  <p className="text-muted-foreground text-sm">Browse all ChatGPT-optimized prompts for various SEO use cases.</p>
                </Link>
                <Link href="/marketing" className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors">
                  <h3 className="font-bold text-lg mb-3">Marketing Prompts</h3>
                  <p className="text-muted-foreground text-sm">Combine SEO with marketing strategies for better results.</p>
                </Link>
                <Link href="/prompt-engineering" className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors">
                  <h3 className="font-bold text-lg mb-3">Prompt Engineering</h3>
                  <p className="text-muted-foreground text-sm">Learn how to create better prompts for SEO success.</p>
                </Link>
              </div>
            </div>

            <div className="mt-12 md:mt-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">SEO Best Practices with AI</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">1. Keyword Integration</h3>
                  <p className="text-muted-foreground">Use our prompts to naturally integrate target keywords into content while maintaining readability and user value.</p>
                </div>
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">2. Content Structure</h3>
                  <p className="text-muted-foreground">Create well-structured content with proper headings, meta descriptions, and internal linking strategies.</p>
                </div>
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">3. User Intent</h3>
                  <p className="text-muted-foreground">Develop content that matches search intent and provides comprehensive answers to user queries.</p>
                </div>
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">4. Technical Optimization</h3>
                  <p className="text-muted-foreground">Generate technical SEO elements like schema markup, alt text, and URL structures.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}