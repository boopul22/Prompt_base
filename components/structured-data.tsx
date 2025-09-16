import Script from "next/script"
import type { FirestorePrompt, UserProfile } from "@/lib/firestore-service"

interface StructuredDataProps {
  prompt?: FirestorePrompt
  creator?: UserProfile | null
  isHomepage?: boolean
}

export function StructuredData({ prompt, creator, isHomepage }: StructuredDataProps) {
  if (isHomepage) {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Free PromptBase",
      "description": "Discover thousands of viral AI prompts for ChatGPT, Claude, and other AI tools. Free collection of tested prompts for content creation, marketing, coding, and business growth.",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Free PromptBase",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }
    }

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Free PromptBase",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "description": "Free collection of viral AI prompts for content creators, marketers, and developers",
      "sameAs": [
        "https://twitter.com/freepromptbase"
      ]
    }

    return (
      <>
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
      </>
    )
  }

  if (prompt) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": prompt.title,
      "description": prompt.description,
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/prompts/${prompt.slug}`,
      "datePublished": prompt.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      "dateModified": prompt.updatedAt?.toDate?.()?.toISOString() || prompt.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": creator?.displayName || creator?.email || "Free PromptBase Team",
        ...(creator?.bio && { "description": creator.bio }),
        ...(creator?.socialMedia?.website && { "url": creator.socialMedia.website })
      },
      "publisher": {
        "@type": "Organization",
        "name": "Free PromptBase",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/prompts/${prompt.slug}`
      },
      "keywords": prompt.tags.join(", "),
      "articleSection": prompt.category,
      "inLanguage": "en-US",
      "isAccessibleForFree": true
    }

    const creativeWorkSchema = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": prompt.title,
      "description": prompt.description,
      "text": prompt.fullPrompt,
      "author": {
        "@type": "Person",
        "name": creator?.displayName || creator?.email || "Free PromptBase Team"
      },
      "dateCreated": prompt.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      "genre": prompt.category,
      "keywords": prompt.tags.join(", "),
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/prompts/${prompt.slug}`,
      "isAccessibleForFree": true,
      "license": "https://creativecommons.org/licenses/by/4.0/"
    }

    return (
      <>
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema)
          }}
        />
        <Script
          id="creative-work-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(creativeWorkSchema)
          }}
        />
      </>
    )
  }

  return null
}