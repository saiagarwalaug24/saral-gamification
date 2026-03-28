# SARAL — Campaign Gamification

A production-grade React application for managing campaign reward systems. Built as a single-page app with a multi-step modal workflow for creating, configuring, and managing affiliate rewards.

![Landing Page](https://img.shields.io/badge/React-19.2-blue) ![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11-purple) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-cyan) ![Next.js](https://img.shields.io/badge/Next.js-16.1-black) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)

---

## Features

### Landing Page
- Gamification onboarding screen with decorative grid background and gradient blobs
- Three feature cards (Reward Ambassadors, Set Milestones, Customise Incentives)
- "Enable Gamification" CTA that transitions to the reward management view

### Reward Creation (Multi-Step Modal)
- **Reward Event Selection** — Three configurable event triggers:
  - *Cross $X in sales* — inline dollar amount input with real-time label update
  - *Posts X times every Y period* — count input + duration dropdown (14 days, 1 month, 2 months, 3 months, 1 year)
  - *Is Onboarded* — no additional input required
- **Reward Type Selection** — Flat bonus with inline dollar input; Upgrade Commission Tier (disabled, placeholder for future implementation)
- **Time-Bound Toggle** — Optional end date with a custom calendar date picker (tomorrow onwards only, back navigation disabled at current month)
- **Edit Flow** — Confirmed selections show a summary chip with pencil icon to re-edit

### Reward Management
- Card-based grid displaying all created rewards
- Each card shows: event trigger, reward outcome, and optional expiry date
- Delete on hover with confirmation
- Empty state with CTA

### Calendar
- Full 6-row grid (42 cells) with adjacent month dates visible
- Circular purple highlight on selected date
- Date format: `10 Oct, 2025`
- Only future dates selectable (tomorrow onwards)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| State Management | [Redux Toolkit 2](https://redux-toolkit.js.org/) + [React Redux 9](https://react-redux.js.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Fonts | DM Sans, Plus Jakarta Sans, JetBrains Mono (via `next/font/google`) |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with providers + ErrorBoundary
│   ├── page.tsx                      # Main page (sidebar + tabs + content)
│   ├── providers/
│   │   ├── redux-provider.tsx        # Redux Provider wrapper
│   │   └── theme-provider.tsx        # next-themes Provider
│   ├── globals.css                   # Tailwind imports
│   └── theme.css                     # Design tokens (colors, fonts, shadows)
│
├── components/
│   ├── error-boundary.tsx            # React ErrorBoundary for resilience
│   ├── gamification/
│   │   ├── gamification-landing.tsx  # Onboarding page with grid background
│   │   ├── create-reward-modal.tsx   # Modal shell with view routing
│   │   ├── event-dropdown.tsx        # Reward event selector with inline inputs
│   │   ├── reward-dropdown.tsx       # Reward type selector
│   │   ├── date-picker.tsx           # Custom calendar date picker
│   │   └── rewards-list.tsx          # Reward cards grid + empty state
│   └── layout/
│       ├── sidebar.tsx               # Collapsible sidebar with mobile drawer
│       └── campaign-tabs.tsx         # Tab navigation (General, Preferences, Gamification)
│
├── lib/
│   ├── store/
│   │   ├── store.ts                  # Redux store configuration
│   │   ├── gamificationSlice.ts      # Business logic state (rewards, modal flow)
│   │   ├── uiSlice.ts               # Presentation state (tabs, sidebar, datepicker)
│   │   ├── hooks.ts                  # Typed useAppDispatch / useAppSelector
│   │   └── localStorageMiddleware.ts # Persistence middleware
│   ├── api.ts                        # Type-safe fetch wrapper
│   └── utils.ts                      # cn() utility (clsx + tailwind-merge)
│
├── hooks/                            # Reusable React hooks
│   ├── use-debounce.ts
│   ├── use-local-storage.ts
│   ├── use-media-query.ts            # useSyncExternalStore-based
│   ├── use-mounted.ts                # useSyncExternalStore-based
│   ├── use-copy-to-clipboard.ts
│   └── use-theme.ts
│
└── config/
    └── site.ts                       # App-wide constants
```

### State Management

**All application state lives in Redux** — zero `useState` in app components.

| Slice | Manages |
|-------|---------|
| `gamification` | `enabled`, `rewards[]`, modal flow (dropdowns, selections, configs, time-bound, end date) |
| `ui` | `activeTab`, `sidebarCollapsed`, `sidebarMobileOpen`, datepicker view state |

The `localStorageMiddleware` persists `enabled` and `rewards` across browser sessions.

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

---

## Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Set Node.js version to **20.x**
4. Deploy — no environment variables required

Or deploy via CLI:

```bash
npx vercel --prod
```

---

## Code Quality

| Check | Status |
|-------|--------|
| TypeScript strict mode | `"strict": true`, `noUnusedLocals`, `noUnusedParameters` |
| ESLint | `eslint-config-next/core-web-vitals` + `typescript` — zero errors |
| Zero `any` types | Verified |
| Zero `console.log` | Silent catch blocks in production code |
| Zero `TODO` / `FIXME` | Clean codebase |
| Accessibility | ARIA attributes on all interactive elements (`aria-modal`, `aria-expanded`, `aria-checked`, `aria-label`) |
| Semantic HTML | `<nav>`, `<header>`, `<aside>`, `<fieldset>`, `<legend>` |
| Error handling | `ErrorBoundary` wrapping the app in `layout.tsx` |
| State persistence | Redux → localStorage middleware |

---

## Responsive Design

| Breakpoint | Behavior |
|-----------|----------|
| Mobile (`< 1024px`) | Sidebar hidden → hamburger menu + slide-out drawer. Single-column card grid. Breadcrumb shortened. |
| Tablet (`1024px+`) | Full sidebar visible (collapsible). 2-column reward grid. |
| Desktop (`1280px+`) | 3-column reward grid. Full breadcrumb path. |

---

## License

Private — SARAL internal project.
