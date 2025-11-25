import { ProfileManagement } from "@/components/profile-management"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your Free PromptBase profile, bio, social media links, and avatar settings.",
  robots: {
    index: false,
    follow: false
  }
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">PROFILE MANAGEMENT</h1>
            <p className="text-base md:text-xl">Update your profile, bio, and social media links</p>
          </div>
        </div>

        {/* Profile Management Component */}
        <ProfileManagement />
      </div>
    </main>
  )
}