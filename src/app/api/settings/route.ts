import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'singleton' },
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 'singleton' },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { blogTitle, backgroundColor, pattern } = body

    if (blogTitle !== undefined && blogTitle.length > 30) {
      return NextResponse.json(
        { error: 'Blog title must be 30 characters or less' },
        { status: 400 }
      )
    }

    if (pattern !== undefined && !['plain', 'dots', 'lines'].includes(pattern)) {
      return NextResponse.json(
        { error: 'Invalid pattern type' },
        { status: 400 }
      )
    }

    const settings = await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: {
        ...(blogTitle !== undefined && { blogTitle }),
        ...(backgroundColor !== undefined && { backgroundColor }),
        ...(pattern !== undefined && { pattern }),
      },
      create: {
        id: 'singleton',
        ...(blogTitle !== undefined && { blogTitle }),
        ...(backgroundColor !== undefined && { backgroundColor }),
        ...(pattern !== undefined && { pattern }),
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
