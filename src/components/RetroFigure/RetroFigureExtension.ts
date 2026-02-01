import { Node, mergeAttributes } from '@tiptap/core'
import type { AnimationType } from './figures'

export interface RetroFigureOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    retroFigure: {
      insertRetroFigure: (options: { figure: string; animation: AnimationType }) => ReturnType
    }
  }
}

export const RetroFigureExtension = Node.create<RetroFigureOptions>({
  name: 'retroFigure',

  group: 'inline',

  inline: true,

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      figure: {
        default: 'steve',
        parseHTML: element => element.getAttribute('data-figure'),
        renderHTML: attributes => ({
          'data-figure': attributes.figure,
        }),
      },
      animation: {
        default: 'idle',
        parseHTML: element => element.getAttribute('data-animation'),
        renderHTML: attributes => ({
          'data-animation': attributes.animation,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-retro-figure]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-retro-figure': '',
        class: `retro-figure retro-figure--${HTMLAttributes['data-figure']} retro-figure--${HTMLAttributes['data-animation']}`,
      }),
    ]
  },

  addCommands() {
    return {
      insertRetroFigure:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
