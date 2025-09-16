"use client"

import { useState } from "react"
import { mockPrompts, categories } from "@/lib/prompts-data"
import { PromptCard } from "@/components/prompt-card"
import { CategoryFilter } from "@/components/category-filter"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPrompts =
    selectedCategory === "All" ? mockPrompts : mockPrompts.filter((prompt) => prompt.category === selectedCategory)

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />

      <section id="categories" className="px-3 md:px-4 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-balance">BROWSE VIRAL PROMPTS</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 text-pretty">
            Copy, customize, and create viral content with these proven AI prompts
          </p>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">NO PROMPTS FOUND</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Try selecting a different category or check back later for new prompts.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
