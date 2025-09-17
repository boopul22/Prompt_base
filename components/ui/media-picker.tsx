"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUploader, type UploadedFile } from './image-uploader'
import { Upload, Link, Check } from 'lucide-react'
import { type UploadFolder } from '@/lib/r2-service'
import { toast } from 'react-hot-toast'

interface MediaPickerProps {
  folder: UploadFolder
  onSelect: (files: UploadedFile[]) => void
  onSelectUrl?: (url: string) => void
  maxFiles?: number
  maxSizeInMB?: number
  trigger?: React.ReactNode
  title?: string
  allowUrlInput?: boolean
  allowMultiple?: boolean
}

export function MediaPicker({
  folder,
  onSelect,
  onSelectUrl,
  maxFiles = 5,
  maxSizeInMB = 5,
  trigger,
  title = "Select Media",
  allowUrlInput = true,
  allowMultiple = true
}: MediaPickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [activeTab, setActiveTab] = useState('upload')

  const handleUpload = (files: UploadedFile[]) => {
    if (allowMultiple) {
      setSelectedFiles(prev => [...prev, ...files])
    } else {
      setSelectedFiles(files.slice(0, 1))
    }
  }

  const handleRemove = (fileToRemove: UploadedFile) => {
    setSelectedFiles(prev => prev.filter(file => file.url !== fileToRemove.url))
  }

  const handleSelect = () => {
    if (selectedFiles.length > 0) {
      onSelect(selectedFiles)
      setOpen(false)
      setSelectedFiles([])
      toast.success(`Selected ${selectedFiles.length} file(s)`)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim() && onSelectUrl) {
      try {
        new URL(urlInput.trim()) // Validate URL
        onSelectUrl(urlInput.trim())
        setOpen(false)
        setUrlInput('')
        toast.success('URL added successfully')
      } catch (error) {
        toast.error('Please enter a valid URL')
      }
    }
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="brutalist-border">
            <Upload className="h-4 w-4 mr-2" />
            {title}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            {allowUrlInput && (
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                From URL
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <ImageUploader
              folder={folder}
              onUpload={handleUpload}
              onRemove={handleRemove}
              maxFiles={allowMultiple ? maxFiles : 1}
              maxSizeInMB={maxSizeInMB}
              existingFiles={selectedFiles}
              showPreview={true}
            />

            {selectedFiles.length > 0 && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFiles([])}
                  className="brutalist-border"
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={handleSelect}
                  className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Select {selectedFiles.length} File(s)
                </Button>
              </div>
            )}
          </TabsContent>

          {allowUrlInput && (
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="imageUrl"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="brutalist-border"
                    />
                    <Button
                      onClick={handleUrlSubmit}
                      disabled={!urlInput.trim() || !isValidUrl(urlInput.trim())}
                      className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {urlInput && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="border rounded-lg p-4 bg-muted">
                      {isValidUrl(urlInput) ? (
                        <img
                          src={urlInput}
                          alt="URL Preview"
                          className="max-w-full h-32 object-contain mx-auto rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          Enter a valid image URL to see preview
                        </div>
                      )}
                      <div className="hidden text-center text-muted-foreground py-8">
                        Failed to load image
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Enter a direct link to an image file</p>
                  <p>• Supported formats: JPEG, PNG, WebP, GIF</p>
                  <p>• Make sure the URL is publicly accessible</p>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}