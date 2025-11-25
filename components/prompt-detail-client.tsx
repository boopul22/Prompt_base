"use client"

import { PromptDetail } from "@/components/prompt-detail"
import { RelatedPrompts } from "@/components/related-prompts"
import { StructuredData } from "@/components/structured-data"
import type { FirestorePrompt, UserProfile } from "@/lib/firestore-service"

interface PromptDetailClientProps {
  prompt: FirestorePrompt
  creator: UserProfile | null
  relatedPrompts: FirestorePrompt[]
}

export function PromptDetailClient({ prompt, creator, relatedPrompts }: PromptDetailClientProps) {
  return (
    <>
      <StructuredData prompt={prompt} creator={creator} />
      <PromptDetail prompt={prompt} creator={creator} />
      {relatedPrompts.length > 0 && <RelatedPrompts prompts={relatedPrompts} />}
    </>
  )
}