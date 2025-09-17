"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Trash2, Edit, Eye, Check, X, Trash } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import { adminService } from "@/lib/admin-service"
import { toast } from "react-hot-toast"

export function AdminPromptList() {
  const [prompts, setPrompts] = useState<FirestorePrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deleteProgress, setDeleteProgress] = useState(0)
  const [deleteStage, setDeleteStage] = useState("")
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

  const handleSelectPrompt = (promptId: string, checked: boolean) => {
    if (checked) {
      setSelectedPrompts(prev => [...prev, promptId])
    } else {
      setSelectedPrompts(prev => prev.filter(id => id !== promptId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrompts(prompts.map(prompt => prompt.id!))
    } else {
      setSelectedPrompts([])
    }
  }

  const handleBulkDelete = async () => {
    if (selectedPrompts.length === 0) {
      toast.error('Please select prompts to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedPrompts.length} prompt(s)? This action cannot be undone.`)) {
      return
    }

    setBulkDeleting(true)
    setDeleteProgress(0)
    setDeleteStage("Starting deletion...")

    try {
      await adminService.bulkDeletePrompts(
        selectedPrompts,
        user!.uid,
        (progress, stage) => {
          setDeleteProgress(progress)
          setDeleteStage(stage)
        }
      )
      setPrompts(prev => prev.filter(prompt => !selectedPrompts.includes(prompt.id!)))
      setSelectedPrompts([])
      toast.success(`Successfully deleted ${selectedPrompts.length} prompt(s)`)
    } catch (error) {
      console.error('Error bulk deleting prompts:', error)
      toast.error('Failed to delete prompts')
    } finally {
      setBulkDeleting(false)
      setDeleteProgress(0)
      setDeleteStage("")
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

  const isAllSelected = prompts.length > 0 && selectedPrompts.length === prompts.length
  const isIndeterminate = selectedPrompts.length > 0 && selectedPrompts.length < prompts.length

  return (
    <div className="space-y-4">
      {/* Bulk actions header */}
      {prompts.length > 0 && (
        <div className="brutalist-border bg-card p-4 brutalist-shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-primary"
              />
              <span className="font-bold text-sm">
                {selectedPrompts.length === 0
                  ? 'Select All'
                  : `${selectedPrompts.length} selected`}
              </span>
            </div>

            {selectedPrompts.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="brutalist-border bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
              >
                <Trash className="h-4 w-4 mr-2" />
                {bulkDeleting ? 'Deleting...' : `Delete ${selectedPrompts.length}`}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Progress bar during bulk deletion */}
      {bulkDeleting && (
        <div className="brutalist-border bg-card p-4 brutalist-shadow-sm">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-destructive">
                {deleteStage}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(deleteProgress)}%
              </span>
            </div>
            <Progress
              value={deleteProgress}
              className="h-3 brutalist-border bg-muted"
            />
          </div>
        </div>
      )}

      {prompts.map((prompt) => (
        <div key={prompt.id} className="brutalist-border bg-card p-4 brutalist-shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3 flex-1">
              <Checkbox
                checked={selectedPrompts.includes(prompt.id!)}
                onCheckedChange={(checked) => handleSelectPrompt(prompt.id!, checked as boolean)}
                className="data-[state=checked]:bg-primary"
              />
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
