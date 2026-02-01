'use client'

import { formatDistanceToNow } from 'date-fns'

interface NoteItemProps {
  id: string
  title: string
  content: string
  updatedAt: Date
  isSelected: boolean
  isSelectMode: boolean
  isChecked: boolean
  onCheck: (checked: boolean) => void
  onClick: () => void
}

export function NoteItem({
  title,
  content,
  updatedAt,
  isSelected,
  isSelectMode,
  isChecked,
  onCheck,
  onClick,
}: NoteItemProps) {
  const preview = content
    .replace(/<[^>]*>/g, '')
    .slice(0, 60)
    .trim()

  const isHighlighted = (isSelected && !isSelectMode) || isChecked

  return (
    <div
      onClick={isSelectMode ? () => onCheck(!isChecked) : onClick}
      className="px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors"
      style={{
        backgroundColor: isHighlighted ? 'var(--background-shade)' : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isHighlighted) {
          e.currentTarget.style.backgroundColor = 'var(--background-shade)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isHighlighted) {
          e.currentTarget.style.backgroundColor = ''
        }
      }}
    >
      <div className="flex items-start gap-3">
        {isSelectMode && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              e.stopPropagation()
              onCheck(e.target.checked)
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 h-4 w-4 rounded-full border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
          />
        )}
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
      </div>
    </div>
  )
}
