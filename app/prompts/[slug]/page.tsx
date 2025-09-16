import { notFound } from "next/navigation"
import { mockPrompts } from "@/lib/prompts-data"
import { PromptDetail } from "@/components/prompt-detail"
import { RelatedPrompts } from "@/components/related-prompts"
import type { Metadata } from "next"

interface PromptPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const prompt = mockPrompts.find((p) => p.slug === params.slug)

  if (!prompt) {
    return {
      title: "Prompt Not Found - Viral Prompts",
      description: "The requested prompt could not be found.",
    }
  }

  return {
    title: `${prompt.title} - Viral Prompts`,
    description: prompt.description,
    keywords: [...prompt.tags, "AI prompt", "viral content", prompt.category],
    openGraph: {
      title: `${prompt.title} - Viral Prompts`,
      description: prompt.description,
      type: "article",
      publishedTime: prompt.createdAt,
      tags: prompt.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${prompt.title} - Viral Prompts`,
      description: prompt.description,
    },
  }
}

export async function generateStaticParams() {
  return mockPrompts.map((prompt) => ({
    slug: prompt.slug,
  }))
}

export default function PromptPage({ params }: PromptPageProps) {
  const prompt = mockPrompts.find((p) => p.slug === params.slug)

  if (!prompt) {
    notFound()
  }

  const relatedPrompts = mockPrompts.filter((p) => p.id !== prompt.id && p.category === prompt.category).slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <PromptDetail prompt={prompt} />
        {relatedPrompts.length > 0 && <RelatedPrompts prompts={relatedPrompts} />}
      </div>
    </main>
  )
}
