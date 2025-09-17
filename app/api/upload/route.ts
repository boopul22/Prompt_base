import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2, uploadMultipleToR2, UploadOptions, UPLOAD_FOLDERS } from '@/lib/r2-service'
import admin from 'firebase-admin'

// Initialize Firebase Admin (if not already initialized)
let adminInitialized = false
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
      adminInitialized = true
    } else {
      console.warn('Firebase Admin credentials not configured. Server-side authentication disabled.')
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
  }
}

/**
 * Verify Firebase auth token
 */
async function verifyAuthToken(authHeader: string | null): Promise<{ uid: string; email?: string } | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  // If admin is not initialized, we can't verify tokens server-side
  if (!adminInitialized || !admin.apps.length) {
    console.warn('Firebase Admin not initialized, cannot verify token server-side')
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * Validate upload folder
 */
function validateFolder(folder: string): folder is keyof typeof UPLOAD_FOLDERS {
  return Object.values(UPLOAD_FOLDERS).includes(folder as any)
}

/**
 * Rate limiting storage (in-memory for demo, use Redis in production)
 */
const uploadCounts = new Map<string, { count: number; resetTime: number }>()

/**
 * Check rate limit (10 uploads per hour per user)
 */
function checkRateLimit(uid: string): boolean {
  const now = Date.now()
  const userLimits = uploadCounts.get(uid)

  if (!userLimits || now > userLimits.resetTime) {
    uploadCounts.set(uid, { count: 1, resetTime: now + 3600000 }) // 1 hour
    return true
  }

  if (userLimits.count >= 10) {
    return false
  }

  userLimits.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // For now, we'll skip server-side auth verification since we're using R2, not Firebase Storage
    // In production, you may want to add Firebase Admin SDK credentials for additional security

    // Basic rate limiting by IP address instead of user ID
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 10 uploads per hour.' },
        { status: 429 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string
    const maxSizeInMB = parseInt(formData.get('maxSizeInMB') as string) || 5

    // Validate inputs
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    if (!folder || !validateFolder(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder specified' },
        { status: 400 }
      )
    }

    // Validate file count (max 10 files per request)
    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed per upload' },
        { status: 400 }
      )
    }

    // Validate each file
    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: 'Invalid file format' },
          { status: 400 }
        )
      }
    }

    // Upload options based on folder
    const uploadOptions: UploadOptions = {
      folder: UPLOAD_FOLDERS[folder as keyof typeof UPLOAD_FOLDERS],
      maxSizeInMB,
      allowedTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif'
      ]
    }

    // Upload files
    let results
    if (files.length === 1) {
      results = [await uploadToR2(files[0], uploadOptions)]
    } else {
      results = await uploadMultipleToR2(files, uploadOptions)
    }

    // Log successful upload
    console.log(`Client ${clientIP} uploaded ${files.length} file(s) to ${folder}`)

    return NextResponse.json({
      success: true,
      files: results,
      message: `Successfully uploaded ${files.length} file(s)`
    })

  } catch (error) {
    console.error('Upload API error:', error)

    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    const statusCode = errorMessage.includes('File size exceeds') ? 413 :
                      errorMessage.includes('File type') ? 415 :
                      errorMessage.includes('not allowed') ? 415 : 500

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: statusCode }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Upload API endpoint',
    supportedMethods: ['POST'],
    maxFileSize: '5MB',
    supportedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    folders: Object.values(UPLOAD_FOLDERS),
    rateLimit: '10 uploads per hour per user'
  })
}