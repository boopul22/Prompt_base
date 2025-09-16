import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Viral Prompts - Share AI Prompts That Go Viral",
  description:
    "Discover and share the most effective AI prompts. Copy, use, and create viral content with our curated collection of AI prompts.",
  generator: "v0.app",
  keywords: ["AI prompts", "viral content", "ChatGPT prompts", "AI tools", "content creation"],
  authors: [{ name: "Viral Prompts" }],
  openGraph: {
    title: "Viral Prompts - Share AI Prompts That Go Viral",
    description:
      "Discover and share the most effective AI prompts. Copy, use, and create viral content with our curated collection of AI prompts.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viral Prompts - Share AI Prompts That Go Viral",
    description:
      "Discover and share the most effective AI prompts. Copy, use, and create viral content with our curated collection of AI prompts.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          {children}
          <Footer />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
