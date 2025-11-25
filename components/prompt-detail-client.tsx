"use client"

import { PromptDetail } from "@/components/prompt-detail"
import { RelatedPrompts } from "@/components/related-prompts"
import { AdPlaceholder } from "@/components/AdPlaceholder"
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
      <div className="mb-8">
        <AdPlaceholder height="120px" label="Sponsored Content" />
      </div>
      <PromptDetail prompt={prompt} creator={creator} />
      <div className="my-8">
        <AdPlaceholder height="200px" label="Sponsored Content" />
      </div>
      {relatedPrompts.length > 0 && <RelatedPrompts prompts={relatedPrompts} />}
    </>
  )
}