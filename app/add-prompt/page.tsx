"use client"

import { AddPromptForm } from "@/components/add-prompt-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function AddPromptPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="brutalist-border bg-card p-8 brutalist-shadow text-center">
          <h3 className="text-2xl font-bold mb-2">LOADING...</h3>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            asChild
            variant="outline"
            className="brutalist-border brutalist-shadow-sm bg-background hover:bg-muted font-bold mb-4 md:mb-6 text-sm md:text-base"
          >
            <Link href="/">
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              BACK TO HOME
            </Link>
          </Button>

          <div className="brutalist-border-thick bg-primary text-primary-foreground p-4 md:p-8 brutalist-shadow transform -rotate-1 mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
              CONTRIBUTE YOUR PROMPT
            </h1>
            <p className="text-base md:text-xl">
              Share your amazing AI prompts with the community
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          {!user ? (
            <div className="brutalist-border-thick bg-card p-8 brutalist-shadow text-center">
              <h3 className="text-2xl font-bold mb-4">SIGN IN TO CONTINUE</h3>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to submit prompts to our community collection.
              </p>
              <p className="text-sm text-muted-foreground">
                Click the "SIGN IN" button in the navigation menu above to get started.
              </p>
            </div>
          ) : (
            <>
              <div className="brutalist-border bg-muted p-4 mb-6 brutalist-shadow-sm">
                <h3 className="font-bold text-lg mb-2">📝 SUBMISSION GUIDELINES</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Write clear, specific prompts that produce great results</li>
                  <li>• Include relevant tags to help others discover your prompt</li>
                  <li>• All submissions are reviewed before going live</li>
                  <li>• Admin users can approve prompts instantly</li>
                </ul>
              </div>

              <AddPromptForm />
            </>
          )}
        </div>
      </div>
    </main>
  )
}