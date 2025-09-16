"use client"

import { useState } from "react"
import { mockPrompts } from "@/lib/prompts-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye } from "lucide-react"
import Link from "next/link"

export function AdminPromptList() {
  const [prompts, setPrompts] = useState(mockPrompts)

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      setPrompts((prev) => prev.filter((prompt) => prompt.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => (
        <div key={prompt.id} className="brutalist-border bg-card p-4 brutalist-shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="brutalist-border bg-accent text-accent-foreground font-bold text-xs"
                >
                  {prompt.category.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">{new Date(prompt.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{prompt.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty">{prompt.description}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-1">
              {prompt.tags.map((tag) => (
                <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 brutalist-border">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" className="brutalist-border bg-background hover:bg-muted p-2">
                <Link href={`/prompts/${prompt.slug}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="brutalist-border bg-background hover:bg-muted p-2"
                onClick={() => alert("Edit functionality coming soon!")}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="brutalist-border bg-destructive text-destructive-foreground hover:bg-destructive/90 p-2"
                onClick={() => handleDelete(prompt.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {prompts.length === 0 && (
        <div className="brutalist-border bg-muted p-8 text-center brutalist-shadow-sm">
          <h3 className="text-xl font-bold mb-2">NO PROMPTS YET</h3>
          <p className="text-muted-foreground">Add your first viral prompt using the form on the left.</p>
        </div>
      )}
    </div>
  )
}
