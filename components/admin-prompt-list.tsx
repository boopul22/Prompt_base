"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, Check, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import { adminService } from "@/lib/admin-service"
import { toast } from "react-hot-toast"

export function AdminPromptList() {
  const [prompts, setPrompts] = useState<FirestorePrompt[]>([])
  const [loading, setLoading] = useState(true)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    if (user && userProfile?.isAdmin) {
      loadPrompts()
    }
  }, [user, userProfile])

  const loadPrompts = async () => {
    try {
      const allPrompts = await promptsService.getAllPrompts()
      setPrompts(allPrompts)
    } catch (error) {
      console.error('Error loading prompts:', error)
      toast.error('Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      try {
        await promptsService.deletePrompt(id)
        setPrompts((prev) => prev.filter((prompt) => prompt.id !== id))
        toast.success('Prompt deleted successfully')
      } catch (error) {
        console.error('Error deleting prompt:', error)
        toast.error('Failed to delete prompt')
      }
    }
  }

  const handleApprove = async (promptId: string) => {
    if (!user) return
    
    try {
      await adminService.approvePrompt(promptId, user.uid)
      await loadPrompts() // Reload prompts
      toast.success('Prompt approved successfully')
    } catch (error) {
      console.error('Error approving prompt:', error)
      toast.error('Failed to approve prompt')
    }
  }

  const handleReject = async (promptId: string) => {
    if (!user) return
    
    try {
      await adminService.rejectPrompt(promptId, user.uid)
      await loadPrompts() // Reload prompts
      toast.success('Prompt rejected')
    } catch (error) {
      console.error('Error rejecting prompt:', error)
      toast.error('Failed to reject prompt')
    }
  }

  if (!userProfile?.isAdmin) {
    return (
      <div className="brutalist-border bg-muted p-8 text-center brutalist-shadow-sm">
        <h3 className="text-xl font-bold mb-2">ACCESS DENIED</h3>
        <p className="text-muted-foreground">You need admin privileges to view this section.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="brutalist-border bg-muted p-8 text-center brutalist-shadow-sm">
        <h3 className="text-xl font-bold mb-2">LOADING...</h3>
        <p className="text-muted-foreground">Fetching prompts...</p>
      </div>
    )
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
                <Badge
                  variant={
                    prompt.status === 'approved' ? 'default' : 
                    prompt.status === 'pending' ? 'secondary' : 
                    'destructive'
                  }
                  className="brutalist-border font-bold text-xs"
                >
                  {prompt.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {prompt.createdAt && typeof prompt.createdAt === 'object' && 'toDate' in prompt.createdAt
                    ? prompt.createdAt.toDate().toLocaleDateString()
                    : new Date().toLocaleDateString()
                  }
                </span>
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
              {prompt.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    className="brutalist-border bg-green-600 text-white hover:bg-green-700 p-2"
                    onClick={() => handleApprove(prompt.id!)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="brutalist-border bg-red-600 text-white hover:bg-red-700 p-2"
                    onClick={() => handleReject(prompt.id!)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <Button asChild size="sm" variant="outline" className="brutalist-border bg-background hover:bg-muted p-2">
                <Link href={`/prompts/${prompt.slug}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button
                size="sm"
                variant="destructive"
                className="brutalist-border bg-destructive text-destructive-foreground hover:bg-destructive/90 p-2"
                onClick={() => handleDelete(prompt.id!)}
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
