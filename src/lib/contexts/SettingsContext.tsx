'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useTheme } from 'next-themes'

export const PRESET_COLORS = [
  {
    name: 'Cream',
    light: { value: '#FFFEF5', shade: '#FDF9E8' },
    dark: { value: '#1C1A14', shade: '#252218' }
  },
  {
    name: 'White',
    light: { value: '#FFFFFF', shade: '#F5F5F5' },
    dark: { value: '#18181B', shade: '#27272A' }
  },
  {
    name: 'Rose',
    light: { value: '#FFF5F5', shade: '#FEE8E8' },
    dark: { value: '#1C1517', shade: '#2A1F21' }
  },
  {
    name: 'Peach',
    light: { value: '#FFF8F0', shade: '#FEEED8' },
    dark: { value: '#1C1814', shade: '#2A2419' }
  },
  {
    name: 'Mint',
    light: { value: '#F0FFF4', shade: '#D8F5E0' },
    dark: { value: '#141C16', shade: '#1A2A1E' }
  },
  {
    name: 'Sky',
    light: { value: '#F0F9FF', shade: '#D8EEFE' },
    dark: { value: '#141820', shade: '#1A2430' }
  },
  {
    name: 'Lavender',
    light: { value: '#FAF5FF', shade: '#EDE5F5' },
    dark: { value: '#1A161C', shade: '#261F2A' }
  },
  {
    name: 'Gray',
    light: { value: '#FAFAFA', shade: '#ECECEC' },
    dark: { value: '#18181B', shade: '#27272A' }
  },
]

function getColorsForTheme(colorName: string, isDark: boolean) {
  const preset = PRESET_COLORS.find(c => c.name === colorName)
  if (!preset) {
    return isDark
      ? { value: '#1C1A14', shade: '#252218' }
      : { value: '#FFFEF5', shade: '#FDF9E8' }
  }
  return isDark ? preset.dark : preset.light
}

function getColorNameFromValue(value: string): string {
  const preset = PRESET_COLORS.find(c => c.light.value === value || c.dark.value === value)
  return preset?.name || 'Cream'
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
  footnote: string
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
  footnote: 'Built with Apple Notes style',
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
            footnote: data.footnote || 'Built with Apple Notes style',
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
    if (!mounted) return

    const colorName = getColorNameFromValue(settings.backgroundColor)
    const isDark = resolvedTheme === 'dark'
    const colors = getColorsForTheme(colorName, isDark)

    document.documentElement.style.setProperty('--background', colors.value)
    document.documentElement.style.setProperty('--background-shade', colors.shade)
  }, [settings.backgroundColor, resolvedTheme, mounted])

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
          footnote: data.footnote || 'Built with Apple Notes style',
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
