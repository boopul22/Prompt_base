import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="brutalist-border-thick bg-card p-12 brutalist-shadow transform rotate-1">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-6">PROMPT NOT FOUND</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            The prompt you're looking for doesn't exist or has been moved.
          </p>
          <Button
            asChild
            size="lg"
            className="brutalist-border-thick brutalist-shadow bg-primary text-primary-foreground hover:bg-primary/90 font-bold transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <Link href="/">BACK TO PROMPTS</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
