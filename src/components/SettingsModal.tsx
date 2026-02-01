'use client'

import { useState, useEffect } from 'react'
import { useSettings, PatternType } from '@/lib/contexts/SettingsContext'
import { ColorPicker } from './ColorPicker'
import { PatternPicker } from './PatternPicker'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings()
  const [blogTitle, setBlogTitle] = useState(settings.blogTitle)
  const [backgroundColor, setBackgroundColor] = useState(settings.backgroundColor)
  const [pattern, setPattern] = useState<PatternType>(settings.pattern)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setBlogTitle(settings.blogTitle)
    setBackgroundColor(settings.backgroundColor)
    setPattern(settings.pattern)
  }, [settings, isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings({ blogTitle, backgroundColor, pattern })
      onClose()
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges =
    blogTitle !== settings.blogTitle ||
    backgroundColor !== settings.backgroundColor ||
    pattern !== settings.pattern

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Name
            </label>
            <input
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value.slice(0, 30))}
              placeholder="Enter blog name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800"
            />
            <p className="mt-1 text-xs text-gray-400 text-right">
              {blogTitle.length}/30
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Theme
            </label>
            <ColorPicker value={backgroundColor} onChange={setBackgroundColor} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pattern
            </label>
            <PatternPicker value={pattern} onChange={setPattern} />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex-1 px-4 py-2 text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
