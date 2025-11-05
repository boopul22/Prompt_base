import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Cookie, Shield, BarChart3, Target, Settings, Eye } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy - Free PromptBase",
  description: "Read Free PromptBase's comprehensive cookie policy. Learn about the types of cookies we use, their purposes, and how you can manage your cookie preferences.",
  keywords: [
    "cookie policy",
    "cookies",
    "data privacy",
    "tracking cookies",
    "analytics cookies",
    "advertising cookies",
    "cookie consent",
    "GDPR cookies",
    "cookie management"
  ],
  openGraph: {
    title: "Cookie Policy - Free PromptBase",
    description: "Learn about how Free PromptBase uses cookies and manages your privacy.",
    url: "/cookie-policy",
    type: "website"
  }
}

export default function CookiePolicyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">COOKIE POLICY</h1>
          <p className="text-xl">How we use cookies to enhance your experience</p>
        </div>

        {/* Last Updated */}
        <div className="brutalist-border bg-muted p-6 brutalist-shadow mb-8">
          <p className="text-sm font-semibold">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* What Are Cookies */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Cookie className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">WHAT ARE COOKIES?</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Cookies are small text files that are placed on your device (computer, tablet, or mobile)
                when you visit a website. They are widely used to make websites work more efficiently
                and to provide information to website owners.
              </p>
              <p className="leading-relaxed">
                Cookies allow us to recognize you when you return to our website, remember your preferences,
                and provide you with a personalized experience. They also help us analyze how our website
                is being used and improve our services.
              </p>
            </div>
          </section>

          {/* Types of Cookies We Use */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-6">TYPES OF COOKIES WE USE</h2>

            {/* Necessary Cookies */}
            <div className="mb-6 p-4 border-2 border-border rounded">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold">Necessary Cookies</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                These cookies are essential for the website to function properly. They enable basic
                functionality such as page navigation, access to secure areas, and authentication.
              </p>
              <div className="space-y-2">
                <div className="bg-muted p-3 rounded">
                  <p className="font-semibold text-sm">Examples:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Session cookies for user authentication</li>
                    <li>Security tokens</li>
                    <li>Load balancing cookies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="mb-6 p-4 border-2 border-border rounded">
              <div className="flex items-center mb-3">
                <BarChart3 className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold">Analytics Cookies</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                These cookies help us understand how visitors interact with our website by collecting
                and reporting information anonymously.
              </p>
              <div className="space-y-2">
                <div className="bg-muted p-3 rounded">
                  <p className="font-semibold text-sm">Services:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Google Analytics</li>
                    <li>Vercel Analytics</li>
                    <li>Custom analytics tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Advertising Cookies */}
            <div className="mb-6 p-4 border-2 border-border rounded">
              <div className="flex items-center mb-3">
                <Target className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold">Advertising Cookies</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                These cookies are used to deliver advertisements that are relevant to you and your interests.
                They also help measure the effectiveness of advertising campaigns.
              </p>
              <div className="space-y-2">
                <div className="bg-muted p-3 rounded">
                  <p className="font-semibold text-sm">Services:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Google AdSense</li>
                    <li>Google Ad Manager</li>
                    <li>Third-party advertising networks</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="p-4 border-2 border-border rounded">
              <div className="flex items-center mb-3">
                <Settings className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold">Functional Cookies</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                These cookies enable enhanced functionality and personalization, such as videos and live chats.
                They may be set by us or by third-party providers whose services we have added to our pages.
              </p>
              <div className="space-y-2">
                <div className="bg-muted p-3 rounded">
                  <p className="font-semibold text-sm">Examples:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Theme preferences</li>
                    <li>Language settings</li>
                    <li>Saved user preferences</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">HOW WE USE COOKIES</h2>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>To provide and maintain our service</li>
              <li>To authenticate users and prevent fraud</li>
              <li>To remember user preferences and settings</li>
              <li>To analyze website traffic and usage patterns</li>
              <li>To personalize content and user experience</li>
              <li>To serve relevant advertisements</li>
              <li>To improve website performance and functionality</li>
              <li>To comply with legal and regulatory requirements</li>
            </ul>
          </section>

          {/* Managing Your Cookie Preferences */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">MANAGING YOUR COOKIE PREFERENCES</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                You have several options to manage cookies:
              </p>

              <div className="space-y-3">
                <div className="bg-muted p-4 rounded">
                  <h3 className="font-semibold mb-2">Cookie Consent Banner</h3>
                  <p className="text-sm">
                    When you first visit our website, you'll see a cookie consent banner where you can
                    choose which types of cookies to accept.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded">
                  <h3 className="font-semibold mb-2">Browser Settings</h3>
                  <p className="text-sm">
                    You can configure your browser to refuse cookies or to alert you when cookies are being sent.
                    However, some parts of our website may not function properly without cookies.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded">
                  <h3 className="font-semibold mb-2">Third-Party Tools</h3>
                  <p className="text-sm">
                    You can use third-party tools to manage advertising cookies and opt out of personalized advertising.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">THIRD-PARTY COOKIES</h2>
            <p className="text-muted-foreground mb-4">
              We use various third-party services that may place cookies on your device:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold">Google Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Analytics cookies to understand how visitors use our website.
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    Privacy Policy
                  </a>
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold">Google AdSense</h3>
                <p className="text-sm text-muted-foreground">
                  Advertising cookies to serve personalized ads.
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    Privacy Policy
                  </a>
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold">Vercel Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Performance and usage analytics.
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Duration */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">COOKIE DURATION</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
              <li><strong>Authentication Cookies:</strong> Typically valid for 24 hours to 30 days</li>
              <li><strong>Analytics Cookies:</strong> Usually expire after 2 years</li>
              <li><strong>Advertising Cookies:</strong> Vary by provider, typically 30 days to 1 year</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">YOUR RIGHTS</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have the following rights regarding cookies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Accept or reject cookies through our consent banner</li>
              <li>Withdraw consent at any time through browser settings</li>
              <li>View what cookies are stored on your device</li>
              <li>Delete existing cookies from your device</li>
              <li>Opt out of targeted advertising</li>
            </ul>
          </section>

          {/* Updates to This Policy */}
          <section className="brutalist-border bg-card p-8 brutalist-shadow">
            <h2 className="text-3xl font-bold mb-4">UPDATES TO THIS POLICY</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices,
              legal requirements, or the services we use. We will notify you of any material changes
              by posting the updated policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section className="brutalist-border bg-muted p-8 brutalist-shadow">
            <h2 className="text-2xl font-bold mb-4">CONTACT US</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Cookie Policy, please contact us:
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