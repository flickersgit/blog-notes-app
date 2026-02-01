'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { NotesSidebar } from '@/components/NotesSidebar'
import { useSettings } from '@/lib/contexts/SettingsContext'

const NoteEditor = dynamic(() => import('@/components/NoteEditor').then(mod => mod.NoteEditor), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-gray-400 dark:text-gray-500">Loading editor...</div>
    </div>
  ),
})

interface Note {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

function AdminContent() {
  const searchParams = useSearchParams()
  const noteIdFromUrl = searchParams.get('note')
  const { settings } = useSettings()

  const [notes, setNotes] = useState<Note[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const selectedNote = notes.find((n) => n.id === selectedId) || null

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setNotes(data)

      // Auto-select note from URL param
      if (noteIdFromUrl && data.some((n: Note) => n.id === noteIdFromUrl)) {
        setSelectedId(noteIdFromUrl)
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setIsLoading(false)
    }
  }, [noteIdFromUrl])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const handleCreateNew = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/posts', { method: 'POST' })
      const newNote = await response.json()
      setNotes((prev) => [newNote, ...prev])
      setSelectedId(newNote.id)
    } catch (error) {
      console.error('Failed to create note:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map((id) => fetch(`/api/posts/${id}`, { method: 'DELETE' }))
      )
      setNotes((prev) => prev.filter((n) => !ids.includes(n.id)))
      if (selectedId && ids.includes(selectedId)) {
        setSelectedId(null)
      }
    } catch (error) {
      console.error('Failed to bulk delete notes:', error)
    }
  }

  const handleTitleChange = (title: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId ? { ...n, title, updatedAt: new Date() } : n
      )
    )
  }

  const handleContentChange = (content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId ? { ...n, content, updatedAt: new Date() } : n
      )
    )
  }

  const handlePublishToggle = (published: boolean) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedId ? { ...n, published } : n))
    )
  }

  const handleSaved = () => {
    fetchNotes()
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading notes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      <NotesSidebar
        notes={notes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreateNew={handleCreateNew}
        onBulkDelete={handleBulkDelete}
        isCreating={isCreating}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Mobile header with hamburger menu */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 border-b border-gray-200/50 dark:border-zinc-700/50 px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          title="Open sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span className="font-medium text-gray-800 dark:text-gray-100 truncate">
          {selectedNote?.title || settings.blogTitle}
        </span>
      </div>

      <NoteEditor
        postId={selectedNote?.id || ''}
        initialTitle={selectedNote?.title || ''}
        initialContent={selectedNote?.content || ''}
        published={selectedNote?.published || false}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        onPublishToggle={handlePublishToggle}
        onSaved={handleSaved}
      />
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#FFFEF5] dark:bg-[#1C1A14]">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  )
}
