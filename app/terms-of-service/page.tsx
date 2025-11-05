import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText, Users, AlertTriangle, Copyright, Gavel } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Free PromptBase",
  description: "Read Free PromptBase's terms of service and conditions. Understand the rules and guidelines for using our AI prompt platform responsibly.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "website terms",
    "legal terms",
    "usage guidelines",
    "user responsibilities",
    "service terms"
  ],
  openGraph: {
    title: "Terms of Service - Free PromptBase",
    description: "Read the terms and conditions for using Free PromptBase.",
    url: "/terms-of-service",
    type: "website"
  }
}

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">TERMS OF SERVICE</h1>
          <p className="text-xl">Rules and guidelines for using Free PromptBase</p>
        </div>

        {/* Last Updated */}
        <div className="brutalist-border bg-muted p-6 brutalist-shadow mb-8">
          <p className="text-sm font-semibold">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Agreement to Terms */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">AGREEMENT TO TERMS</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Welcome to Free PromptBase. These Terms of Service ("Terms") govern your access to and use of
                our website, products, services, and content (collectively, the "Service").
              </p>
              <p className="leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree
                with any part of these terms, then you may not access the Service.
              </p>
            </div>
          </section>

          {/* Use of Service */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">USE OF SERVICE</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">Permitted Uses</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access and use our AI prompt collection for personal and commercial purposes</li>
                  <li>Download and use prompts according to their specified terms</li>
                  <li>Share prompts with proper attribution when required</li>
                  <li>Contribute original prompts to our collection</li>
                  <li>Participate in community discussions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Prohibited Uses</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Copying or redistributing content without proper attribution</li>
                  <li>Using prompts for illegal, harmful, or malicious purposes</li>
                  <li>Attempting to reverse engineer or hack our platform</li>
                  <li>Spamming or submitting low-quality content</li>
                  <li>Violating intellectual property rights</li>
                  <li>Using automated tools to scrape or extract data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">USER ACCOUNTS</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                When you create an account with us, you must provide accurate, complete, and current information.
                You are responsible for safeguarding the password that you use to access the Service and for any
                activities or actions under your password.
              </p>
              <p className="leading-relaxed">
                You agree not to disclose your password to any third party. You must notify us immediately upon
                becoming aware of any breach of security or unauthorized use of your account.
              </p>
            </div>
          </section>

          {/* Content and Intellectual Property */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Copyright className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">CONTENT AND INTELLECTUAL PROPERTY</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">Your Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You retain ownership of any content you submit to our platform. By submitting content, you grant
                  us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your
                  content for the purpose of operating and improving our Service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Platform Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Service and its original content, features, and functionality are and will remain the exclusive
                  property of Free PromptBase and its licensors. The content is protected by copyright, trademark,
                  and other laws.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Content */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">PROHIBITED CONTENT</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              You may not submit or share content that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Is illegal, harmful, or violates any applicable laws</li>
              <li>Contains hate speech, discrimination, or harassment</li>
              <li>Is sexually explicit or inappropriate</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains false or misleading information</li>
              <li>Promotes violence, self-harm, or dangerous activities</li>
              <li>Contains malware, viruses, or malicious code</li>
              <li>Spam or unsolicited commercial content</li>
            </ul>
          </section>

          {/* Privacy */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">PRIVACY</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your
              use of the Service, to understand our practices.
            </p>
          </section>

          {/* Termination */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">TERMINATION</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account and bar access to the Service immediately, without prior
              notice or liability, under our sole discretion, for any reason whatsoever and without limitation.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">DISCLAIMER</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. WE DISCLAIM ALL WARRANTIES OF ANY KIND,
              WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR
              A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">LIMITATION OF LIABILITY</h2>
            <p className="text-muted-foreground leading-relaxed">
              IN NO EVENT SHALL FREE PROMPTBASE, OUR DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES
              BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
              LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          {/* Governing Law */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Gavel className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">GOVERNING LAW</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which
              Free PromptBase operates, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">CHANGES TO TERMS</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
              If a revision is material, we will try to provide at least 30 days notice prior to any new
              terms taking effect.
            </p>
          </section>

          {/* Contact Information */}
          <section className="brutalist-border bg-muted p-8 brutalist-shadow">
            <h2 className="text-2xl font-bold mb-4">CONTACT US</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
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