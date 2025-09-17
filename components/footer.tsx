"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Zap, Github, Twitter, Mail } from "lucide-react"
import { getCategories } from "@/lib/migrate-categories"
import { Category } from "@/lib/category-service"

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const dbCategories = await getCategories()
        setCategories(dbCategories.slice(0, 4)) // Show only first 4 categories
      } catch (error) {
        console.error('Error loading categories for footer:', error)
      }
    }

    loadCategories()
  }, [])
  return (
    <footer className="brutalist-border-thick bg-card text-card-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="brutalist-border bg-primary text-primary-foreground p-2 brutalist-shadow-sm">
                <Zap className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl">VIRAL PROMPTS</span>
            </div>
            <p className="text-muted-foreground text-pretty leading-relaxed mb-4">
              The ultimate collection of AI prompts that actually work. Copy, customize, and create content that goes
              viral.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="brutalist-border bg-background text-foreground p-2 brutalist-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="brutalist-border bg-background text-foreground p-2 brutalist-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="brutalist-border bg-background text-foreground p-2 brutalist-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link href="/add-prompt" className="text-muted-foreground hover:text-foreground font-medium">
                  Contribute Prompt
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">CATEGORIES</h3>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/?category=${encodeURIComponent(category.name)}`}
                      className="text-muted-foreground hover:text-foreground font-medium"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-muted-foreground font-medium">Loading...</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t-4 border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground font-medium">
            © 2024 VIRAL PROMPTS. BUILT WITH NEXT.JS AND BRUTALIST DESIGN.
          </p>
        </div>
      </div>
    </footer>
  )
}
