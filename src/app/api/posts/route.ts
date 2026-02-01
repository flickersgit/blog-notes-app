import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

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

  const post = await prisma.post.create({
    data: {
      title: 'Untitled',
      slug,
      content: '',
      published: false,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
