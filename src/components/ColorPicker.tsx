'use client'

import { PRESET_COLORS } from '@/lib/contexts/SettingsContext'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {PRESET_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onChange(color.value)}
          className={`
            flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all
            ${value === color.value ? 'ring-2 ring-amber-500 ring-offset-2' : 'hover:bg-gray-50'}
          `}
        >
          <div
            className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
            style={{ backgroundColor: color.value }}
          />
          <span className="text-xs text-gray-600">{color.name}</span>
        </button>
      ))}
    </div>
  )
}
