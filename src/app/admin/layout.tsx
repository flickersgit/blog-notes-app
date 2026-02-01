import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

async function getSettings() {
  const settings = await prisma.settings.findUnique({
    where: { id: 'singleton' },
  })
  return settings
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `Admin - ${settings?.blogTitle || 'Notes'}`,
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
