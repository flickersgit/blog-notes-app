'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { NotesSidebar } from '@/components/NotesSidebar'

const NoteEditor = dynamic(() => import('@/components/NoteEditor').then(mod => mod.NoteEditor), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-amber-50/30">
      <div className="text-gray-400">Loading editor...</div>
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

  const [notes, setNotes] = useState<Note[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      setNotes((prev) => prev.filter((n) => n.id !== id))
      if (selectedId === id) {
        setSelectedId(notes.length > 1 ? notes[0].id : null)
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
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
      <div className="h-screen flex items-center justify-center bg-amber-50/30">
        <div className="flex items-center gap-2 text-gray-500">
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
        onDelete={handleDelete}
        isCreating={isCreating}
      />
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
        <div className="h-screen flex items-center justify-center bg-amber-50/30">
          <div className="flex items-center gap-2 text-gray-500">
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
