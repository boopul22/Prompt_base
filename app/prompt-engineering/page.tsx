"use client"

import { useState, useEffect } from "react"
import { PromptCard } from "@/components/prompt-card"
import { StructuredData } from "@/components/structured-data"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import Link from "next/link"

export default function PromptEngineeringPage() {
  const [prompts, setPrompts] = useState<FirestorePrompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const engineeringPrompts = await promptsService.getApprovedPrompts("Prompt Engineering")
        // Serialize timestamps before setting state
        const serializedPrompts = engineeringPrompts.map(prompt => ({
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
        console.error('Error loading prompt engineering guides:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [])

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Prompt Engineering Guides - Learn AI Prompt Optimization",
    "description": "Learn prompt engineering with free guides, tutorials, and best practices. Master AI prompt optimization for ChatGPT, Claude, and other language models.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/prompt-engineering`,
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
          "name": "Prompt Engineering",
          "item": `${process.env.NEXT_PUBLIC_SITE_URL}/prompt-engineering`
        }
      ]
    }
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Master Prompt Engineering",
    "description": "Learn step-by-step how to become proficient in prompt engineering for AI tools like ChatGPT and Claude.",
    "totalTime": "PT2H",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Understand AI Model Capabilities",
        "text": "Learn what different AI models can do and their limitations. This helps you set realistic expectations for your prompts."
      },
      {
        "@type": "HowToStep",
        "name": "Master Clear Instructions",
        "text": "Practice writing clear, specific instructions that tell the AI exactly what you want it to do."
      },
      {
        "@type": "HowToStep",
        "name": "Provide Context and Examples",
        "text": "Include relevant context and examples to help the AI understand your requirements better."
      },
      {
        "@type": "HowToStep",
        "name": "Iterate and Refine",
        "text": "Test your prompts and refine them based on the results. Good prompt engineering is an iterative process."
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
          __html: JSON.stringify(howToSchema)
        }}
      />
      
      <div className="px-3 md:px-4 py-8 md:py-16 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link> / <span>Prompt Engineering</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance">
            Free Prompt Engineering Guides - Learn AI Prompt Optimization
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-pretty max-w-4xl">
            Master prompt engineering with free guides, tutorials, and best practices. Learn how to create effective AI prompts for ChatGPT, Claude, Gemini, and all AI models. Start creating better AI interactions today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Beginner Guides</h3>
              <p className="text-sm text-muted-foreground">Start with the basics of prompt writing and AI interaction fundamentals.</p>
            </div>
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Advanced Techniques</h3>
              <p className="text-sm text-muted-foreground">Learn sophisticated prompting strategies for complex AI tasks.</p>
            </div>
            <div className="brutalist-border bg-card p-4 brutalist-shadow">
              <h3 className="font-bold text-lg mb-2">Best Practices</h3>
              <p className="text-sm text-muted-foreground">Discover proven methods and industry standards for prompt engineering.</p>
            </div>
          </div>

          <div className="brutalist-border bg-accent/10 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Why Learn Prompt Engineering?</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Get better results from AI tools like ChatGPT and Claude</li>
              <li>• Save time on content creation and problem-solving</li>
              <li>• Develop a valuable skill for the AI-driven future</li>
              <li>• Create more consistent and reliable AI outputs</li>
              <li>• Apply prompt engineering to various industries and use cases</li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Prompt Engineering Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">Level 1: Fundamentals</h3>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li>• Understanding AI model capabilities</li>
                <li>• Basic prompt structure and syntax</li>
                <li>• Simple instructions and commands</li>
                <li>• Common pitfalls to avoid</li>
              </ul>
              <p className="text-sm text-accent">Duration: 30 minutes</p>
            </div>
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">Level 2: Intermediate</h3>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li>• Context setting and examples</li>
                <li>• Role-based prompting</li>
                <li>• Chain-of-thought reasoning</li>
                <li>• Prompt templates and patterns</li>
              </ul>
              <p className="text-sm text-accent">Duration: 45 minutes</p>
            </div>
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">Level 3: Advanced</h3>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li>• Multi-step prompting strategies</li>
                <li>• System-level optimization</li>
                <li>• Cross-model compatibility</li>
                <li>• Performance measurement</li>
              </ul>
              <p className="text-sm text-accent">Duration: 60 minutes</p>
            </div>
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">Level 4: Expert</h3>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li>• Custom prompt frameworks</li>
                <li>• Enterprise-scale solutions</li>
                <li>• AI model fine-tuning</li>
                <li>• Research and innovation</li>
              </ul>
              <p className="text-sm text-accent">Duration: 90 minutes</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">LOADING PROMPT ENGINEERING GUIDES...</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Please wait while we fetch the latest guides.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {prompts.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">NO PROMPT ENGINEERING GUIDES FOUND</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Check back later for new prompt engineering guides and tutorials.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Essential Prompt Engineering Techniques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">1. Be Specific and Clear</h3>
              <p className="text-muted-foreground">Provide detailed instructions and specify exactly what you want the AI to do. Avoid vague language and be precise about your requirements.</p>
            </div>
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">2. Provide Context</h3>
              <p className="text-muted-foreground">Give the AI relevant background information, your goals, target audience, and any constraints that should guide the response.</p>
            </div>
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">3. Use Examples</h3>
              <p className="text-muted-foreground">Include examples of what you want (few-shot learning) or what you don't want to help the AI understand your expectations better.</p>
            </div>
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">4. Set the Right Format</h3>
              <p className="text-muted-foreground">Specify the desired output format, structure, length, and style to ensure the AI delivers content in the way you need it.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/marketing" className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-3">Marketing Prompts</h3>
              <p className="text-muted-foreground text-sm">Apply prompt engineering to marketing and advertising campaigns.</p>
            </Link>
            <Link href="/seo-prompts" className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-3">SEO Prompts</h3>
              <p className="text-muted-foreground text-sm">Use prompt engineering to improve search engine optimization efforts.</p>
            </Link>
            <Link href="/chatgpt-prompts" className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-3">ChatGPT Prompts</h3>
              <p className="text-muted-foreground text-sm">Browse our collection of ChatGPT-optimized prompts and templates.</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}