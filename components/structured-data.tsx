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
      "name": "Free Prompt Base",
      "description": "Access thousands of free AI prompts for ChatGPT, Claude, Gemini, and all AI models. Download tested prompts for content creation, marketing, SEO, and business growth.",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "keywords": "free AI prompts, free ChatGPT prompts, Claude prompts, Gemini prompts, prompt engineering, AI prompt library, free prompt templates",
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
        "name": "Free Prompt Base",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      },
      "mainEntity": {
        "@type": "CollectionPage",
        "name": "Free AI Prompts Collection",
        "description": "Comprehensive collection of free AI prompts for ChatGPT and other AI tools"
      }
    }

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Free Prompt Base",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "description": "Free collection of AI prompts for ChatGPT, Claude, Gemini, and all AI models. Includes prompt engineering guides for content creators, marketers, and developers",
      "sameAs": [
        "https://twitter.com/freepromptbase"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": "Free access to thousands of AI prompts and templates"
      }
    }

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are free AI prompts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free AI prompts are pre-written text instructions that help you get better results from AI tools like ChatGPT, Claude, Gemini, and other language models. Our collection includes tested prompts for content creation, marketing, SEO, and business growth."
          }
        },
        {
          "@type": "Question", 
          "name": "How do I use ChatGPT prompts effectively?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To use AI prompts effectively, copy our tested prompt templates, customize them for your specific needs, and provide clear context. Our prompt engineering guides teach you best practices for getting optimal results from ChatGPT, Claude, Gemini, and other AI models."
          }
        },
        {
          "@type": "Question",
          "name": "Are these AI prompts really free?",
          "acceptedAnswer": {
            "@type": "Answer", 
            "text": "Yes, all our AI prompts are completely free to use. Unlike paid prompt marketplaces, we provide open access to thousands of tested prompts, templates, and guides without any cost or registration requirements."
          }
        },
        {
          "@type": "Question",
          "name": "What makes these prompts better than others?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our prompts are tested and optimized for real-world results. Each prompt includes usage instructions, customization tips, and examples. We focus on prompt engineering best practices to ensure high-quality outputs."
          }
        }
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
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
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
      "datePublished": typeof prompt.createdAt === 'string' ? prompt.createdAt : new Date().toISOString(),
      "dateModified": typeof prompt.updatedAt === 'string' ? prompt.updatedAt : (typeof prompt.createdAt === 'string' ? prompt.createdAt : new Date().toISOString()),
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
      "dateCreated": typeof prompt.createdAt === 'string' ? prompt.createdAt : new Date().toISOString(),
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