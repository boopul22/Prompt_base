"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import type { Prompt } from "@/lib/prompts-data"

interface PromptDetailProps {
  prompt: Prompt
}

export function PromptDetail({ prompt }: PromptDetailProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.fullPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.description,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert("URL copied to clipboard!")
      } catch (err) {
        console.error("Failed to copy URL: ", err)
      }
    }
  }

  return (
    <article>
      {/* Back Navigation */}
      <div className="mb-8">
        <Button
          asChild
          variant="outline"
          className="brutalist-border brutalist-shadow-sm bg-background hover:bg-muted font-bold"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK TO PROMPTS
          </Link>
        </Button>
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Badge
            variant="secondary"
            className="brutalist-border bg-accent text-accent-foreground font-bold px-4 py-2 text-sm"
          >
            {prompt.category.toUpperCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">Added {new Date(prompt.createdAt).toLocaleDateString()}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{prompt.title}</h1>

        <p className="text-xl text-muted-foreground mb-6 text-pretty leading-relaxed">{prompt.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {prompt.tags.map((tag) => (
            <span key={tag} className="text-sm bg-muted text-muted-foreground px-3 py-1 brutalist-border font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Prompt Content */}
      <section className="mb-8">
        <div className="brutalist-border-thick bg-card p-6 brutalist-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">THE PROMPT</h2>
            {/* Desktop Buttons */}
            <div className="hidden sm:flex sm:flex-row gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="brutalist-border bg-background hover:bg-muted"
              >
                <Share2 className="h-4 w-4 mr-2" />
                SHARE
              </Button>
              <Button
                onClick={handleCopy}
                size="sm"
                className="brutalist-border bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    COPIED!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    COPY PROMPT
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="brutalist-border bg-background p-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">{prompt.fullPrompt}</pre>
          </div>

          {/* Mobile Buttons */}
          <div className="sm:hidden flex flex-col gap-2 mt-4">
            <Button
              onClick={handleCopy}
              size="sm"
              className="brutalist-border bg-primary text-primary-foreground hover:bg-primary/90 font-bold w-full"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  COPIED!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  COPY PROMPT
                </>
              )}
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="brutalist-border bg-background hover:bg-muted w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              SHARE
            </Button>
          </div>
        </div>
      </section>

      {/* Usage Tips */}
      <section className="mb-8">
        <div className="brutalist-border bg-muted p-6 brutalist-shadow-sm">
          <h3 className="text-xl font-bold mb-4">HOW TO USE THIS PROMPT</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              Copy the prompt above using the copy button
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              Paste it into your favorite AI tool (ChatGPT, Claude, etc.)
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              Customize it with your specific topic or requirements
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              Generate amazing content and share your results!
            </li>
          </ul>
        </div>
      </section>
    </article>
  )
}
