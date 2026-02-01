'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export const PRESET_COLORS = [
  { name: 'Cream', value: '#FFFEF5', shade: '#FDF9E8' },
  { name: 'White', value: '#FFFFFF', shade: '#F5F5F5' },
  { name: 'Rose', value: '#FFF5F5', shade: '#FEE8E8' },
  { name: 'Peach', value: '#FFF8F0', shade: '#FEEED8' },
  { name: 'Mint', value: '#F0FFF4', shade: '#D8F5E0' },
  { name: 'Sky', value: '#F0F9FF', shade: '#D8EEFE' },
  { name: 'Lavender', value: '#FAF5FF', shade: '#EDE5F5' },
  { name: 'Gray', value: '#FAFAFA', shade: '#ECECEC' },
]

function getShadeForColor(color: string): string {
  const preset = PRESET_COLORS.find(c => c.value === color)
  return preset?.shade || '#F5F5F5'
}

export const PATTERNS = [
  { name: 'Plain', value: 'plain' },
  { name: 'Dots', value: 'dots' },
  { name: 'Lines', value: 'lines' },
] as const

export type PatternType = 'plain' | 'dots' | 'lines'

interface Settings {
  blogTitle: string
  backgroundColor: string
  pattern: PatternType
}

interface SettingsContextType {
  settings: Settings
  isLoading: boolean
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
}

const defaultSettings: Settings = {
  blogTitle: 'Notes',
  backgroundColor: '#FFFEF5',
  pattern: 'plain',
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings({
            blogTitle: data.blogTitle,
            backgroundColor: data.backgroundColor,
            pattern: data.pattern || 'plain',
          })
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--background', settings.backgroundColor)
    document.documentElement.style.setProperty('--background-shade', getShadeForColor(settings.backgroundColor))
  }, [settings.backgroundColor])

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        const data = await response.json()
        setSettings({
          blogTitle: data.blogTitle,
          backgroundColor: data.backgroundColor,
          pattern: data.pattern || 'plain',
        })
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
      throw error
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, isLoading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
