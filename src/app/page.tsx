import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

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
    <div className="min-h-screen bg-amber-50/30">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Notes</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-300"
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
            <p className="text-gray-500">No published notes yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const preview = post.content
                .replace(/<[^>]*>/g, '')
                .slice(0, 150)
                .trim()

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block p-6 bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all"
                >
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    {post.title || 'Untitled'}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {preview || 'No content'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(post.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-2xl mx-auto px-6 py-4 text-center text-sm text-gray-400">
          Built with Apple Notes style
        </div>
      </footer>
    </div>
  )
}
