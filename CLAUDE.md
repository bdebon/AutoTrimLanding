# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Package manager: **pnpm**

```bash
pnpm dev          # Start dev server with Turbopack (DO NOT RUN - user handles this)
pnpm build        # Production build (DO NOT RUN - user handles this)
pnpm lint         # Run ESLint
pnpm start        # Start production server
```

**Important**: Ne jamais lancer `pnpm dev` ou `pnpm build` - l'utilisateur le fait lui-même.

## Architecture

### Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **GSAP** for scroll animations
- **Three.js + React Three Fiber** for 3D effects
- **next-intl** for i18n (en, fr, es, zh)

### Project Structure
```
app/
├── [locale]/           # Locale-based routing (en/fr/es/zh)
│   ├── page.tsx        # Landing page
│   ├── compare/        # Competitor comparison pages
│   ├── download/       # Download page
│   └── legal/privacy/terms/refund/
├── layout.tsx          # Root layout with analytics
└── globals.css

components/             # React components (mix of .jsx/.tsx)
messages/               # Translation JSON files (en.json, fr.json, etc.)
i18n/                   # next-intl configuration
lib/tracking.ts         # Analytics helpers (Meta, GTM, PostHog)
hooks/                  # Custom hooks (useAttribution, useTranslation)
```

### Key Patterns
- Client components use `"use client"` directive
- Translations via `useTranslations()` from next-intl
- GSAP animations with `useLayoutEffect` + `ScrollTrigger`
- Analytics: centralized in `lib/tracking.ts` with typed `trackEvent()`

## Code Style
- Indentation: 2 spaces for ts/tsx/js/jsx files
- Prefer minimal code - optimize for fewer lines
- Clean up unused imports, dead code, and duplications after each task
