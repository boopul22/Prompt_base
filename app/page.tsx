"use client"

import { useState, useEffect } from "react"
import { PromptCard } from "@/components/prompt-card"
import { CategoryFilter } from "@/components/category-filter"
import { HeroSection } from "@/components/hero-section"
import { StructuredData } from "@/components/structured-data"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import { migrateMockDataToFirestore } from "@/lib/migrate-data"
import { getCategories } from "@/lib/migrate-categories"
import { Category } from "@/lib/category-service"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [prompts, setPrompts] = useState<FirestorePrompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories and prompts in parallel
        const [dbCategories, approvedPrompts] = await Promise.all([
          getCategories(),
          promptsService.getApprovedPrompts(selectedCategory)
        ])

        console.log('Loaded categories:', dbCategories.length)
        console.log('Loaded prompts:', approvedPrompts.length, 'Category:', selectedCategory)
        
        setCategories(dbCategories)
        setPrompts(approvedPrompts)
        
        // Only migrate prompts if no prompts exist
        if (approvedPrompts.length === 0) {
          console.log('No prompts found, running migration...')
          await migrateMockDataToFirestore()
          // Reload prompts after migration
          const migratedPrompts = await promptsService.getApprovedPrompts(selectedCategory)
          setPrompts(migratedPrompts)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedCategory])

  return (
    <main className="min-h-screen bg-background">
      <StructuredData isHomepage={true} />
      <HeroSection />

      <section id="categories" className="px-3 md:px-4 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-balance">BROWSE VIRAL PROMPTS</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 text-pretty">
            Copy, customize, and create viral content with these proven AI prompts
          </p>

          <CategoryFilter
            categories={['All', ...categories.map(cat => cat.name)]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">LOADING PROMPTS...</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Please wait while we fetch the latest prompts.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {prompts.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">NO PROMPTS FOUND</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Try selecting a different category or check back later for new prompts.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
