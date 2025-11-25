"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Save, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { BlogCategory, blogCategoriesService, generateBlogSlug } from "@/lib/blog-service"
import { toast } from "react-hot-toast"

interface CategoryFormData {
  name: string
  slug: string
  description: string
  color: string
}

export function AdminBlogCategories() {
  const [categories, setCategories] = useState<(BlogCategory & { createdAt: string, updatedAt?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    color: '#3b82f6'
  })
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    if (user && userProfile?.isAdmin) {
      loadCategories()
    }
  }, [user, userProfile])

  useEffect(() => {
    if (autoGenerateSlug && formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: generateBlogSlug(formData.name)
      }))
    }
  }, [formData.name, autoGenerateSlug])

  const loadCategories = async () => {
    try {
      const allCategories = await blogCategoriesService.getAllCategories()

      // Serialize timestamps for client components
      const serializedCategories = allCategories.map(category => ({
        ...category,
        createdAt: category.createdAt && typeof category.createdAt === 'object' && 'toDate' in category.createdAt
          ? category.createdAt.toDate().toISOString()
          : category.createdAt || new Date().toISOString(),
        updatedAt: category.updatedAt && typeof category.updatedAt === 'object' && 'toDate' in category.updatedAt
          ? category.updatedAt.toDate().toISOString()
          : category.updatedAt
      }))

      setCategories(serializedCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Please enter a category name')
      return
    }

    if (!formData.slug.trim()) {
      toast.error('Please enter a category slug')
      return
    }

    try {
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        color: formData.color
      }

      if (editingCategory?.id) {
        await blogCategoriesService.updateCategory(editingCategory.id, categoryData)
        toast.success('Category updated successfully')
      } else {
        await blogCategoriesService.createCategory(categoryData)
        toast.success('Category created successfully')
      }

      resetForm()
      loadCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Failed to save category')
    }
  }

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#3b82f6'
    })
    setAutoGenerateSlug(false)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        await blogCategoriesService.deleteCategory(id)
        setCategories((prev) => prev.filter((category) => category.id !== id))
        toast.success('Category deleted successfully')
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Failed to delete category')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#3b82f6'
    })
    setEditingCategory(null)
    setShowForm(false)
    setAutoGenerateSlug(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
        <p className="text-muted-foreground">Fetching categories...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Categories</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="brutalist-border bg-card p-6 brutalist-shadow">
          <h3 className="text-lg font-bold mb-4">
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter category name"
                className="brutalist-border"
                required
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="slug">Category Slug *</Label>
                <input
                  type="checkbox"
                  checked={autoGenerateSlug}
                  onChange={(e) => setAutoGenerateSlug(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">Auto-generate</span>
              </div>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="url-friendly-slug"
                className="brutalist-border"
                disabled={autoGenerateSlug}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the category"
                className="brutalist-border"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="color">Category Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-12 h-10 brutalist-border cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="#3b82f6"
                  className="brutalist-border"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="brutalist-border bg-green-600 text-white hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="brutalist-border"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {categories.map((category) => (
          <div key={category.id} className="brutalist-border bg-card p-4 brutalist-shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full brutalist-border"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <Badge variant="secondary" className="brutalist-border">
                    {category.postCount} posts
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">Slug:</span> {category.slug}
                </div>

                {category.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                )}

                <div className="text-xs text-muted-foreground">
                  Created: {formatDate(category.createdAt)}
                  {category.updatedAt && (
                    <span> • Updated: {formatDate(category.updatedAt)}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="brutalist-border bg-background hover:bg-muted p-2"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  className="brutalist-border bg-destructive text-destructive-foreground hover:bg-destructive/90 p-2"
                  onClick={() => handleDelete(category.id!)}
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
            <p className="text-muted-foreground mb-4">Create your first blog category to organize posts.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Category
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}