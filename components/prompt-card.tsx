"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"
import Link from "next/link"
import type { Prompt } from "@/lib/prompts-data"
import type { FirestorePrompt } from "@/lib/firestore-service"

interface PromptCardProps {
  prompt: Prompt | FirestorePrompt
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await navigator.clipboard.writeText(prompt.fullPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Link href={`/prompts/${prompt.slug}`}>
      <article className="brutalist-border bg-card p-4 md:p-6 brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <Badge
            variant="secondary"
            className="brutalist-border bg-accent text-accent-foreground font-bold px-2 md:px-3 py-1 text-xs md:text-sm"
          >
            {prompt.category.toUpperCase()}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="brutalist-border bg-background hover:bg-muted p-1.5 md:p-2"
          >
            {copied ? (
              <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            ) : (
              <Copy className="h-3 w-3 md:h-4 md:w-4" />
            )}
          </Button>
        </div>

        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-balance group-hover:text-primary transition-colors">
          {prompt.title}
        </h3>

        <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base text-pretty leading-relaxed">
          {prompt.description.length > 120
            ? `${prompt.description.substring(0, 120)}...`
            : prompt.description}
        </p>

        {/* Preview Image */}
        {(prompt as any).images && (prompt as any).images.length > 0 && (
          <div className="mb-3 md:mb-4">
            <div className="brutalist-border bg-background p-1 inline-block">
              <img
                src={(prompt as any).images[0]}
                alt={`Preview for ${prompt.title}`}
                className="w-20 h-16 md:w-24 md:h-20 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            {(prompt as any).images.length > 1 && (
              <span className="text-xs text-muted-foreground ml-2">
                +{(prompt as any).images.length - 1} more
              </span>
            )}
          </div>
        )}


        <div className="text-xs md:text-sm text-muted-foreground">
          Added {
            prompt.createdAt 
              ? new Date(prompt.createdAt as string).toLocaleDateString()
              : 'Recently'
          }
        </div>
      </article>
    </Link>
  )
}
