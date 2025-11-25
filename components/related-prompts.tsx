import { PromptCard } from "@/components/prompt-card"
import type { Prompt } from "@/lib/prompts-data"
import type { FirestorePrompt } from "@/lib/firestore-service"

interface RelatedPromptsProps {
  prompts: (Prompt | FirestorePrompt)[]
}

export function RelatedPrompts({ prompts }: RelatedPromptsProps) {
  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-6">RELATED PROMPTS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </section>
  )
}
