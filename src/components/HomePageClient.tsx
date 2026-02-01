'use client'

import Link from 'next/link'
import { useSettings } from '@/lib/contexts/SettingsContext'
import { ReactNode } from 'react'

export function BlogTitle() {
  const { settings, isLoading } = useSettings()
  if (isLoading) return <span className="opacity-0">Loading</span>
  return <>{settings.blogTitle}</>
}

export function Footnote() {
  const { settings, isLoading } = useSettings()
  if (isLoading) return <span className="opacity-0">Loading</span>
  return <>{settings.footnote}</>
}

export function BackToNotesLink() {
  const { settings, isLoading } = useSettings()
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      <span className={isLoading ? 'opacity-0' : ''}>Back to {settings.blogTitle}</span>
    </Link>
  )
}

export function PageWrapper({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const patternClass = settings.pattern !== 'plain' ? `pattern-${settings.pattern}` : ''

  return (
    <div
      className={`min-h-screen ${patternClass}`}
      style={{ backgroundColor: 'var(--background)' }}
    >
      {children}
    </div>
  )
}

interface PostCardProps {
  href: string
  title: string
  preview: string
  date: string
}

export function PostCard({ href, title, preview, date }: PostCardProps) {
  return (
    <Link
      href={href}
      className="block p-6 rounded-xl border border-gray-200/50 dark:border-zinc-700/50 hover:shadow-md dark:hover:shadow-zinc-900/50 transition-all"
      style={{ backgroundColor: 'var(--background-shade)' }}
    >
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title || 'Untitled'}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">
        {preview || 'No content'}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{date}</p>
    </Link>
  )
}

export function ThemedHeader({ children }: { children: ReactNode }) {
  return (
    <header
      className="border-b border-gray-200/50 dark:border-zinc-700/50 backdrop-blur-sm sticky top-0 z-10"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {children}
    </header>
  )
}

export function ThemedArticle({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { settings } = useSettings()
  const patternClass = settings.pattern !== 'plain' ? `pattern-${settings.pattern}` : ''

  return (
    <article
      className={`rounded-xl border border-gray-200/50 dark:border-zinc-700/50 ${patternClass} ${className}`}
      style={{ backgroundColor: 'var(--background-shade)' }}
    >
      {children}
    </article>
  )
}
