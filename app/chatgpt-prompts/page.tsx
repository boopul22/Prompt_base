"use client"

import { useState, useEffect } from "react"
import { PromptCard } from "@/components/prompt-card"
import { StructuredData } from "@/components/structured-data"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import { Metadata } from "next"
import Link from "next/link"

export default function ChatGPTPromptsPage() {
  const [prompts, setPrompts] = useState<FirestorePrompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const chatGPTPrompts = await promptsService.getApprovedPrompts("ChatGPT")
        // Serialize timestamps before setting state
        const serializedPrompts = chatGPTPrompts.map(prompt => ({
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
        console.error('Error loading ChatGPT prompts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [])

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free ChatGPT Prompts - Templates & Examples",
    "description": "Download free ChatGPT prompts for content creation, marketing, SEO, and business. Browse tested templates, examples, and guides for better AI results.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/chatgpt-prompts`,
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
          "name": "ChatGPT Prompts",
          "item": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/chatgpt-prompts`
        }
      ]
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema)
        }}
      />
      
      <div className="px-3 md:px-4 py-8 md:py-16 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link> / <span>ChatGPT Prompts</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance">
            Free ChatGPT Prompts - Templates & Examples
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-pretty max-w-4xl">
            Download free ChatGPT prompts for content creation, marketing, SEO, and business. Browse tested templates, examples, and guides for better AI results. All prompts are optimized for GPT-4 and GPT-3.5, and many work with other AI models like Claude and Gemini.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Marketing Prompts</h3>
              <p className="text-sm text-muted-foreground">Create compelling marketing copy, social media posts, and email campaigns.</p>
            </div>
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Content Creation</h3>
              <p className="text-sm text-muted-foreground">Generate blog posts, articles, and creative content that engages your audience.</p>
            </div>
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">SEO Optimization</h3>
              <p className="text-sm text-muted-foreground">Optimize your content for search engines with keyword-rich prompts.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">LOADING CHATGPT PROMPTS...</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Please wait while we fetch the latest ChatGPT prompts.
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
                  <h3 className="text-xl md:text-2xl font-bold mb-2">NO CHATGPT PROMPTS FOUND</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Check back later for new ChatGPT prompts and templates.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-12 md:mt-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">How to Use ChatGPT Prompts Effectively</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">1. Copy and Customize</h3>
                  <p className="text-muted-foreground">Copy any prompt template and customize it for your specific needs. Replace placeholder text with your own context and requirements.</p>
                </div>
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">2. Provide Clear Context</h3>
                  <p className="text-muted-foreground">Give ChatGPT clear context about your goals, audience, and desired output format for better results.</p>
                </div>
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">3. Iterate and Refine</h3>
                  <p className="text-muted-foreground">Use follow-up prompts to refine the output. Ask ChatGPT to make specific improvements or adjustments.</p>
                </div>
                <div className="brutalist-border bg-card p-6 brutalist-shadow">
                  <h3 className="font-bold text-lg mb-3">4. Test Different Variations</h3>
                  <p className="text-muted-foreground">Try different prompt variations to find what works best for your specific use case and writing style.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}