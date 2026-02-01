'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function NewNoteButton() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleClick = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/posts', { method: 'POST' })
      const newNote = await response.json()
      router.push(`/admin?note=${newNote.id}`)
    } catch (error) {
      console.error('Failed to create note:', error)
      router.push('/admin')
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isCreating}
      className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
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
  )
}
