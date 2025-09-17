"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Save, Eye, Archive } from "lucide-react"
import { BlogPost, blogService, blogCategoriesService, BlogCategory, generateBlogSlug, calculateReadTime, generateExcerpt } from "@/lib/blog-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"

interface BlogPostFormProps {
  post?: BlogPost
  onSave?: () => void
  onCancel?: () => void
}

export function BlogPostForm({ post, onSave, onCancel }: BlogPostFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    featuredImage: '',
    category: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published' | 'archived',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[]
    }
  })

  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [newTag, setNewTag] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true)
  const [autoGenerateExcerpt, setAutoGenerateExcerpt] = useState(true)

  useEffect(() => {
    loadCategories()

    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        featuredImage: post.featuredImage || '',
        category: post.category,
        tags: post.tags,
        status: post.status,
        seo: {
          metaTitle: post.seo?.metaTitle || '',
          metaDescription: post.seo?.metaDescription || '',
          keywords: post.seo?.keywords || []
        }
      })
      setAutoGenerateSlug(false)
      setAutoGenerateExcerpt(false)
    }
  }, [post])

  useEffect(() => {
    if (autoGenerateSlug && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateBlogSlug(formData.title)
      }))
    }
  }, [formData.title, autoGenerateSlug])

  useEffect(() => {
    if (autoGenerateExcerpt && formData.content) {
      setFormData(prev => ({
        ...prev,
        excerpt: generateExcerpt(formData.content)
      }))
    }
  }, [formData.content, autoGenerateExcerpt])

  const loadCategories = async () => {
    try {
      const fetchedCategories = await blogCategoriesService.getAllCategories()
      setCategories(fetchedCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSeoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.seo.keywords.includes(newKeyword.trim())) {
      handleSeoChange('keywords', [...formData.seo.keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    handleSeoChange('keywords', formData.seo.keywords.filter(keyword => keyword !== keywordToRemove))
  }

  const handleSubmit = async (status: 'draft' | 'published' | 'archived') => {
    if (!user) {
      toast.error('You must be logged in to save posts')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!formData.content.trim()) {
      toast.error('Please enter content')
      return
    }

    if (!formData.category) {
      toast.error('Please select a category')
      return
    }

    setLoading(true)

    try {
      const readTime = calculateReadTime(formData.content)
      const finalExcerpt = formData.excerpt || generateExcerpt(formData.content)

      const postData = {
        ...formData,
        excerpt: finalExcerpt,
        status,
        author: user.uid,
        readTime,
        seo: {
          metaTitle: formData.seo.metaTitle || formData.title,
          metaDescription: formData.seo.metaDescription || finalExcerpt,
          keywords: formData.seo.keywords
        }
      }

      if (post?.id) {
        await blogService.updatePost(post.id, postData)
        toast.success(`Post ${status === 'published' ? 'published' : 'saved'} successfully`)
      } else {
        await blogService.createPost(postData)
        toast.success(`Post ${status === 'published' ? 'published' : 'created'} successfully`)
      }

      onSave?.()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="brutalist-border bg-card p-6 brutalist-shadow">
        <h2 className="text-xl font-bold mb-4">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter post title"
              className="brutalist-border"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="slug">URL Slug *</Label>
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
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your blog post content here..."
              className="brutalist-border min-h-[300px]"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <input
                type="checkbox"
                checked={autoGenerateExcerpt}
                onChange={(e) => setAutoGenerateExcerpt(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-xs text-muted-foreground">Auto-generate</span>
            </div>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Brief summary of the post..."
              className="brutalist-border"
              rows={3}
              disabled={autoGenerateExcerpt}
            />
          </div>

          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => handleInputChange('featuredImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="brutalist-border"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full p-2 brutalist-border bg-background"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="brutalist-border"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button
                type="button"
                onClick={addTag}
                size="sm"
                className="brutalist-border"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="brutalist-border bg-muted text-muted-foreground"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="brutalist-border bg-card p-6 brutalist-shadow">
        <h3 className="text-lg font-bold mb-4">SEO Settings</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={formData.seo.metaTitle}
              onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
              placeholder="SEO title (defaults to post title)"
              className="brutalist-border"
            />
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.seo.metaDescription}
              onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
              placeholder="SEO description (defaults to excerpt)"
              className="brutalist-border"
              rows={3}
            />
          </div>

          <div>
            <Label>SEO Keywords</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add a keyword"
                className="brutalist-border"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <Button
                type="button"
                onClick={addKeyword}
                size="sm"
                className="brutalist-border"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.seo.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="brutalist-border bg-muted text-muted-foreground"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="brutalist-border"
          >
            Cancel
          </Button>
        )}

        <Button
          onClick={() => handleSubmit('draft')}
          disabled={loading}
          variant="outline"
          className="brutalist-border"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>

        {formData.status !== 'archived' && (
          <Button
            onClick={() => handleSubmit('published')}
            disabled={loading}
            className="brutalist-border bg-green-600 text-white hover:bg-green-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </Button>
        )}

        {post && (
          <Button
            onClick={() => handleSubmit('archived')}
            disabled={loading}
            variant="destructive"
            className="brutalist-border"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        )}
      </div>
    </div>
  )
}