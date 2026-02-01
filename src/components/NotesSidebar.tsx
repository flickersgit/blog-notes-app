'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
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
  onBulkDelete: (ids: string[]) => void
  isCreating: boolean
}

export function NotesSidebar({
  notes,
  selectedId,
  onSelect,
  onCreateNew,
  onBulkDelete,
  isCreating,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes

    const query = searchQuery.toLowerCase()
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    )
  }, [notes, searchQuery])

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleToggleSelectMode = () => {
    if (isSelectMode) {
      // Exiting select mode - clear selections
      setCheckedIds(new Set())
    }
    setIsSelectMode(!isSelectMode)
  }

  const handleBulkDelete = () => {
    if (checkedIds.size === 0) return
    if (!confirm(`Delete ${checkedIds.size} note(s)?`)) return
    onBulkDelete(Array.from(checkedIds))
    setCheckedIds(new Set())
    setIsSelectMode(false)
  }

  return (
    <div className="w-72 h-full bg-stone-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              title="Back to home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Notes</h1>
          </div>
          <button
            onClick={onCreateNew}
            disabled={isCreating || isSelectMode}
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

      {/* Select mode toolbar */}
      {filteredNotes.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={handleToggleSelectMode}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isSelectMode
                ? 'bg-gray-200 text-gray-700'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isSelectMode ? 'Cancel' : 'Select'}
          </button>
          {isSelectMode && checkedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete ({checkedIds.size})
            </button>
          )}
        </div>
      )}

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
              isSelectMode={isSelectMode}
              isChecked={checkedIds.has(note.id)}
              onCheck={(checked) => handleCheck(note.id, checked)}
              onClick={() => onSelect(note.id)}
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
