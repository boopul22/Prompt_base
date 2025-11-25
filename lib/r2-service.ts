import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

// Configure S3 client for Cloudflare R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export interface UploadResult {
  url: string
  key: string
  originalName: string
  size: number
  type: string
}

export interface UploadOptions {
  folder: 'blog/featured' | 'blog/content' | 'prompts/examples' | 'uploads'
  maxSizeInMB?: number
  allowedTypes?: string[]
}

// Default configuration
const DEFAULT_MAX_SIZE_MB = 5
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
]

/**
 * Validate file before upload
 */
function validateFile(file: File, options: UploadOptions): void {
  const maxSize = (options.maxSizeInMB || DEFAULT_MAX_SIZE_MB) * 1024 * 1024
  const allowedTypes = options.allowedTypes || DEFAULT_ALLOWED_TYPES

  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${options.maxSizeInMB || DEFAULT_MAX_SIZE_MB}MB limit`)
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Supported types: ${allowedTypes.join(', ')}`)
  }
}

/**
 * Generate unique filename with original extension
 */
function generateFileName(originalName: string): string {
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  const uniqueId = uuidv4()
  const timestamp = Date.now()
  return `${timestamp}-${uniqueId}.${extension}`
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Get content type from file extension
 */
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
  }
  return contentTypes[extension] || 'application/octet-stream'
}

/**
 * Upload file to Cloudflare R2
 */
export async function uploadToR2(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // Validate file
    validateFile(file, options)

    // Generate unique filename
    const fileName = generateFileName(file.name)
    const key = `freepromptbase/${options.folder}/${fileName}`

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: new Uint8Array(buffer),
      ContentType: file.type || getContentType(getFileExtension(file.name)),
      ContentLength: file.size,
      Metadata: {
        'original-name': file.name,
        'upload-timestamp': new Date().toISOString(),
      }
    })

    await r2Client.send(command)

    // Construct public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`

    return {
      url: publicUrl,
      key,
      originalName: file.name,
      size: file.size,
      type: file.type
    }
  } catch (error) {
    console.error('R2 upload error:', error)
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Upload multiple files to R2
 */
export async function uploadMultipleToR2(
  files: File[],
  options: UploadOptions
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadToR2(file, options))
  return Promise.all(uploadPromises)
}

/**
 * Delete file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    })

    await r2Client.send(command)
  } catch (error) {
    console.error('R2 delete error:', error)
    throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract R2 key from public URL
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const baseUrl = process.env.R2_PUBLIC_URL!
    if (url.startsWith(baseUrl)) {
      return url.replace(`${baseUrl}/`, '')
    }
    return null
  } catch (error) {
    return null
  }
}

/**
 * Get optimized image URL (for future implementation with image transformations)
 */
export function getOptimizedImageUrl(url: string, options?: {
  width?: number
  height?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}): string {
  // For now, return original URL
  // This can be enhanced with Cloudflare Image Resizing in the future
  return url
}

/**
 * Validate if URL is from our R2 bucket
 */
export function isValidR2Url(url: string): boolean {
  const baseUrl = process.env.R2_PUBLIC_URL!
  return url.startsWith(baseUrl) && url.includes('freepromptbase/')
}

// Export folder types for type safety
export const UPLOAD_FOLDERS = {
  BLOG_FEATURED: 'blog/featured' as const,
  BLOG_CONTENT: 'blog/content' as const,
  PROMPT_EXAMPLES: 'prompts/examples' as const,
  GENERAL_UPLOADS: 'uploads' as const,
} as const

export type UploadFolder = typeof UPLOAD_FOLDERS[keyof typeof UPLOAD_FOLDERS]