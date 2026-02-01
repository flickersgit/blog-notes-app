'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface UseAutoSaveOptions {
  postId: string
  title: string
  content: string
  onSaveSuccess?: () => void
  onSaveError?: (error: Error) => void
  debounceMs?: number
}

export function useAutoSave({
  postId,
  title,
  content,
  onSaveSuccess,
  onSaveError,
  debounceMs = 2000,
}: UseAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const isFirstRender = useRef(true)

  const save = useCallback(async () => {
    if (!postId) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      setLastSaved(new Date())
      onSaveSuccess?.()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onSaveError?.(error)
    } finally {
      setIsSaving(false)
    }
  }, [postId, title, content, onSaveSuccess, onSaveError])

  const debouncedSave = useDebouncedCallback(save, debounceMs)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (postId && (title || content)) {
      debouncedSave()
    }
  }, [postId, title, content, debouncedSave])

  return { isSaving, lastSaved, error, saveNow: save }
}
