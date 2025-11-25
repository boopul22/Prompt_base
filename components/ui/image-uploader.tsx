"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'react-hot-toast'
import { UPLOAD_FOLDERS, type UploadFolder } from '@/lib/r2-service'

export interface UploadedFile {
  url: string
  key: string
  originalName: string
  size: number
  type: string
}

interface ImageUploaderProps {
  folder: UploadFolder
  onUpload: (files: UploadedFile[]) => void
  onRemove?: (file: UploadedFile) => void
  maxFiles?: number
  maxSizeInMB?: number
  existingFiles?: UploadedFile[]
  disabled?: boolean
  className?: string
  accept?: string
  showPreview?: boolean
}

export function ImageUploader({
  folder,
  onUpload,
  onRemove,
  maxFiles = 5,
  maxSizeInMB = 5,
  existingFiles = [],
  disabled = false,
  className = '',
  accept = 'image/*',
  showPreview = true
}: ImageUploaderProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return

    // Check file count limit
    if (existingFiles.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Create form data
      const formData = new FormData()
      acceptedFiles.forEach(file => formData.append('files', file))
      formData.append('folder', folder)
      formData.append('maxSizeInMB', maxSizeInMB.toString())

      // Simulate progress (since we don't have real progress from fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // Upload files (no authentication required for now)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()

      // Call onUpload with the uploaded files
      onUpload(result.files)

      toast.success(`Successfully uploaded ${acceptedFiles.length} file(s)`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [folder, maxSizeInMB, maxFiles, existingFiles.length, disabled, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxFiles: maxFiles - existingFiles.length,
    maxSize: maxSizeInMB * 1024 * 1024,
    disabled: disabled || uploading,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(file => {
        const errors = file.errors.map(e => e.message).join(', ')
        toast.error(`${file.file.name}: ${errors}`)
      })
    }
  })

  const handleRemove = (file: UploadedFile) => {
    if (onRemove) {
      onRemove(file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isDragActive
            ? 'border-accent bg-accent/10'
            : 'border-muted-foreground/25 hover:border-accent/50'
          }
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${existingFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-3">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {uploading
                ? 'Uploading...'
                : isDragActive
                  ? 'Drop files here'
                  : 'Click or drag files to upload'
              }
            </p>

            <p className="text-xs text-muted-foreground">
              {existingFiles.length >= maxFiles
                ? `Maximum ${maxFiles} files reached`
                : `Maximum ${maxFiles - existingFiles.length} more files, ${maxSizeInMB}MB each`
              }
            </p>
          </div>
        </div>

        {uploading && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* Existing Files Preview */}
      {showPreview && existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({existingFiles.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {existingFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                  <img
                    src={file.url}
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>

                {/* File Info Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-between p-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="self-end h-6 w-6 p-0"
                    onClick={() => handleRemove(file)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  <div className="text-white text-xs space-y-1">
                    <p className="truncate font-medium">{file.originalName}</p>
                    <p>{formatFileSize(file.size)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File List (if not showing preview) */}
      {!showPreview && existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({existingFiles.length})</h4>
          <div className="space-y-2">
            {existingFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium truncate">{file.originalName}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {file.type.split('/')[1]?.toUpperCase()}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => handleRemove(file)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Supported formats: JPEG, PNG, WebP, GIF</p>
        <p>• Maximum file size: {maxSizeInMB}MB per file</p>
        <p>• Maximum files: {maxFiles} files total</p>
      </div>
    </div>
  )
}