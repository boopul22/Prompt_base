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
      delimiter: "", // Auto-detect delimiter (supports comma, tab, etc.)
      quotes: true, // Handle quoted fields
      quoteChar: '"',
      escapeChar: '"',
      complete: async (results) => {
        try {
          const prompts = results.data as any[]

          // Debug: Log parsing info
          console.log('CSV parsing results:', {
            delimiter: results.meta.delimiter,
            fields: results.meta.fields,
            firstRow: prompts[0],
            totalRows: prompts.length,
            rawData: prompts.slice(0, 3) // First 3 rows
          })

          // Flexible validation for different column names and delimiters
          if (!prompts.length) {
            throw new Error("CSV file appears to be empty.")
          }

          // Check if first row has data
          if (!prompts[0]) {
            throw new Error("No data rows found in CSV file.")
          }

          // Check if we have the required data in any column format
          const firstRow = prompts[0]
          const fields = results.meta.fields || Object.keys(firstRow)

          // Debug: Log what we found
          console.log('Available fields:', fields)
          console.log('First row data:', firstRow)

          // Look for required columns (case-insensitive, flexible matching)
          const titleField = fields.find(field =>
            field.toLowerCase().includes('title')
          )
          const fullPromptField = fields.find(field =>
            field.toLowerCase().includes('fullprompt') ||
            field.toLowerCase().includes('full_prompt') ||
            field.toLowerCase().includes('prompt')
          )

          console.log('Found titleField:', titleField)
          console.log('Found fullPromptField:', fullPromptField)

          if (!titleField || !fullPromptField) {
            throw new Error(`Required columns not found. Found: ${fields.join(', ')}. Required: title, fullPrompt (or variations)`)
          }

          // Map fields flexibly and filter valid prompts
          const validPrompts = prompts
            .map(row => ({
              title: row[titleField] || '',
              description: row[fields.find(f => f.toLowerCase().includes('description'))] || '',
              category: row[fields.find(f => f.toLowerCase().includes('category'))] || 'Uncategorized',
              fullPrompt: row[fullPromptField] || '',
              tags: row[fields.find(f => f.toLowerCase().includes('tags'))] || ''
            }))
            .filter(prompt => prompt.title && prompt.fullPrompt)

          if (validPrompts.length === 0) {
            throw new Error("No valid prompts found in the CSV file.")
          }

          // Show detected format to user
          const formatInfo = `Detected format: ${results.meta.delimiter === '\t' ? 'Tab-separated' : 'Comma-separated'} (${validPrompts.length} valid prompts)`
          console.log(formatInfo)

          // Use the enhanced bulk create with auto-chunking
          const result = await adminService.bulkCreatePrompts(
            validPrompts,
            user.uid,
            50, // Default batch size
            (progress, stage) => {
              console.log(`Progress: ${progress}% - ${stage}`)
            }
          )

          toast.dismiss()
          toast.success(`Bulk upload complete! Created ${result.stats?.promptsCreated || validPrompts.length} prompts. ${formatInfo}`)
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
          CSV/TSV must have columns: title, description, category, fullPrompt, tags.
          Supports both comma-separated and tab-separated formats automatically.
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
