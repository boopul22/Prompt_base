"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import Papa from "papaparse"
import { adminService } from "@/lib/admin-service"
import { useAuth } from "@/contexts/auth-context"

export function AdminBulkUpload({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { user } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.")
      return
    }

    if (!user) {
      toast.error("You must be logged in to upload prompts.")
      return
    }

    setIsUploading(true)
    toast.loading("Uploading and processing file...")

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const prompts = results.data as any[]
          // Basic validation
          if (!prompts.length || !prompts[0].title || !prompts[0].fullPrompt) {
            throw new Error("Invalid CSV format. Make sure you have 'title' and 'fullPrompt' columns.")
          }

          await adminService.bulkCreatePrompts(prompts, user.uid)
          toast.dismiss()
          toast.success("Bulk prompt upload successful!")
          onUploadComplete()
        } catch (error: any) {
          toast.dismiss()
          toast.error(`Error: ${error.message}`)
        } finally {
          setIsUploading(false)
        }
      },
      error: (error: any) => {
        toast.dismiss()
        toast.error(`CSV parsing error: ${error.message}`)
        setIsUploading(false)
      },
    })
  }

  return (
    <div className="brutalist-border-thick bg-card p-6 brutalist-shadow space-y-6">
      <div className="space-y-2">
        <Label htmlFor="csv-upload" className="text-sm font-bold">
          UPLOAD CSV FILE
        </Label>
        <Input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="brutalist-border bg-background"
        />
        <p className="text-xs text-muted-foreground">
          CSV must have columns: title, description, category, fullPrompt, tags (comma-separated).
        </p>
      </div>
      <Button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="w-full brutalist-border-thick brutalist-shadow bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3"
      >
        {isUploading ? "UPLOADING..." : "UPLOAD AND CREATE PROMPTS"}
      </Button>
    </div>
  )
}
