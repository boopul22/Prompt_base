"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit, Plus, Save, X, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { categoriesService, Category, generateCategorySlug } from "@/lib/category-service"
import { adminService } from "@/lib/admin-service"
import { toast } from "react-hot-toast"

export function AdminCategoriesList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isCleaningUp, setIsCleaningUp] = useState(false)
  const { user, userProfile } = useAuth()

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true
  })

  useEffect(() => {
    if (userProfile?.isAdmin) {
      loadCategories()
    }
  }, [userProfile])

  const loadCategories = async () => {
    try {
      const allCategories = await categoriesService.getAllCategories()
      setCategories(allCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.name.trim()) return

    try {
      const slug = generateCategorySlug(formData.name)
      
      if (editingId) {
        // Update existing category
        await categoriesService.updateCategory(editingId, {
          name: formData.name.trim(),
          slug,
          description: formData.description.trim() || undefined,
          isActive: formData.isActive
        })
        toast.success('Category updated successfully!')
        setEditingId(null)
      } else {
        // Create new category
        await categoriesService.createCategory({
          name: formData.name.trim(),
          slug,
          description: formData.description.trim() || undefined,
          isActive: formData.isActive,
          createdBy: user.uid
        })
        toast.success('Category created successfully!')
        setShowAddForm(false)
      }

      // Reset form and reload
      setFormData({ name: "", description: "", isActive: true })
      await loadCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Failed to save category')
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive
    })
    setEditingId(category.id!)
    setShowAddForm(false)
  }

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await categoriesService.deleteCategory(categoryId)
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      toast.success('Category deleted successfully!')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleToggleStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      await categoriesService.toggleCategoryStatus(categoryId, !currentStatus)
      setCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, isActive: !currentStatus }
            : cat
        )
      )
      toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'}!`)
    } catch (error) {
      console.error('Error toggling category status:', error)
      toast.error('Failed to update category status')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setShowAddForm(false)
    setFormData({ name: "", description: "", isActive: true })
  }

  const handleCleanupDuplicates = async () => {
    if (!user) return

    if (!confirm('Are you sure you want to clean up duplicate categories? This will merge categories with the same slug and cannot be undone.')) {
      return
    }

    setIsCleaningUp(true)
    try {
      const result = await adminService.cleanupDuplicateCategories(user.uid)

      if (result.duplicatesFound.length > 0) {
        const cleanupSummary = result.duplicatesFound
          .map(dup => `Kept "${dup.kept}", removed "${dup.removed.join(', ')}"`)
          .join('\n')

        toast.success(`${result.message}\n\nDetails:\n${cleanupSummary}`)
      } else {
        toast.success(result.message)
      }

      // Reload categories
      await loadCategories()
    } catch (error) {
      console.error('Error cleaning up categories:', error)
      toast.error('Failed to clean up duplicate categories')
    } finally {
      setIsCleaningUp(false)
    }
  }

  if (!userProfile?.isAdmin) {
    return (
      <div className="brutalist-border bg-muted p-6 text-center brutalist-shadow-sm">
        <h3 className="text-xl font-bold mb-2">ACCESS DENIED</h3>
        <p className="text-muted-foreground">Admin privileges required.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="brutalist-border bg-card p-6 text-center brutalist-shadow-sm">
        <h3 className="text-xl font-bold mb-2">LOADING CATEGORIES...</h3>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Add Category Button and Cleanup */}
      {!showAddForm && !editingId && (
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddForm(true)}
            className="brutalist-border brutalist-shadow-sm bg-primary text-primary-foreground font-bold"
          >
            <Plus className="h-4 w-4 mr-2" />
            ADD CATEGORY
          </Button>
          <Button
            onClick={handleCleanupDuplicates}
            disabled={isCleaningUp}
            variant="outline"
            className="brutalist-border brutalist-shadow-sm bg-background hover:bg-muted font-bold"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isCleaningUp ? 'animate-spin' : ''}`} />
            {isCleaningUp ? 'CLEANING...' : 'CLEANUP DUPLICATES'}
          </Button>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <form onSubmit={handleSubmit} className="brutalist-border bg-card p-4 brutalist-shadow-sm space-y-4">
          <h3 className="font-bold text-lg">
            {editingId ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
          </h3>
          
          <div>
            <Label htmlFor="categoryName" className="text-sm font-bold">
              CATEGORY NAME *
            </Label>
            <Input
              id="categoryName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Content Creation"
              required
              className="brutalist-border"
            />
          </div>

          <div>
            <Label htmlFor="categoryDescription" className="text-sm font-bold">
              DESCRIPTION
            </Label>
            <Textarea
              id="categoryDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description for this category"
              className="brutalist-border resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="categoryActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="categoryActive" className="text-sm font-bold">
              ACTIVE
            </Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="brutalist-border brutalist-shadow-sm bg-primary text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              {editingId ? 'UPDATE' : 'CREATE'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={cancelEdit}
              className="brutalist-border brutalist-shadow-sm"
            >
              <X className="h-4 w-4 mr-2" />
              CANCEL
            </Button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="brutalist-border bg-card p-4 brutalist-shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <Badge
                    variant={category.isActive ? "default" : "secondary"}
                    className="brutalist-border font-bold text-xs"
                  >
                    {category.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {category.promptCount || 0} prompts
                  </span>
                </div>
                
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Slug: {category.slug} • Created: {
                    category.createdAt && typeof category.createdAt === 'object' && 'toDate' in category.createdAt
                      ? category.createdAt.toDate().toLocaleDateString()
                      : 'Unknown'
                  }
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleStatus(category.id!, category.isActive)}
                  className="brutalist-border bg-background hover:bg-muted p-2"
                >
                  {category.isActive ? '⏸️' : '▶️'}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(category)}
                  className="brutalist-border bg-background hover:bg-muted p-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(category.id!, category.name)}
                  className="brutalist-border bg-destructive text-destructive-foreground hover:bg-destructive/90 p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="brutalist-border bg-muted p-8 text-center brutalist-shadow-sm">
            <h3 className="text-xl font-bold mb-2">NO CATEGORIES YET</h3>
            <p className="text-muted-foreground">Create your first category using the button above.</p>
          </div>
        )}
      </div>
    </div>
  )
}