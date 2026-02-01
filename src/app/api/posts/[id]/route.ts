import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params
  const body = await request.json()

  const { title, content, published, slug } = body

  const updateData: Record<string, unknown> = {}
  if (title !== undefined) updateData.title = title
  if (content !== undefined) updateData.content = content
  if (published !== undefined) updateData.published = published
  if (slug !== undefined) updateData.slug = slug

  const post = await prisma.post.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(post)
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params

  await prisma.post.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}

// Handle beacon requests for cleanup (sendBeacon only sends POST)
export async function POST(request: Request, { params }: RouteParams) {
  const url = new URL(request.url)
  const method = url.searchParams.get('_method')

  if (method === 'DELETE') {
    const { id } = await params

    try {
      await prisma.post.delete({
        where: { id },
      })
    } catch {
      // Ignore errors (post might already be deleted)
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
}
