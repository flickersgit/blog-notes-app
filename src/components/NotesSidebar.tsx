'use client'

import { useState, useMemo } from 'react'
import { NoteItem } from './NoteItem'
import { SearchBar } from './SearchBar'

interface Note {
  id: string
  title: string
  content: string
  published: boolean
  updatedAt: Date
}

interface NotesSidebarProps {
  notes: Note[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreateNew: () => void
  onDelete: (id: string) => void
  isCreating: boolean
}

export function NotesSidebar({
  notes,
  selectedId,
  onSelect,
  onCreateNew,
  onDelete,
  isCreating,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes

    const query = searchQuery.toLowerCase()
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    )
  }, [notes, searchQuery])

  return (
    <div className="w-72 h-full bg-stone-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Notes</h1>
          <button
            onClick={onCreateNew}
            disabled={isCreating}
            className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="New note"
          >
            {isCreating ? (
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
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchQuery ? 'No matching notes' : 'No notes yet'}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteItem
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              updatedAt={note.updatedAt}
              isSelected={note.id === selectedId}
              onClick={() => onSelect(note.id)}
              onDelete={() => onDelete(note.id)}
            />
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-200 text-xs text-gray-400 text-center">
        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
      </div>
    </div>
  )
}
