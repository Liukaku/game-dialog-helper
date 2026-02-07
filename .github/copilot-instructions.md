# Copilot Instructions for game-helper

## Project Overview

Game-helper is a **Next.js 15 dialog builder** for game development. It provides a UI to manage multi-page quest dialogs with branching responses. The application reads/writes JSON dialog files stored in `public/dialog/`.

## Build & Test Commands

```bash
# Development server (with Turbopack)
npm run dev

# Production build
npm build

# Start production server
npm start

# Linting
npm lint
```

## Architecture

### Data Flow
1. **Home page** (`app/page.tsx`) - Lists available dialog files from API
2. **Edit page** (`app/edit/[id]/page.tsx`) - Loads dialog data and syncs changes to file system
3. **API Routes**:
   - `GET /api/dialog` - Lists all JSON files in `public/dialog/`
   - `POST /api/dialog` - Creates new dialog file
   - `GET /api/dialog/[id]` - Loads specific dialog file
   - `POST /api/dialog/[id]` - Saves dialog changes to file

### Data Structure
Dialog files (JSON) follow the `Root` interface in `app/types.ts`:
- **General**: Tier-based options (e.g., character appearance)
- **Story**: Quest-based dialogs with multi-page support
  - Each quest has options with optional `pages` array for multi-page dialogs
  - Each response has `body`, `next` (link to next dialog), and `vibe` (tone/personality)

### Component Hierarchy
- `QuestForm` - Manages quest metadata and renders options
- `QuestOptionForm` - Edits individual option (key, body, image)
- `ResponseForm` - Edits responses/branches within an option

### State Management
- Page-level state with `useState` and `useEffect`
- Auto-save on state changes (debouncing not implemented - may cause frequent API calls)
- No external state library (Redux, Zustand, etc.)

## Key Conventions

### File Organization
- **UI Components** in `components/` - Form components for editing dialog
- **API Routes** in `app/api/` - File system operations
- **Pages** in `app/` - Client-rendered with `"use client"` directive
- **Types** in `app/types.ts` - Single source of truth for data shapes

### Naming Patterns
- Components use camelCase file names (e.g., `questForm.tsx`)
- API route conventions follow Next.js 13+ App Router pattern

### Styling
- **Dark Theme**: Slate-900 background with high-contrast light text for reduced eye strain
- **Visual Hierarchy with Color-Coded Levels**:
  - 🟦 **Sky (Blue)**: Quest containers with gradient headers
  - 🟩 **Emerald**: NPC options with nested indentation
  - 🟧 **Amber**: Player responses (double-nested)
  - 🟪 **Violet**: Multi-page dialogue sequences
- **Component Library**: Reusable Tailwind classes in `globals.css` for consistent styling
- **Form Styling**: Dark inputs with light borders, blue focus rings, uppercase labels
- **Button Variants**: Primary (sky), Secondary (emerald), Warning (amber), Danger (red), Tertiary (gray)
- **Responsive Layout**: Grid-based design adapting to screen size, proper spacing and shadows

### Type Definitions
- TypeScript strict mode enabled
- Path aliases configured: `@/*` points to repo root
- Missing types: some components may accept props without full interface definitions

## Important Notes

- Dialog files are stored on the file system (`public/dialog/`) - not a database
- The edit page auto-saves on every state change (consider adding debounce if performance issues arise)
- API routes use Node.js `fs` module directly (only works in server-side routes)
- Multi-page dialogs use the `pages` array on `Option2` interface
- The project uses React 19 with Server Components (RSC) configured
- **Dark theme** with color-coded visual hierarchy for better data structure clarity
- **Compact mode** available in ResponseForm for nested display vs. standalone editing
- Counter badges show option/response counts (e.g., "+ New Option (3)")
- Empty states guide users on next actions

## Useful Paths

```
app/
  page.tsx              # Home page (dialog list)
  types.ts              # Core data interfaces
  layout.tsx            # Root layout
  api/dialog/           # File system operations
  edit/[id]/page.tsx    # Dialog editor
components/
  questForm.tsx         # Quest editor component
  questOptionForm.tsx   # Option editor component
  responseForm.tsx      # Response editor component
public/dialog/          # JSON dialog files storage
```
