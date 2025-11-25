import { Loader2 } from "lucide-react"

interface LoadMoreButtonProps {
  onLoadMore: () => void
  loading: boolean
  hasMore: boolean
  className?: string
}

export function LoadMoreButton({ onLoadMore, loading, hasMore, className = "" }: LoadMoreButtonProps) {
  if (!hasMore) {
    return null
  }

  return (
    <div className={`text-center mt-8 ${className}`}>
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 text-sm font-bold uppercase tracking-wide"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            LOADING...
          </div>
        ) : (
          "Load More Prompts"
        )}
      </button>
    </div>
  )
}