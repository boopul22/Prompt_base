"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Save, User, Shield, Twitter, Linkedin, Github, Globe, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { usersService } from "@/lib/firestore-service"
import { toast } from "react-hot-toast"

export function ProfileManagement() {
  const { user, userProfile, refreshUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    avatar: "",
    socialMedia: {
      twitter: "",
      linkedin: "",
      github: "",
      website: ""
    }
  })

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        bio: userProfile.bio || "",
        avatar: userProfile.avatar || "",
        socialMedia: {
          twitter: userProfile.socialMedia?.twitter || "",
          linkedin: userProfile.socialMedia?.linkedin || "",
          github: userProfile.socialMedia?.github || "",
          website: userProfile.socialMedia?.website || ""
        }
      })
    }
  }, [userProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await usersService.updateUserProfile(user.uid, {
        displayName: formData.displayName.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        avatar: formData.avatar.trim() || undefined,
        socialMedia: {
          twitter: formData.socialMedia.twitter.trim() || undefined,
          linkedin: formData.socialMedia.linkedin.trim() || undefined,
          github: formData.socialMedia.github.trim() || undefined,
          website: formData.socialMedia.website.trim() || undefined
        }
      })
      
      await refreshUserProfile()
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card className="brutalist-border brutalist-shadow">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">SIGN IN REQUIRED</h3>
          <p className="text-muted-foreground">Please sign in to manage your profile.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Profile Info */}
      <Card className="brutalist-border brutalist-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            CURRENT PROFILE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{userProfile?.displayName || "No display name"}</p>
              <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
            </div>
            <Badge
              variant={userProfile?.isAdmin ? "default" : "secondary"}
              className="brutalist-border font-bold"
            >
              {userProfile?.isAdmin ? (
                <>
                  <Shield className="h-3 w-3 mr-1" />
                  ADMIN
                </>
              ) : (
                <>
                  <User className="h-3 w-3 mr-1" />
                  USER
                </>
              )}
            </Badge>
          </div>
          {userProfile?.bio && (
            <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
          )}
        </CardContent>
      </Card>

      {/* Profile Editor */}
      <Card className="brutalist-border brutalist-shadow">
        <CardHeader>
          <CardTitle>EDIT PROFILE</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="text-sm font-bold">
                  DISPLAY NAME
                </Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Your display name"
                  className="brutalist-border"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm font-bold">
                  BIO
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="brutalist-border resize-none"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="avatar" className="text-sm font-bold">
                  AVATAR URL
                </Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  className="brutalist-border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Link to your profile picture
                </p>
              </div>
            </div>

            <Separator />

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">SOCIAL MEDIA</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitter" className="text-sm font-bold flex items-center gap-1">
                    <Twitter className="h-3 w-3" />
                    TWITTER
                  </Label>
                  <Input
                    id="twitter"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                    }))}
                    placeholder="@username"
                    className="brutalist-border"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin" className="text-sm font-bold flex items-center gap-1">
                    <Linkedin className="h-3 w-3" />
                    LINKEDIN
                  </Label>
                  <Input
                    id="linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                    }))}
                    placeholder="linkedin.com/in/username"
                    className="brutalist-border"
                  />
                </div>

                <div>
                  <Label htmlFor="github" className="text-sm font-bold flex items-center gap-1">
                    <Github className="h-3 w-3" />
                    GITHUB
                  </Label>
                  <Input
                    id="github"
                    value={formData.socialMedia.github}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, github: e.target.value }
                    }))}
                    placeholder="github.com/username"
                    className="brutalist-border"
                  />
                </div>

                <div>
                  <Label htmlFor="website" className="text-sm font-bold flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    WEBSITE
                  </Label>
                  <Input
                    id="website"
                    value={formData.socialMedia.website}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, website: e.target.value }
                    }))}
                    placeholder="https://yourwebsite.com"
                    className="brutalist-border"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full brutalist-border-thick brutalist-shadow bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? (
                "SAVING..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  SAVE PROFILE
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}