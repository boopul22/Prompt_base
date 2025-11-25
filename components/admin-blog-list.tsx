"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, Plus, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { BlogPost, blogService } from "@/lib/blog-service"
import { usersService } from "@/lib/firestore-service"
import { toast } from "react-hot-toast"
import { BlogPostForm } from "./blog-post-form"

interface BlogListProps {
  posts: BlogPost[]
  onPostsChange: () => void
}

export function AdminBlogList() {
  const [posts, setPosts] = useState<(BlogPost & { createdAt: string, updatedAt?: string, publishedAt?: string })[]>([])
  const [authors, setAuthors] = useState<Record<string, { displayName?: string, avatar?: string }>>({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    if (user && userProfile?.isAdmin) {
      loadPosts()
    }
  }, [user, userProfile])

  const loadPosts = async () => {
    try {
      const allPosts = await blogService.getAllPosts()

      // Serialize timestamps for client components
      const serializedPosts = allPosts.map(post => ({
        ...post,
        createdAt: post.createdAt && typeof post.createdAt === 'object' && 'toDate' in post.createdAt
          ? post.createdAt.toDate().toISOString()
          : post.createdAt || new Date().toISOString(),
        updatedAt: post.updatedAt && typeof post.updatedAt === 'object' && 'toDate' in post.updatedAt
          ? post.updatedAt.toDate().toISOString()
          : post.updatedAt,
        publishedAt: post.publishedAt && typeof post.publishedAt === 'object' && 'toDate' in post.publishedAt
          ? post.publishedAt.toDate().toISOString()
          : post.publishedAt
      }))

      setPosts(serializedPosts)

      // Load author details
      const authorIds = [...new Set(allPosts.map(post => post.author))]
      const authorDetails: Record<string, { displayName?: string, avatar?: string }> = {}

      await Promise.all(
        authorIds.map(async (authorId) => {
          try {
            const author = await usersService.getUserById(authorId)
            if (author) {
              authorDetails[authorId] = {
                displayName: author.displayName,
                avatar: author.avatar
              }
            }
          } catch (error) {
            console.error(`Error loading author ${authorId}:`, error)
          }
        })
      )

      setAuthors(authorDetails)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await blogService.deletePost(id)
        setPosts((prev) => prev.filter((post) => post.id !== id))
        toast.success('Post deleted successfully')
      } catch (error) {
        console.error('Error deleting post:', error)
        toast.error('Failed to delete post')
      }
    }
  }

  const handleStatusChange = async (postId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      if (newStatus === 'published') {
        await blogService.publishPost(postId)
      } else {
        await blogService.updatePost(postId, { status: newStatus })
      }
      await loadPosts()
      toast.success(`Post ${newStatus} successfully`)
    } catch (error) {
      console.error('Error updating post status:', error)
      toast.error('Failed to update post status')
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setShowForm(true)
  }

  const handleFormSave = () => {
    setShowForm(false)
    setEditingPost(null)
    loadPosts()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingPost(null)
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

  if (showForm) {
    return (
      <BlogPostForm
        post={editingPost || undefined}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    )
  }

  if (loading) {
    return (
      <div className="brutalist-border bg-muted p-8 text-center brutalist-shadow-sm">
        <h3 className="text-xl font-bold mb-2">LOADING...</h3>
        <p className="text-muted-foreground">Fetching blog posts...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="brutalist-border bg-card p-4 brutalist-shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="brutalist-border bg-accent text-accent-foreground font-bold text-xs"
                >
                  {post.category.toUpperCase()}
                </Badge>
                <Badge
                  variant={
                    post.status === 'published' ? 'default' :
                    post.status === 'draft' ? 'secondary' :
                    'destructive'
                  }
                  className="brutalist-border font-bold text-xs"
                >
                  {post.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                </span>
                {post.views && (
                  <span className="text-xs text-muted-foreground">
                    {post.views} views
                  </span>
                )}
                {post.readTime && (
                  <span className="text-xs text-muted-foreground">
                    {post.readTime} min read
                  </span>
                )}
              </div>

              <h3 className="font-bold text-lg mb-1">{post.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty mb-2">{post.excerpt}</p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>By {authors[post.author]?.displayName || 'Unknown Author'}</span>
                <span>•</span>
                <span>Slug: {post.slug}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 brutalist-border">
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {post.status === 'draft' && (
                <Button
                  size="sm"
                  variant="default"
                  className="brutalist-border bg-green-600 text-white hover:bg-green-700 p-2"
                  onClick={() => handleStatusChange(post.id!, 'published')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}

              {post.status === 'published' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="brutalist-border p-2"
                  onClick={() => handleStatusChange(post.id!, 'draft')}
                >
                  Unpublish
                </Button>
              )}

              <Button asChild size="sm" variant="outline" className="brutalist-border bg-background hover:bg-muted p-2">
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="brutalist-border bg-background hover:bg-muted p-2"
                onClick={() => handleEdit(post)}
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="destructive"
                className="brutalist-border bg-destructive text-destructive-foreground hover:bg-destructive/90 p-2"
                onClick={() => handleDelete(post.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <div className="brutalist-border bg-muted p-8 text-center brutalist-shadow-sm">
          <h3 className="text-xl font-bold mb-2">NO BLOG POSTS YET</h3>
          <p className="text-muted-foreground mb-4">Create your first blog post to get started.</p>
          <Button
            onClick={() => setShowForm(true)}
            className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Post
          </Button>
        </div>
      )}
    </div>
  )
}