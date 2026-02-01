import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { BackToNotesLink, PageWrapper, ThemedHeader, ThemedArticle } from '@/components/HomePageClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  })
  return post
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Not Found' }
  }

  return {
    title: post.title,
    description: post.content.replace(/<[^>]*>/g, '').slice(0, 160),
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <PageWrapper>
      <ThemedHeader>
        <div className="max-w-2xl mx-auto px-6 py-4">
          <BackToNotesLink />
        </div>
      </ThemedHeader>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <ThemedArticle className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {post.title}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
            </p>
          </header>

          <div
            className="prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </ThemedArticle>
      </main>

      <footer className="border-t border-gray-200 dark:border-zinc-700 mt-16">
        <div className="max-w-2xl mx-auto px-6 py-4 text-center text-sm text-gray-400 dark:text-gray-500">
          Built with Apple Notes style
        </div>
      </footer>
    </PageWrapper>
  )
}
