import { NextRequest, NextResponse } from 'next/server'
import { promptsService } from '@/lib/firestore-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'All'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '12')

    const result = await promptsService.getPaginatedPrompts(
      category === 'All' ? undefined : category,
      page,
      pageSize
    )

    // Serialize timestamps for JSON response
    const serializedPrompts = result.prompts.map(prompt => ({
      ...prompt,
      createdAt: prompt.createdAt && typeof prompt.createdAt === 'object' && 'toDate' in prompt.createdAt
        ? prompt.createdAt.toDate().toISOString()
        : prompt.createdAt || new Date().toISOString(),
      updatedAt: prompt.updatedAt && typeof prompt.updatedAt === 'object' && 'toDate' in prompt.updatedAt
        ? prompt.updatedAt.toDate().toISOString()
        : prompt.updatedAt
    }))

    return NextResponse.json({
      prompts: serializedPrompts,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        pageSize: result.pageSize,
        hasMore: result.hasMore
      }
    })
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json({
      prompts: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        pageSize: 12,
        hasMore: false
      }
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'