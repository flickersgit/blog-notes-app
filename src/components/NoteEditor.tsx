'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback } from 'react'
import { useAutoSave } from '@/lib/hooks/useAutoSave'

interface NoteEditorProps {
  postId: string
  initialTitle: string
  initialContent: string
  published: boolean
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onPublishToggle: (published: boolean) => void
  onSaved: () => void
}

export function NoteEditor({
  postId,
  initialTitle,
  initialContent,
  published,
  onTitleChange,
  onContentChange,
  onPublishToggle,
  onSaved,
}: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-stone max-w-none min-h-[calc(100vh-200px)] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent)
    }
  }, [postId, initialContent, editor])

  const { isSaving, lastSaved } = useAutoSave({
    postId,
    title: initialTitle,
    content: editor?.getHTML() || '',
    onSaveSuccess: onSaved,
  })

  const handlePublishToggle = useCallback(async () => {
    const newPublished = !published

    try {
      await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newPublished }),
      })
      onPublishToggle(newPublished)
    } catch (error) {
      console.error('Failed to toggle publish status:', error)
    }
  }, [postId, published, onPublishToggle])

  if (!postId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-amber-50/30">
        <div className="text-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <p>Select a note or create a new one</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-amber-50/30">
      <div className="border-b border-gray-200 px-8 py-4 bg-white/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePublishToggle}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                published
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {published ? 'Published' : 'Draft'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Saved</span>
              </>
            ) : null}
          </div>
        </div>
        <input
          type="text"
          value={initialTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
          className="w-full text-2xl font-semibold text-gray-800 bg-transparent border-none focus:outline-none placeholder-gray-300"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
