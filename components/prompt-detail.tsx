"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, ArrowLeft, Share2, User, Shield, Twitter, Linkedin, Github, Globe } from "lucide-react"
import Link from "next/link"
import type { Prompt } from "@/lib/prompts-data"
import type { FirestorePrompt, UserProfile } from "@/lib/firestore-service"

interface PromptDetailProps {
  prompt: Prompt | FirestorePrompt
  creator?: UserProfile | null
}

export function PromptDetail({ prompt, creator }: PromptDetailProps) {
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
          variant="brutalist"
          className="font-bold"
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
          <span className="text-sm text-muted-foreground">
            Added {new Date(prompt.createdAt as string).toLocaleDateString()}
          </span>
          {creator && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">by</span>
              <Badge
                variant={creator.isAdmin ? "default" : "secondary"}
                className={`brutalist-border font-bold text-xs ${
                  creator.isAdmin 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {creator.isAdmin ? (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    ADMIN
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    USER
                  </>
                )}
              </Badge>
              <span className="text-sm font-medium">
                {creator.displayName || creator.email}
              </span>
            </div>
          )}
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

      {/* Example Images */}
      {(prompt as any).images && (prompt as any).images.length > 0 && (
        <section className="mb-8">
          <div className="brutalist-border bg-card p-6 brutalist-shadow">
            <h2 className="text-2xl font-bold mb-4">EXAMPLE RESULTS</h2>
            <p className="text-muted-foreground mb-6">
              Here are some example outputs created using this prompt:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(prompt as any).images.map((imageUrl: string, index: number) => (
                <div key={index} className="brutalist-border bg-background p-2 brutalist-shadow-sm">
                  <img
                    src={imageUrl}
                    alt={`Example result ${index + 1} for ${prompt.title}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* Creator Profile Section */}
      {creator && (
        <section className="mb-8">
          <div className="brutalist-border bg-card p-6 brutalist-shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              {creator.isAdmin ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
              ABOUT THE CREATOR
            </h3>
            
            <div className="space-y-4">
              {/* Creator Basic Info */}
              <div className="flex items-start gap-4">
                {creator.avatar && (
                  <div className="brutalist-border bg-background p-1 brutalist-shadow-sm">
                    <img
                      src={creator.avatar}
                      alt={creator.displayName || "Creator"}
                      className="w-16 h-16 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-bold">
                      {creator.displayName || creator.email}
                    </h4>
                    <Badge
                      variant={creator.isAdmin ? "default" : "secondary"}
                      className={`brutalist-border font-bold text-xs ${
                        creator.isAdmin 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {creator.isAdmin ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          ADMIN
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1" />
                          USER
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  {creator.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {creator.bio}
                    </p>
                  )}

                  {/* Social Media Links */}
                  {creator.socialMedia && (
                    <div className="flex flex-wrap gap-2">
                      {creator.socialMedia.twitter && (
                        <a
                          href={creator.socialMedia.twitter.startsWith('http') 
                            ? creator.socialMedia.twitter 
                            : `https://twitter.com/${creator.socialMedia.twitter.replace('@', '')}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="brutalist-border bg-background hover:bg-muted p-2 brutalist-shadow-sm transition-all transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      
                      {creator.socialMedia.linkedin && (
                        <a
                          href={creator.socialMedia.linkedin.startsWith('http') 
                            ? creator.socialMedia.linkedin 
                            : `https://linkedin.com/in/${creator.socialMedia.linkedin}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="brutalist-border bg-background hover:bg-muted p-2 brutalist-shadow-sm transition-all transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      
                      {creator.socialMedia.github && (
                        <a
                          href={creator.socialMedia.github.startsWith('http') 
                            ? creator.socialMedia.github 
                            : `https://github.com/${creator.socialMedia.github}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="brutalist-border bg-background hover:bg-muted p-2 brutalist-shadow-sm transition-all transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      
                      {creator.socialMedia.website && (
                        <a
                          href={creator.socialMedia.website.startsWith('http') 
                            ? creator.socialMedia.website 
                            : `https://${creator.socialMedia.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="brutalist-border bg-background hover:bg-muted p-2 brutalist-shadow-sm transition-all transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
