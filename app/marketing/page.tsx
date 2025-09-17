"use client"

import { useState, useEffect } from "react"
import { PromptCard } from "@/components/prompt-card"
import { StructuredData } from "@/components/structured-data"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import Link from "next/link"

export default function MarketingPromptsPage() {
  const [prompts, setPrompts] = useState<FirestorePrompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const marketingPrompts = await promptsService.getApprovedPrompts("Marketing")
        setPrompts(marketingPrompts)
      } catch (error) {
        console.error('Error loading marketing prompts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [])

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Marketing AI Prompts - ChatGPT Templates & Examples",
    "description": "Download free marketing AI prompts for content creation, social media, email campaigns, and advertising. Browse tested templates for marketing strategy and growth.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/marketing`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": prompts.length,
      "itemListElement": prompts.map((prompt, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/prompts/${prompt.slug}`
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Marketing Prompts",
          "item": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/marketing`
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
        "name": "What are marketing AI prompts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Marketing AI prompts are pre-written text instructions designed to help AI tools like ChatGPT create effective marketing content, strategies, and campaigns. Our free collection includes prompts for social media, email marketing, content creation, and advertising."
        }
      },
      {
        "@type": "Question",
        "name": "How can I use AI prompts for marketing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use our marketing AI prompts to generate social media posts, email campaigns, blog content, ad copy, and marketing strategies. Each prompt is tested and optimized for specific marketing goals and target audiences."
        }
      },
      {
        "@type": "Question",
        "name": "Are these marketing prompts really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our marketing AI prompts are completely free to use. We provide open access to thousands of tested marketing templates and prompts without any cost or registration requirements."
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
            <a href="/" className="hover:text-foreground">Home</a> / <span>Marketing Prompts</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance">
            Free Marketing AI Prompts - Templates & Examples
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-pretty max-w-4xl">
            Download free marketing AI prompts for content creation, social media, email campaigns, and advertising. Browse tested templates for marketing strategy and business growth. All prompts work with ChatGPT, Claude, Gemini, and other AI models.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Social Media Marketing</h3>
              <p className="text-sm text-muted-foreground">Create engaging social media posts, captions, and content calendars for all platforms.</p>
            </div>
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Email Marketing</h3>
              <p className="text-sm text-muted-foreground">Generate high-converting email campaigns, newsletters, and automated sequences.</p>
            </div>
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Content Marketing</h3>
              <p className="text-sm text-muted-foreground">Develop blog posts, articles, and content strategies that drive engagement.</p>
            </div>
          </div>

          <div className="brutalist-border bg-accent/10 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Why Use Free Marketing AI Prompts?</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Save time creating marketing content from scratch</li>
              <li>• Access proven templates that drive results</li>
              <li>• Learn prompt engineering best practices for marketing</li>
              <li>• Customize prompts for your specific business needs</li>
              <li>• Improve consistency across your marketing channels</li>
            </ul>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">LOADING MARKETING PROMPTS...</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Please wait while we fetch the latest marketing prompts.
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
                  <h3 className="text-xl md:text-2xl font-bold mb-2">NO MARKETING PROMPTS FOUND</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Check back later for new marketing prompts and templates.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-12 md:mt-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Marketing Prompt Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/chatgpt-prompts" className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors">
                  <h3 className="font-bold text-lg mb-3">ChatGPT Prompts</h3>
                  <p className="text-muted-foreground text-sm">Browse all ChatGPT-optimized prompts for various marketing use cases.</p>
                </Link>
                <Link href="/seo-prompts" className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors">
                  <h3 className="font-bold text-lg mb-3">SEO Prompts</h3>
                  <p className="text-muted-foreground text-sm">Optimize your content for search engines with SEO-focused prompts.</p>
                </Link>
                <Link href="/prompt-engineering" className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors">
                  <h3 className="font-bold text-lg mb-3">Prompt Engineering</h3>
                  <p className="text-muted-foreground text-sm">Learn how to create better prompts for marketing success.</p>
                </Link>
              </div>
            </div>

            <div className="mt-12 md:mt-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">How to Use Marketing AI Prompts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">1. Choose Your Goal</h3>
                  <p className="text-muted-foreground">Select prompts based on your marketing objectives - brand awareness, lead generation, or sales conversion.</p>
                </div>
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">2. Customize for Your Brand</h3>
                  <p className="text-muted-foreground">Replace placeholder text with your brand voice, target audience, and specific product details.</p>
                </div>
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">3. Test and Iterate</h3>
                  <p className="text-muted-foreground">Use A/B testing to refine prompts and optimize for better engagement and conversion rates.</p>
                </div>
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">4. Track Results</h3>
                  <p className="text-muted-foreground">Monitor performance metrics to understand which prompts generate the best results for your campaigns.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}