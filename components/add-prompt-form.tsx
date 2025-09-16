"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories } from "@/lib/prompts-data"
import { Plus, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { promptsService, generateSlug } from "@/lib/firestore-service"
import { toast } from "react-hot-toast"

export function AddPromptForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    fullPrompt: "",
    tags: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { user, userProfile } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to add prompts')
      return
    }

    setIsSubmitting(true)

    try {
      const tags = formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      const slug = generateSlug(formData.title)
      
      // For admins, prompts are auto-approved. For regular users, they're pending
      const status = userProfile?.isAdmin ? 'approved' : 'pending'

      const promptData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fullPrompt: formData.fullPrompt,
        slug,
        tags,
        status,
        createdBy: user.uid,
        ...(userProfile?.isAdmin && { approvedBy: user.uid })
      }

      await promptsService.createPrompt(promptData as any)

      setSubmitted(true)
      toast.success(userProfile?.isAdmin ? 'Prompt added successfully!' : 'Prompt submitted for review!')

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          fullPrompt: "",
          tags: "",
        })
        setSubmitted(false)
      }, 2000)

    } catch (error: any) {
      console.error('Error adding prompt:', error)
      toast.error('Failed to add prompt. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <div className="brutalist-border-thick bg-card p-8 brutalist-shadow text-center">
        <h3 className="text-2xl font-bold mb-2">SIGN IN REQUIRED</h3>
        <p className="text-muted-foreground">Please sign in to add prompts to the collection.</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="brutalist-border-thick bg-card p-8 brutalist-shadow text-center">
        <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">PROMPT ADDED!</h3>
        <p className="text-muted-foreground">Your viral prompt has been successfully added to the collection.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="brutalist-border-thick bg-card p-6 brutalist-shadow space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-bold">
          PROMPT TITLE *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Ultimate Content Creator"
          required
          className="brutalist-border bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-bold">
          SHORT DESCRIPTION *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief description of what this prompt does..."
          required
          rows={3}
          className="brutalist-border bg-background resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-bold">
          CATEGORY *
        </Label>
        <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
          <SelectTrigger className="brutalist-border bg-background">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter((cat) => cat !== "All")
              .map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-bold">
          TAGS
        </Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
          placeholder="content, viral, social media (comma separated)"
          className="brutalist-border bg-background"
        />
        <p className="text-xs text-muted-foreground">Separate tags with commas</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullPrompt" className="text-sm font-bold">
          FULL PROMPT *
        </Label>
        <Textarea
          id="fullPrompt"
          value={formData.fullPrompt}
          onChange={(e) => handleChange("fullPrompt", e.target.value)}
          placeholder="Enter the complete AI prompt here..."
          required
          rows={8}
          className="brutalist-border bg-background resize-none font-mono text-sm"
        />
      </div>

      <Button
        type="submit"
        disabled={
          isSubmitting || !formData.title || !formData.description || !formData.category || !formData.fullPrompt
        }
        className="w-full brutalist-border-thick brutalist-shadow bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          "ADDING PROMPT..."
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            ADD PROMPT
          </>
        )}
      </Button>
    </form>
  )
}
