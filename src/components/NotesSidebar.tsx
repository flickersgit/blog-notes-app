'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { NoteItem } from './NoteItem'
import { SearchBar } from './SearchBar'
import { SettingsModal } from './SettingsModal'
import { useSettings } from '@/lib/contexts/SettingsContext'

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
  isOpen: boolean
  onToggle: () => void
}

export function NotesSidebar({
  notes,
  selectedId,
  onSelect,
  onCreateNew,
  onBulkDelete,
  isCreating,
  isOpen,
  onToggle,
}: NotesSidebarProps) {
  const { settings } = useSettings()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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

  const handleSelectNote = (id: string) => {
    onSelect(id)
    // Close sidebar on mobile after selecting
    if (window.innerWidth < 768) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 dark:border-zinc-700 flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
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
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{settings.blogTitle}</h1>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {/* Close button - mobile only */}
              <button
                onClick={onToggle}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors md:hidden"
                title="Close sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
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
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Select mode toolbar */}
        {filteredNotes.length > 0 && (
          <div
            className="px-4 py-2 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between"
            style={{ backgroundColor: 'var(--background-shade)' }}
          >
            <button
              onClick={handleToggleSelectMode}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                isSelectMode
                  ? 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              {isSelectMode ? 'Cancel' : 'Select'}
            </button>
            {isSelectMode && checkedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
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
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
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
                onClick={() => handleSelectNote(note.id)}
              />
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-zinc-700 text-xs text-gray-400 text-center">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}
