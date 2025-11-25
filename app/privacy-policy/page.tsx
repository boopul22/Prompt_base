import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Database, Cookie, Lock } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Free PromptBase",
  description: "Read Free PromptBase's comprehensive privacy policy. Learn how we collect, use, and protect your personal data when using our AI prompt platform.",
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "GDPR compliance",
    "data collection",
    "cookie policy",
    "personal information",
    "privacy statement"
  ],
  openGraph: {
    title: "Privacy Policy - Free PromptBase",
    description: "Learn how Free PromptBase protects your privacy and handles your data.",
    url: "/privacy-policy",
    type: "website"
  }
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">PRIVACY POLICY</h1>
          <p className="text-xl">Your privacy is our priority</p>
        </div>

        {/* Last Updated */}
        <div className="brutalist-border bg-muted p-6 brutalist-shadow mb-8">
          <p className="text-sm font-semibold">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">INTRODUCTION</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Free PromptBase ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website
                freepromptbase.com and use our AI prompt collection services.
              </p>
              <p className="leading-relaxed">
                By using Free PromptBase, you consent to the data practices described in this policy.
                If you do not agree with the terms of this privacy policy, please do not access or use our website.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">INFORMATION WE COLLECT</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Information You Provide to Us</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Account information (email address, display name when registering)</li>
                  <li>User-generated content (prompts, comments, feedback)</li>
                  <li>Communications with our support team</li>
                  <li>Optional profile information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Information Automatically Collected</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>IP address and geolocation data</li>
                  <li>Browser type, operating system, and device information</li>
                  <li>Pages visited, time spent, and click patterns</li>
                  <li>Referring website and search terms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">HOW WE USE YOUR INFORMATION</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We use the information we collect in the following ways:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>To provide, maintain, and improve our services</li>
              <li>To process and fulfill your requests</li>
              <li>To personalize your experience on our platform</li>
              <li>To analyze usage patterns and optimize our website</li>
              <li>To respond to your comments, questions, and requests</li>
              <li>To detect and prevent fraudulent activity</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Cookie className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">COOKIES AND TRACKING</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and hold
                certain information. You can instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
              <div>
                <h3 className="text-xl font-semibold mb-3">Types of Cookies We Use</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Advertising Cookies:</strong> Used to serve relevant advertisements</li>
                  <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">DATA SECURITY</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However,
              no method of transmission over the internet or method of electronic storage is 100% secure.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">THIRD-PARTY SERVICES</h2>
            <p className="text-muted-foreground mb-4">
              We use the following third-party services that may collect information about you:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Google Analytics:</strong> For website analytics and performance tracking</li>
              <li><strong>Firebase:</strong> For authentication, database, and hosting services</li>
              <li><strong>Vercel Analytics:</strong> For performance monitoring</li>
              <li><strong>Social Media Platforms:</strong> For sharing and promotional activities</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">YOUR RIGHTS</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Object to processing</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">CHILDREN'S PRIVACY</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website is not intended for children under 13 years of age. We do not knowingly
              collect personally identifiable information from children under 13. If you are a parent
              or guardian and you are aware that your child has provided us with personal information,
              please contact us.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">CHANGES TO THIS POLICY</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
            </p>
          </section>

          {/* Contact Information */}
          <section className="brutalist-border bg-muted p-8 brutalist-shadow">
            <h2 className="text-2xl font-bold mb-4">CONTACT US</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us:
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