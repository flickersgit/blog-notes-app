import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'
import { NewNoteButton } from '@/components/NewNoteButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BlogTitle, Footnote, PageWrapper, PostCard, ThemedHeader } from '@/components/HomePageClient'

export const dynamic = 'force-dynamic'

async function getSettings() {
  const settings = await prisma.settings.findUnique({
    where: { id: 'singleton' },
  })
  return settings
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: settings?.blogTitle || 'Notes',
    description: 'A simple notes app with Apple Notes style',
  }
}

async function getPublishedPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      updatedAt: true,
    },
  })
  return posts
}

export default async function HomePage() {
  const posts = await getPublishedPosts()

  return (
    <PageWrapper>
      <ThemedHeader>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100"><BlogTitle /></h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NewNoteButton />
          </div>
        </div>
      </ThemedHeader>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">No published notes yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const preview = post.content
                .replace(/<[^>]*>/g, '')
                .slice(0, 150)
                .trim()

              return (
                <PostCard
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  preview={preview}
                  date={formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}
                />
              )
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-zinc-700 mt-16">
        <div className="max-w-2xl mx-auto px-6 py-4 text-center text-sm text-gray-400 dark:text-gray-500">
          <Footnote />
        </div>
      </footer>
    </PageWrapper>
  )
}
