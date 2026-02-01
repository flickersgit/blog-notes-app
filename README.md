# Blog Notes App - Apple Notes Style

A minimalist blogging platform with Apple Notes aesthetic and user experience.

**Live URL:** https://blog-notes-app.vercel.app
**Repository:** https://github.com/flickersgit/blog-notes-app

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Vercel Postgres (Neon)
- **ORM:** Prisma
- **Editor:** TipTap (WYSIWYG)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

## Features

### Homepage (`/`)
- Display list of published articles
- "+" button to create new note & open editor directly

### Admin Page (`/admin`)
- Single-page app with sidebar + editor layout
- "+" button to create new note
- Back button to return to homepage
- Search notes by title/content
- Auto-save while typing (2 second debounce)
- Toggle Draft/Published status
- Select mode for bulk delete (round checkboxes)

### Blog Detail (`/blog/[slug]`)
- Read-only page for visitors
- Renders HTML content from TipTap editor

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── admin/page.tsx        # Admin editor
│   ├── blog/[slug]/page.tsx  # Article detail
│   └── api/posts/            # API routes (CRUD)
├── components/
│   ├── NotesSidebar.tsx      # Sidebar with notes list
│   ├── NoteEditor.tsx        # TipTap editor
│   ├── NoteItem.tsx          # Sidebar item
│   ├── NewNoteButton.tsx     # + button on homepage
│   └── SearchBar.tsx         # Search component
└── lib/
    ├── prisma.ts             # Database client
    └── hooks/useAutoSave.ts  # Auto-save hook
```

## Database Schema

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String   @default("Untitled")
  slug      String   @unique
  content   String   @default("")
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Vercel Postgres)

### Installation

1. Clone the repository
```bash
git clone https://github.com/flickersgit/blog-notes-app.git
cd blog-notes-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

4. Push database schema
```bash
npx prisma db push
```

5. Run development server
```bash
npm run dev
```

6. Open http://localhost:3000

## Deployment

This project is configured for Vercel deployment:

1. Push to GitHub
2. Connect repo to Vercel
3. Create Vercel Postgres database
4. Deploy automatically

## License

MIT
