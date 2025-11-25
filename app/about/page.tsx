import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Zap, Users, Target, Rocket } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Free PromptBase - AI Prompt Collection",
  description: "Learn about Free PromptBase, the ultimate free collection of viral AI prompts for ChatGPT, Claude, and other AI tools. Discover our mission to democratize AI prompt engineering.",
  keywords: [
    "about free promptbase",
    "AI prompt collection",
    "viral AI prompts",
    "prompt engineering",
    "ChatGPT prompts",
    "free AI tools",
    "AI content creation"
  ],
  openGraph: {
    title: "About Free PromptBase - AI Prompt Collection",
    description: "Learn about Free PromptBase, the ultimate free collection of viral AI prompts for ChatGPT, Claude, and other AI tools.",
    url: "/about",
    type: "website"
  }
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button
            asChild
            variant="outline"
            className="brutalist-border brutalist-shadow-sm bg-background hover:bg-muted font-bold"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK TO HOME
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="brutalist-border-thick bg-primary text-primary-foreground p-8 brutalist-shadow transform -rotate-1 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ABOUT VIRAL PROMPTS</h1>
          <p className="text-xl">The story behind the ultimate AI prompt collection</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <div className="brutalist-border bg-accent text-accent-foreground p-3 brutalist-shadow-sm mr-4">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold">OUR MISSION</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              We believe that great AI prompts are the key to unlocking creativity and productivity. Our mission is to
              curate and share the most effective AI prompts that help creators, entrepreneurs, and professionals
              generate viral content and achieve their goals.
            </p>
          </section>

          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <div className="brutalist-border bg-primary text-primary-foreground p-3 brutalist-shadow-sm mr-4">
                <Zap className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold">WHY VIRAL PROMPTS?</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                In the age of AI, the quality of your output depends entirely on the quality of your input. A
                well-crafted prompt can mean the difference between generic content and something that truly resonates
                with your audience.
              </p>
              <p className="text-lg leading-relaxed">
                We've tested thousands of prompts across different AI platforms and curated only the ones that
                consistently deliver exceptional results. Each prompt in our collection has been refined through
                real-world usage and community feedback.
              </p>
            </div>
          </section>

          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <div className="brutalist-border bg-secondary text-secondary-foreground p-3 brutalist-shadow-sm mr-4">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold">FOR THE COMMUNITY</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Viral Prompts is built by creators, for creators. We're constantly adding new prompts based on community
              suggestions and the latest trends in AI and content creation. Join our growing community of prompt
              enthusiasts and help shape the future of AI-powered creativity.
            </p>
          </section>

          <section className="brutalist-border bg-muted p-8 brutalist-shadow">
            <div className="flex items-center mb-6">
              <div className="brutalist-border bg-accent text-accent-foreground p-3 brutalist-shadow-sm mr-4">
                <Rocket className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold">GET STARTED</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Ready to create viral content? Browse our collection, copy the prompts that resonate with you, and start
              generating amazing results with your favorite AI tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="brutalist-border-thick brutalist-shadow bg-primary text-primary-foreground hover:bg-primary/90 font-bold transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                <Link href="/">BROWSE PROMPTS</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="brutalist-border-thick brutalist-shadow bg-background text-foreground hover:bg-muted font-bold transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                <Link href="/admin">CONTRIBUTE A PROMPT</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
