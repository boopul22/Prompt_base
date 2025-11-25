import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Mail, MessageCircle, Twitter, Github } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Free PromptBase",
  description: "Get in touch with Free PromptBase. Contact us for support, feedback, collaborations, or inquiries about our AI prompt collection platform.",
  keywords: [
    "contact free promptbase",
    "support",
    "feedback",
    "contact form",
    "email support",
    "AI prompts help",
    "prompt engineering support"
  ],
  openGraph: {
    title: "Contact Us - Free PromptBase",
    description: "Get in touch with Free PromptBase for support, feedback, and inquiries.",
    url: "/contact",
    type: "website"
  }
}

export default function ContactPage() {
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
        <div className="brutalist-border-thick bg-primary text-primary-foreground p-8 brutalist-shadow transform rotate-1 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">CONTACT US</h1>
          <p className="text-xl">We'd love to hear from you!</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Contact Methods */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Mail className="h-8 w-8 mr-3 text-primary" />
              GET IN TOUCH
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Email Support</h3>
                <p className="text-muted-foreground">
                  For general inquiries, support, or feedback, reach out to us via email.
                </p>
                <Button
                  asChild
                  className="brutalist-border brutalist-shadow bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                >
                  <a href="mailto:behindthebrainblog@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    EMAIL US
                  </a>
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Community Forum</h3>
                <p className="text-muted-foreground">
                  Join our community to ask questions, share prompts, and connect with other AI enthusiasts.
                </p>
                <Button
                  asChild
                  className="brutalist-border brutalist-shadow bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold"
                >
                  <a href="https://github.com/freepromptbase/discussions" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    JOIN DISCUSSION
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Social Media */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-6">FOLLOW US</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with our latest prompts, features, and AI content creation tips.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                variant="outline"
                className="brutalist-border brutalist-shadow bg-background hover:bg-muted font-bold"
              >
                <a href="https://twitter.com/freepromptbase" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 mr-2" />
                  TWITTER
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="brutalist-border brutalist-shadow bg-background hover:bg-muted font-bold"
              >
                <a href="https://github.com/freepromptbase" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GITHUB
                </a>
              </Button>
            </div>
          </section>

          {/* Response Time */}
          <section className="brutalist-border bg-muted p-8 brutalist-shadow">
            <h2 className="text-2xl font-bold mb-4">RESPONSE TIMES</h2>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email Support:</strong> 24-48 hours</p>
              <p><strong>Community Forum:</strong> Community-driven response times</p>
              <p><strong>Social Media:</strong> Updates and announcements</p>
            </div>
          </section>

          {/* Feedback */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-2xl font-bold mb-4">WE VALUE YOUR FEEDBACK</h2>
            <p className="text-muted-foreground mb-4">
              Your feedback helps us improve Free PromptBase and provide better prompts and features.
              Whether you've found a bug, have a suggestion, or want to share your success stories,
              we want to hear from you!
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Report issues or bugs</li>
              <li>Suggest new prompt categories</li>
              <li>Share your success stories</li>
              <li>Request new features</li>
              <li>Provide general feedback</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}