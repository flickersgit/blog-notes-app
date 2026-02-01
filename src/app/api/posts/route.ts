import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { format } from 'date-fns'

function formatDateTitle(date: Date): string {
  // Format: "Sunday, Feb 1 2026"
  return format(date, 'EEEE, MMM d yyyy')
}

async function generateUniqueTitle(): Promise<string> {
  const baseTitle = formatDateTitle(new Date())

  // Find existing posts with titles starting with today's date
  const existingPosts = await prisma.post.findMany({
    where: {
      title: {
        startsWith: baseTitle,
      },
    },
    select: { title: true },
  })

  if (existingPosts.length === 0) {
    return baseTitle
  }

  // Find the highest index
  let maxIndex = 1
  for (const post of existingPosts) {
    if (post.title === baseTitle) {
      // Base title exists, so we need at least index 2
      maxIndex = Math.max(maxIndex, 1)
    } else {
      // Check for "~ N" suffix
      const match = post.title.match(/~ (\d+)$/)
      if (match) {
        maxIndex = Math.max(maxIndex, parseInt(match[1], 10))
      }
    }
  }

  return `${baseTitle} ~ ${maxIndex + 1}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const publishedOnly = searchParams.get('published') === 'true'

  const posts = await prisma.post.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json(posts)
}

export async function POST() {
  const slug = `note-${nanoid(10)}`
  const title = await generateUniqueTitle()

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content: '',
      published: false,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
