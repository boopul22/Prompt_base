"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, User } from "lucide-react"
import { BlogPost } from "@/lib/blog-service"

interface BlogCardProps {
  post: BlogPost & {
    createdAt: string
    updatedAt?: string
    publishedAt?: string
  }
  author?: {
    displayName?: string
    avatar?: string
  }
}

export function BlogCard({ post, author }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const displayDate = post.publishedAt || post.createdAt

  return (
    <article className="brutalist-border bg-card brutalist-shadow hover:brutalist-shadow-lg transition-all duration-200 overflow-hidden">
      {post.featuredImage && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant="secondary"
            className="brutalist-border bg-accent text-accent-foreground font-bold text-xs"
          >
            {post.category.toUpperCase()}
          </Badge>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.readTime} min read</span>
              </div>
            )}

            {post.views && post.views > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.views} views</span>
              </div>
            )}
          </div>
        </div>

        <Link href={`/blog/${post.slug}`} className="group">
          <h2 className="font-bold text-lg md:text-xl mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="text-xs bg-muted text-muted-foreground px-2 py-1 brutalist-border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              #{tag}
            </Link>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-muted-foreground px-2 py-1">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {author?.avatar && (
              <img
                src={author.avatar}
                alt={author.displayName || 'Author'}
                className="w-5 h-5 rounded-full"
              />
            )}
            {!author?.avatar && (
              <User className="h-4 w-4" />
            )}
            <span>
              {author?.displayName || 'Anonymous'}
            </span>
          </div>

          <time dateTime={displayDate}>
            {formatDate(displayDate)}
          </time>
        </div>

        <div className="mt-4">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 brutalist-border font-bold text-sm transition-colors"
          >
            READ MORE
          </Link>
        </div>
      </div>
    </article>
  )
}