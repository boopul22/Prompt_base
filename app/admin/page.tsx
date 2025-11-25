"use client"

import { useState } from "react"
import { AddPromptForm } from "@/components/add-prompt-form"
import { AdminPromptList } from "@/components/admin-prompt-list"
import { AdminUsersList } from "@/components/admin-users-list"
import { AdminCategoriesList } from "@/components/admin-categories-list"
import { AdminBlogList } from "@/components/admin-blog-list"
import { AdminBlogCategories } from "@/components/admin-blog-categories"
import { AdminStats } from "@/components/admin-stats"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload } from "lucide-react"
import { AdminBulkUpload } from "@/components/admin-bulk-upload"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [reloadPrompts, setReloadPrompts] = useState(false)
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false)

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "prompts", label: "Prompts", icon: "💭" },
    { id: "blog", label: "Blog", icon: "📝" },
    { id: "categories", label: "Categories", icon: "📂" },
    { id: "users", label: "Users", icon: "👥" }
  ]

  const handleUploadComplete = () => {
    setIsBulkUploadOpen(false)
    setReloadPrompts(prev => !prev) // Toggle to trigger reload
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
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
            <p className="text-base md:text-xl">Manage prompts, blog posts, categories, and users</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 md:mb-8">
          <div className="brutalist-border bg-card p-2 brutalist-shadow">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  className="brutalist-border font-bold text-sm flex items-center gap-2"
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {tab.id === "blog" && (
                    <Badge variant="secondary" className="brutalist-border">
                      NEW
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <section>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">DASHBOARD OVERVIEW</h2>
            <AdminStats />
          </section>
        )}

        {activeTab === "prompts" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
              <section>
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">ADD NEW PROMPT</h2>
                  <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="brutalist-border">
                        <Upload className="h-4 w-4 mr-2" />
                        Bulk Upload
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Bulk Upload Prompts</DialogTitle>
                      </DialogHeader>
                      <AdminBulkUpload onUploadComplete={handleUploadComplete} />
                    </DialogContent>
                  </Dialog>
                </div>
                <AddPromptForm />
              </section>
              <section>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">MANAGE PROMPTS</h2>
                <AdminPromptList key={reloadPrompts ? 'reload' : 'initial'} />
              </section>
            </div>
          </div>
        )}

        {activeTab === "blog" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
              <section className="xl:col-span-2">
                <AdminBlogList />
              </section>
              <section>
                <AdminBlogCategories />
              </section>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <section>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">MANAGE CATEGORIES</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Prompt Categories</h3>
                <AdminCategoriesList />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Blog Categories</h3>
                <AdminBlogCategories />
              </div>
            </div>
          </section>
        )}

        {activeTab === "users" && (
          <section>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">MANAGE USERS</h2>
            <AdminUsersList />
          </section>
        )}
      </div>
    </main>
  )
}
