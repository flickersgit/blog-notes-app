'use client'

import { PATTERNS, PatternType } from '@/lib/contexts/SettingsContext'

interface PatternPickerProps {
  value: PatternType
  onChange: (pattern: PatternType) => void
}

export function PatternPicker({ value, onChange }: PatternPickerProps) {
  return (
    <div className="flex gap-3">
      {PATTERNS.map((pattern) => (
        <button
          key={pattern.value}
          type="button"
          onClick={() => onChange(pattern.value)}
          className={`
            flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
            ${value === pattern.value
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div
            className={`w-12 h-12 rounded border border-gray-200 bg-white ${
              pattern.value === 'dots' ? 'pattern-dots' :
              pattern.value === 'lines' ? 'pattern-lines' : ''
            }`}
          />
          <span className="text-xs text-gray-600">{pattern.name}</span>
        </button>
      ))}
    </div>
  )
}
