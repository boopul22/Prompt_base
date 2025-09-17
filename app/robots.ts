import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/prompts/*',
          '/blog/*',
          '/*-prompts/',
          '/*-prompts/*',
          '/prompt-engineering/',
          '/prompt-engineering/*',
          '/marketing/',
          '/marketing/*',
          '/_next/static/',
          '/_next/image'
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/',
          '/api/*',
          '/private/',
          '/private/*',
          '/_next/server',
          '/_next/server/*'
        ],
      }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}