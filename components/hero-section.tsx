import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="px-3 py-8 md:py-16 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <div className="brutalist-border-thick bg-background text-foreground p-4 md:p-8 brutalist-shadow mb-6 md:mb-8 transform -rotate-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-balance">
            FREE AI PROMPTS FOR ALL PLATFORMS
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-pretty">
            Download thousands of free AI prompts for ChatGPT, Claude, Gemini, and all AI models. Copy, customize, and create amazing content with proven prompts.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center">
          <Button
            size="lg"
            className="w-full sm:w-auto brutalist-border-thick brutalist-shadow bg-accent text-accent-foreground hover:bg-accent/90 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-bold transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            BROWSE FREE PROMPTS
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="w-full sm:w-auto brutalist-border-thick brutalist-shadow bg-background text-foreground hover:bg-muted text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-bold transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <Link href="/add-prompt">CONTRIBUTE PROMPT</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
