'use client'

import { PRESET_COLORS } from '@/lib/contexts/SettingsContext'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

function getColorNameFromValue(value: string): string {
  const preset = PRESET_COLORS.find(c => c.light.value === value || c.dark.value === value)
  return preset?.name || 'Cream'
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const selectedName = getColorNameFromValue(value)

  return (
    <div className="grid grid-cols-4 gap-3">
      {PRESET_COLORS.map((color) => {
        const isSelected = selectedName === color.name

        return (
          <button
            key={color.name}
            type="button"
            onClick={() => onChange(color.light.value)}
            className={`
              flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all
              ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2' : 'hover:bg-gray-50'}
            `}
          >
            <div
              className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
              style={{ backgroundColor: color.light.value }}
            />
            <span className="text-xs text-gray-600">{color.name}</span>
          </button>
        )
      })}
    </div>
  )
}
