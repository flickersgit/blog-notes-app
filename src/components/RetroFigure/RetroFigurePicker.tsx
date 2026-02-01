'use client'

import { useState, useRef, useEffect } from 'react'
import { FIGURES, ANIMATIONS, type AnimationType } from './figures'

interface RetroFigurePickerProps {
  onSelect: (figure: string, animation: AnimationType) => void
  onClose: () => void
}

export function RetroFigurePicker({ onSelect, onClose }: RetroFigurePickerProps) {
  const [selectedFigure, setSelectedFigure] = useState<string | null>(null)
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>('idle')
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleFigureClick = (figureId: string) => {
    setSelectedFigure(figureId)
  }

  const handleInsert = () => {
    if (selectedFigure) {
      onSelect(selectedFigure, selectedAnimation)
      onClose()
    }
  }

  const minecraftFigures = FIGURES.filter(f => f.category === 'minecraft')
  const legoFigures = FIGURES.filter(f => f.category === 'lego')

  return (
    <div
      ref={pickerRef}
      className="absolute z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 p-4 w-72"
      style={{ top: '100%', left: 0, marginTop: '8px' }}
    >
      <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
        Choose a Figure
      </div>

      {/* Minecraft Characters */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Minecraft</div>
        <div className="grid grid-cols-5 gap-2">
          {minecraftFigures.map(figure => (
            <button
              key={figure.id}
              onClick={() => handleFigureClick(figure.id)}
              className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                selectedFigure === figure.id
                  ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-900/30'
                  : 'bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600'
              }`}
              title={figure.name}
            >
              <span
                className={`retro-figure retro-figure--${figure.id} retro-figure--idle`}
                style={{ transform: 'scale(1.5)' }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lego Characters */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Lego</div>
        <div className="grid grid-cols-5 gap-2">
          {legoFigures.map(figure => (
            <button
              key={figure.id}
              onClick={() => handleFigureClick(figure.id)}
              className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                selectedFigure === figure.id
                  ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-900/30'
                  : 'bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600'
              }`}
              title={figure.name}
            >
              <span
                className={`retro-figure retro-figure--${figure.id} retro-figure--idle`}
                style={{ transform: 'scale(1.5)' }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Animation Selection */}
      {selectedFigure && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Animation</div>
          <div className="grid grid-cols-4 gap-2">
            {ANIMATIONS.map(anim => (
              <button
                key={anim.id}
                onClick={() => setSelectedAnimation(anim.id)}
                className={`px-2 py-1.5 rounded text-xs font-medium transition-all ${
                  selectedAnimation === anim.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                }`}
              >
                {anim.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {selectedFigure && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-zinc-900 rounded-md flex items-center justify-center">
          <span
            className={`retro-figure retro-figure--${selectedFigure} retro-figure--${selectedAnimation}`}
            style={{ transform: 'scale(2)' }}
          />
        </div>
      )}

      {/* Insert Button */}
      <button
        onClick={handleInsert}
        disabled={!selectedFigure}
        className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
          selectedFigure
            ? 'bg-amber-500 hover:bg-amber-600 text-white'
            : 'bg-gray-200 dark:bg-zinc-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        Insert Figure
      </button>
    </div>
  )
}
