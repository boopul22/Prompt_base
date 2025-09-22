import { HeroSection } from "@/components/hero-section"
import { StructuredData } from "@/components/structured-data"
import { HomePageClient } from "@/components/home-page-client"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import { getCategories } from "@/lib/migrate-categories"
import { Category } from "@/lib/category-service"

interface SerializedPrompt extends Omit<FirestorePrompt, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt?: string
}

export default async function HomePage() {
  try {
    // Load data server-side
    const [dbCategories, approvedPrompts] = await Promise.all([
      getCategories().catch(error => {
        console.error('Categories loading failed:', error)
        return [] as Category[]
      }),
      promptsService.getPaginatedPrompts(undefined, 1, 12).catch(error => {
        console.error('Prompts loading failed:', error)
        return { prompts: [] as FirestorePrompt[], total: 0, page: 1, pageSize: 12, totalPages: 0, hasMore: false }
      })
    ])

    // Serialize timestamps for client component
    const serializedPrompts = approvedPrompts.prompts.map(prompt => ({
      ...prompt,
      createdAt: prompt.createdAt && typeof prompt.createdAt === 'object' && 'toDate' in prompt.createdAt
        ? prompt.createdAt.toDate().toISOString()
        : prompt.createdAt || new Date().toISOString(),
      updatedAt: prompt.updatedAt && typeof prompt.updatedAt === 'object' && 'toDate' in prompt.updatedAt
        ? prompt.updatedAt.toDate().toISOString()
        : prompt.updatedAt
    }))

    // Serialize category timestamps to avoid client component warnings
    const serializedCategories = dbCategories.map(category => ({
      ...category,
      createdAt: category.createdAt && typeof category.createdAt === 'object' && 'toDate' in category.createdAt
        ? category.createdAt.toDate().toISOString()
        : category.createdAt || new Date().toISOString(),
      updatedAt: category.updatedAt && typeof category.updatedAt === 'object' && 'toDate' in category.updatedAt
        ? category.updatedAt.toDate().toISOString()
        : category.updatedAt
    }))

    const initialPagination = {
      currentPage: approvedPrompts.page,
      totalPages: approvedPrompts.totalPages,
      totalItems: approvedPrompts.total,
      pageSize: approvedPrompts.pageSize,
      hasMore: approvedPrompts.hasMore
    }

    return (
      <main className="min-h-screen bg-background">
        <StructuredData isHomepage={true} />
        <HeroSection />

        <section className="px-3 md:px-4 py-8 md:py-12 max-w-7xl mx-auto">
          <HomePageClient
            initialPrompts={serializedPrompts}
            initialCategories={serializedCategories}
            initialSelectedCategory="All"
            initialPagination={initialPagination}
          />
        </section>

        <section className="px-3 md:px-4 py-8 md:py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
              Learn Prompt Engineering
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-12 text-center max-w-4xl mx-auto">
              Master the art of creating effective AI prompts with our comprehensive guides and tutorials. Start getting better results from ChatGPT, Claude, Gemini, and all AI platforms.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="brutalist-border bg-card p-6 brutalist-shadow">
                <h3 className="font-bold text-lg mb-3">Beginner's Guide</h3>
                <p className="text-muted-foreground mb-4">Learn the fundamentals of prompt writing and AI interaction basics.</p>
                <a href="/prompt-engineering" className="text-accent hover:text-accent/80 font-medium">
                  Start Learning →
                </a>
              </div>
              <div className="brutalist-border bg-card p-6 brutalist-shadow">
                <h3 className="font-bold text-lg mb-3">Advanced Techniques</h3>
                <p className="text-muted-foreground mb-4">Discover sophisticated prompting strategies for complex AI tasks.</p>
                <a href="/prompt-engineering" className="text-accent hover:text-accent/80 font-medium">
                  Advanced Methods →
                </a>
              </div>
              <div className="brutalist-border bg-card p-6 brutalist-shadow">
                <h3 className="font-bold text-lg mb-3">Best Practices</h3>
                <p className="text-muted-foreground mb-4">Follow proven methods and industry standards for prompt engineering.</p>
                <a href="/prompt-engineering" className="text-accent hover:text-accent/80 font-medium">
                  View Guidelines →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error('Error loading homepage:', error)

    // Fallback UI for error cases
    return (
      <main className="min-h-screen bg-background">
        <StructuredData isHomepage={true} />
        <HeroSection />

        <section className="px-3 md:px-4 py-8 md:py-12 max-w-7xl mx-auto">
          <HomePageClient
            initialPrompts={[]}
            initialCategories={[]}
            initialSelectedCategory="All"
            initialPagination={{
              currentPage: 1,
              totalPages: 0,
              totalItems: 0,
              pageSize: 12,
              hasMore: false
            }}
          />
        </section>
      </main>
    )
  }
}
