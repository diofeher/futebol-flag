# ⚽ Futebol Flag

A football team badge quiz game. Test your knowledge of club crests from leagues worldwide.

**Live**: [www.diofeher.net/futebol-flag](http://www.diofeher.net/futebol-flag/)

## Features

- **4 Quiz Modes**: Flag→Team, Team→Flag, Flag→City, Year Founded comparison
- **108+ teams** across 14 leagues (Brazil, Argentina, England, Spain, Italy, Germany, France, Portugal, Netherlands, Mexico, USA, Colombia, Uruguay, Chile)
- **Stats & Streaks**: Best scores, games played, streak tracking (localStorage)
- **Library**: Filterable card grid of all teams with badges, colors, founding year
- **Dark mode**: Automatic via `prefers-color-scheme`
- **Mobile responsive**

## Tech Stack

- React 19 + TypeScript
- Vite 8
- CSS Modules (scoped, co-located)
- No router library (hash-based `useRoute` hook)
- No state management library (`useReducer` + Context)

## Architecture

```
src/
├── types/              # Team, League, Quiz, Stats interfaces
├── data/               # Static team & league data
├── lib/                # Pure utilities (shuffle, localStorage wrapper)
├── quiz/               # Quiz engine (framework-agnostic)
│   ├── modes/          # Plugin: one file per quiz mode
│   ├── registry.ts     # Mode registration
│   ├── quizReducer.ts  # Pure state machine
│   ├── generateRound.ts
│   └── questionFactory.ts
├── hooks/              # useQuiz, useStats, useTeamFilter
├── context/            # StatsContext (shared across Header + Quiz)
├── routes/             # Hash-based router hook
├── components/         # Shared UI (Header, Badge)
├── pages/
│   ├── QuizPage/       # Primary: mode selector, question cards, results
│   └── LibraryPage/    # Secondary: filter bar, team card grid
└── styles/             # CSS tokens (light/dark), reset
```

### Key Design Decisions

- **Quiz-first**: Landing page is the quiz mode selector, library is secondary via nav
- **Plugin quiz engine**: Add a new quiz mode = 1 new file in `quiz/modes/` + 1 line in `registry.ts`. Nothing else changes.
- **`useReducer`** for quiz state (cleaner than 6+ `useState` with 4 modes)
- **StatsContext** for sharing stats between Header (streak badge) and QuizPage
- **No router dep** — only 2 views, hash-based hook is 15 lines

### Data Model

```typescript
interface Team {
  id: string;           // Slug, matches badge filename
  name: string;
  shortName: string;    // 3-letter abbreviation
  city: string;
  state: string;        // State/region
  country: string;
  leagueId: string;     // FK to League
  foundedYear: number;
  badgeUrl: string;     // /badges/<league>/<team>.svg
  colors: [string, string];  // Primary + secondary hex
}
```

## Badge Assets

Team badge SVGs are stored in `public/badges/<league-id>/<team-id>.svg`.

### Sources

- **Primary**: [Wikimedia Commons](https://commons.wikimedia.org/) — SVG logos under various free licenses
- **Fetch script**: `scripts/fetch-badges.mjs` — downloads from Commons API using direct filename mapping
- **Search script**: `scripts/fix-missing-badges.mjs` — searches Commons for missing badges
- **Placeholders**: Shield-shaped SVGs with team colors and abbreviation, auto-generated for any team without a real badge

### Adding Badges

1. Find the SVG on Wikimedia Commons
2. Save to `public/badges/<league-id>/<team-id>.svg`
3. Team's `badgeUrl` in `data/teams.ts` already points to the correct path

### Licensing Note

Club badges from Wikimedia Commons are available under various licenses (CC-BY-SA, public domain, etc.). Some may be trademarked — this project uses them for educational/quiz purposes. Check individual file pages on Commons for specific licensing.

## Development

```bash
npm install
npm run dev       # Start dev server at localhost:5173
npm run build     # Production build to dist/
npx tsc --noEmit  # Type check
```

## Deployment

Automatic via GitHub Actions on push to `main`:
- Workflow: `.github/workflows/deploy.yml`
- Target: GitHub Pages
- URL: `https://www.diofeher.net/futebol-flag/`

The `base` path in `vite.config.ts` is set to `/futebol-flag/` for GitHub Pages subpath.

## Adding a New Quiz Mode

1. Create `src/quiz/modes/myNewMode.ts` implementing `QuizModeDefinition`
2. Add to `QUIZ_MODES` array in `src/quiz/registry.ts`
3. Add the mode ID to `QuizModeId` union in `src/types/quiz.ts`
4. Add default stats entry in `src/types/stats.ts`

## Adding a New League

1. Add league entry to `src/data/leagues.ts`
2. Add team entries to `src/data/teams.ts`
3. Add badge SVGs to `public/badges/<league-id>/`
4. No code changes needed — filters auto-populate from data

## Project Structure

```
futebol-flag/
├── .github/workflows/deploy.yml  # GitHub Pages deploy
├── public/badges/                 # SVG badge assets (by league)
├── scripts/
│   ├── fetch-badges.mjs           # Download badges from Wikimedia Commons
│   └── fix-missing-badges.mjs     # Search & fix missing badges
├── src/                           # Application source (see Architecture above)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
