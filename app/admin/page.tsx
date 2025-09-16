import { AddPromptForm } from "@/components/add-prompt-form"
import { AdminPromptList } from "@/components/admin-prompt-list"
import { AdminUsersList } from "@/components/admin-users-list"
import { AdminStats } from "@/components/admin-stats"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            asChild
            variant="outline"
            className="brutalist-border brutalist-shadow-sm bg-background hover:bg-muted font-bold mb-4 md:mb-6 text-sm md:text-base"
          >
            <Link href="/">
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              BACK TO HOME
            </Link>
          </Button>

          <div className="brutalist-border-thick bg-primary text-primary-foreground p-4 md:p-8 brutalist-shadow transform -rotate-1 mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">ADMIN PANEL</h1>
            <p className="text-base md:text-xl">Add new viral prompts and manage existing ones</p>
          </div>
        </div>

        {/* Admin Stats */}
        <section className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">DASHBOARD OVERVIEW</h2>
          <AdminStats />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* Add New Prompt Form */}
          <section>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">ADD NEW PROMPT</h2>
            <AddPromptForm />
          </section>

          {/* Existing Prompts List */}
          <section>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">MANAGE PROMPTS</h2>
            <AdminPromptList />
          </section>

          {/* User Management */}
          <section>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">MANAGE USERS</h2>
            <AdminUsersList />
          </section>
        </div>
      </div>
    </main>
  )
}
