"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { PromptDetail } from "@/components/prompt-detail"
import { RelatedPrompts } from "@/components/related-prompts"
import { promptsService, FirestorePrompt, usersService, UserProfile } from "@/lib/firestore-service"

interface PromptPageProps {
  params: {
    slug: string
  }
}

export default function PromptPage({ params }: PromptPageProps) {
  const [prompt, setPrompt] = useState<FirestorePrompt | null>(null)
  const [creator, setCreator] = useState<UserProfile | null>(null)
  const [relatedPrompts, setRelatedPrompts] = useState<FirestorePrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    async function loadPrompt() {
      try {
        const foundPrompt = await promptsService.getPromptBySlug(params.slug)
        
        if (!foundPrompt) {
          setNotFoundError(true)
          return
        }

        setPrompt(foundPrompt)

        // Get creator details
        if (foundPrompt.createdBy) {
          const creatorData = await usersService.getUserById(foundPrompt.createdBy)
          setCreator(creatorData)
        }

        // Get related prompts from the same category
        const allPrompts = await promptsService.getApprovedPrompts(foundPrompt.category)
        const related = allPrompts.filter((p) => p.id !== foundPrompt.id).slice(0, 3)
        setRelatedPrompts(related)
      } catch (error) {
        console.error('Error loading prompt:', error)
        setNotFoundError(true)
      } finally {
        setLoading(false)
      }
    }

    loadPrompt()
  }, [params.slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
          <div className="brutalist-border bg-card p-8 brutalist-shadow text-center">
            <h3 className="text-2xl font-bold mb-2">LOADING...</h3>
            <p className="text-muted-foreground">Fetching prompt details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (notFoundError || !prompt) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <PromptDetail prompt={prompt} creator={creator} />
        {relatedPrompts.length > 0 && <RelatedPrompts prompts={relatedPrompts} />}
      </div>
    </main>
  )
}
