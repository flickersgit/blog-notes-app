'use client'

import { formatDistanceToNow } from 'date-fns'

interface NoteItemProps {
  id: string
  title: string
  content: string
  updatedAt: Date
  isSelected: boolean
  onClick: () => void
  onDelete: () => void
}

export function NoteItem({
  title,
  content,
  updatedAt,
  isSelected,
  onClick,
  onDelete,
}: NoteItemProps) {
  const preview = content
    .replace(/<[^>]*>/g, '')
    .slice(0, 60)
    .trim()

  return (
    <div
      onClick={onClick}
      className={`group px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors ${
        isSelected ? 'bg-amber-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {title || 'Untitled'}
          </h3>
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {preview || 'No content'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
          title="Delete note"
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
        </button>
      </div>
    </div>
  )
}
