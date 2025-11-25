import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, Info, Shield, Target } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Disclaimer - Free PromptBase",
  description: "Read Free PromptBase's legal disclaimer. Understand the limitations and responsibilities when using our AI prompts and services.",
  keywords: [
    "disclaimer",
    "legal disclaimer",
    "ai content disclaimer",
    "prompt disclaimer",
    "usage disclaimer",
    "liability disclaimer",
    "content warning",
    "ai safety"
  ],
  openGraph: {
    title: "Disclaimer - Free PromptBase",
    description: "Important disclaimer about using AI prompts from Free PromptBase.",
    url: "/disclaimer",
    type: "website"
  }
}

export default function DisclaimerPage() {
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
        <div className="brutalist-border-thick bg-destructive text-destructive-foreground p-8 brutalist-shadow transform -rotate-1 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">IMPORTANT DISCLAIMER</h1>
          <p className="text-xl">Please read this before using our AI prompts</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* General Disclaimer */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive mr-3" />
              <h2 className="text-3xl font-bold">GENERAL DISCLAIMER</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Free PromptBase provides AI prompts and related content for informational and educational purposes only.
                The information, prompts, and content provided on this platform are offered "as is" without any
                warranties, guarantees, or representations of any kind.
              </p>
              <p className="leading-relaxed font-semibold">
                Users are solely responsible for how they use the prompts and content obtained from this platform.
              </p>
            </div>
          </section>

          {/* AI Content Disclaimer */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Info className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">AI CONTENT DISCLAIMER</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                The prompts and content on Free PromptBase are designed to work with various AI models and
                language generation systems. However, AI-generated content may:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Contain inaccuracies, errors, or outdated information</li>
                <li>Produce unexpected or unintended results</li>
                <li>Generate content that may be biased or offensive</li>
                <li>Not always reflect current events or the most up-to-date information</li>
                <li>Require human review and verification before use</li>
              </ul>
              <p className="leading-relaxed">
                Always review and verify AI-generated content before using it for professional, medical, legal,
                financial, or other critical applications.
              </p>
            </div>
          </section>

          {/* No Professional Advice */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">NOT PROFESSIONAL ADVICE</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                The content, prompts, and information provided on Free PromptBase do not constitute professional
                advice in any field, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Medical or health advice</li>
                <li>Legal advice or counsel</li>
                <li>Financial or investment advice</li>
                <li>Technical or engineering advice</li>
                <li>Business or career advice</li>
              </ul>
              <p className="leading-relaxed font-semibold">
                Always consult qualified professionals for specific advice related to your situation.
              </p>
            </div>
          </section>

          {/* User Responsibility */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">USER RESPONSIBILITY</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Users of Free PromptBase are solely responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Verifying the accuracy and appropriateness of AI-generated content</li>
                <li>Ensuring compliance with applicable laws and regulations</li>
                <li>Respecting intellectual property rights and copyrights</li>
                <li>Using prompts ethically and responsibly</li>
                <li>Fact-checking information before publication or use</li>
                <li>Obtaining necessary permissions for commercial use</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="brutalist-border bg-muted p-8 brutalist-shadow">
            <h2 className="text-2xl font-bold mb-4">LIMITATION OF LIABILITY</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Free PromptBase, its owners, operators, and contributors shall not be liable for any direct,
                indirect, incidental, consequential, or punitive damages arising from:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Use or inability to use our prompts and content</li>
                <li>Errors, omissions, or inaccuracies in AI-generated content</li>
                <li>Loss of data, revenue, or business opportunities</li>
                <li>Any damages resulting from third-party AI services</li>
                <li>Content that may be deemed offensive, inappropriate, or harmful</li>
              </ul>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">THIRD-PARTY AI SERVICES</h2>
            <p className="text-muted-foreground leading-relaxed">
              Free PromptBase does not own, control, or endorse any third-party AI services or platforms
              (such as OpenAI, Anthropic, Google, etc.). Our prompts are designed to work with various
              AI services, but we are not responsible for their functionality, availability, or the content
              they generate. Always review the terms of service of third-party AI platforms before use.
            </p>
          </section>

          {/* Content Accuracy */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">CONTENT ACCURACY</h2>
            <p className="text-muted-foreground leading-relaxed">
              While we strive to provide high-quality, tested prompts, we cannot guarantee the accuracy,
              completeness, or usefulness of any content. AI models may produce different results even with
              the same prompt, and results can vary based on the specific AI model, version, and parameters used.
            </p>
          </section>

          {/* Age Restriction */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">AGE RESTRICTION</h2>
            <p className="text-muted-foreground leading-relaxed">
              Free PromptBase is intended for users who are 18 years of age or older. Users under 18 should
              only use this platform with parental or guardian supervision. Some AI-generated content may
              not be suitable for all audiences.
            </p>
          </section>

          {/* Modifications */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">MODIFICATIONS</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify, update, or change this disclaimer at any time without notice.
              Your continued use of the platform constitutes acceptance of any changes.
            </p>
          </section>

          {/* Agreement */}
          <section className="brutalist-border bg-destructive/10 border-destructive p-8 brutalist-shadow">
            <h2 className="text-2xl font-bold mb-4 text-destructive">YOUR AGREEMENT</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using Free PromptBase, you acknowledge that you have read, understood, and agree to this
              disclaimer. If you do not agree with any part of this disclaimer, you should not use our
              platform or its content.
            </p>
          </section>

          {/* Contact */}
          <section className="brutalist-border bg-muted p-8 brutalist-shadow">
            <h2 className="text-2xl font-bold mb-4">QUESTIONS OR CONCERNS</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this disclaimer, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> behindthebrainblog@gmail.com</p>
              <p><strong>Website:</strong> www.freepromptbase.com</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}