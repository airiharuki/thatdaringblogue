# that daring blogue

![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-1.4.4-000000?logo=bun&logoColor=white)

> Technical writing, audio experiments & software engineering.

A single-page portfolio and technical journal for independent electronic music and Web Audio
engineering. Static, client-side only — no backend, no CMS, no database.

**Live:** [thatdaringblogue.me](https://thatdaringblogue.me)

---

## Overview

The site is a React SPA split into five tabs — **Overview**, **Music & Demos**, **Projects**,
**Writing**, and **About & Gear** — all rendered from one content file and built into static
HTML/CSS/JS by Vite.

Everything is deliberately dependency-free on the UI side: no router, no component library, no
`wavesurfer.js`. The audio player, waveform renderer, and reader overlay are hand-rolled, which
keeps the production bundle at roughly **199 kB JS (65 kB gzipped)**.

## Features

- **Custom waveform player** — audio is fetched once, decoded with `AudioContext.decodeAudioData`,
  and reduced to a peak array that is cached in memory and reused across every player instance.
  Seeking works by pointer drag with sub-pixel precision.
- **Single-playback coordination** — a module-level registry pauses any other `<audio>` element
  before a new track starts, so overlapping playback is impossible.
- **Persistent mini player** — a fixed bar reflecting the current track, driven entirely by
  `CustomEvent`s (`morrow:nowplaying`, `morrow:miniplayer-control`) rather than prop drilling.
- **Article reader overlay** — posts open in a focused modal instead of navigating away.
- **Filterable collections** — projects and articles filter by category without a routing round-trip.
- **Light / dark themes** — swapped via a `theme-dark` / `theme-light` class and per-theme waveform
  palettes.
- **Mobile-aware layout** — a single `810px` breakpoint drives both CSS and waveform bar sizing.
- **Dropbox link normalization** — shared Dropbox URLs are rewritten to direct-download URLs at
  runtime, so audio can be sourced from Dropbox without editing the player.

## Tech stack

| Layer | Choice |
| --- | --- |
| Package manager & script runner | **Bun 1.4.4** (`bun.lock`) |
| Bundler / dev server | Vite 6.4 |
| UI | React 18.3 |
| Language | TypeScript 5.6 (strict, `noEmit` — types only) |
| Styling | Hand-written CSS with custom properties (`src/index.css`) |
| Hosting | GitHub Pages, deployed by GitHub Actions |
| Domain | `thatdaringblogue.me` via `public/CNAME` |

**Node.js is not required.** Every script runs under Bun.

## Getting started

```bash
bun install
bun run dev
```

Then open <http://localhost:5173>.

If Bun reports a lockfile mismatch, the lockfile is authoritative — run `bun install` without
`--frozen-lockfile` to update it deliberately.

## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Vite dev server with HMR |
| `bun run build` | `tsc -b` type-check, then `vite build` → `dist/` |
| `bun run preview` | Serve the built `dist/` locally |
| `bun run deploy` | Build and publish `dist/` to the `gh-pages` branch (manual fallback) |

## Project structure

```
.
├─ .github/workflows/deploy.yml   CI: build on Bun, deploy to Pages
├─ public/
│  ├─ audio/                      MP3 sources referenced by content
│  ├─ icons/                      favicons & touch icons
│  ├─ CNAME                       custom domain for Pages
│  └─ .nojekyll                   disable Jekyll processing
├─ src/
│  ├─ components/
│  │  ├─ ArticleCard.tsx          article list row
│  │  ├─ ArticleModal.tsx         reader overlay
│  │  ├─ AudioWaveform.tsx        decode + cache + render + seek
│  │  ├─ Masthead.tsx             brand, tabs, theme toggle
│  │  ├─ MiniPlayer.tsx           global now-playing bar
│  │  └─ ProjectCard.tsx          project tile
│  ├─ data/
│  │  ├─ siteContent.ts           ← all copy and content lives here
│  │  ├─ tracks.ts                audio track metadata
│  │  └─ types.ts                 content interfaces
│  ├─ App.tsx                     tab state, filtering, layout
│  ├─ index.css                   full design system
│  └─ main.tsx                    React entry point
├─ index.html                     meta tags, Open Graph, icons
├─ bun.lock                       the only committed lockfile
├─ tsconfig.json
└─ vite.config.ts
```

## Editing content

All copy, links, tracks, projects, articles, and gear lists come from
**`src/data/siteContent.ts`**, typed against the interfaces in `src/data/types.ts`. There is no CMS
and no Markdown pipeline — content is TypeScript objects, so a typo in a required field fails the
build instead of rendering blank.

**To add a track:**

1. Drop the file in `public/audio/`.
2. Add a `TrackItem` to `catalog.tracks` in `siteContent.ts`, pointing `audioUrl` at `/audio/…`
   (or paste a Dropbox share link — it is normalized at runtime).

**To add a project or article:** append to `projects.items` / `articles.items`. Filter pills are
generated from the `category` values already present in the app, so keep new categories in sync with
`App.tsx`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which:

1. checks out the repo,
2. installs **Bun 1.4.4**, runs `bun install --frozen-lockfile`,
3. builds with `bun run build`,
4. uploads `dist/` as a Pages artifact and deploys it.

GitHub Pages is configured with **source: GitHub Actions** (not the `gh-pages` branch). The custom
domain is declared in `public/CNAME`, so it survives deploys.

`bun run deploy` remains available as a manual fallback; it pushes to the `gh-pages` branch, which
Pages no longer serves.

### Troubleshooting

- **"The certificate does not exist yet"** when enabling HTTPS enforcement — GitHub is still issuing
  the TLS certificate for the custom domain. Retry later:
  ```bash
  gh api -X PUT repos/airiharuki/thatdaringblogue/pages -F https_enforced=true
  ```
- **Workflow push rejected for missing `workflow` scope** — the `gh` OAuth token cannot modify
  `.github/workflows/*`. Push over SSH, or run `gh auth refresh -s workflow`.

## Conventions

- **Lockfile policy:** `bun.lock` only. `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml` are
  git-ignored so the dependency graph cannot silently fork.
- **Line endings:** `bun.lock` is pinned to LF via `.gitattributes` to survive Windows `autocrlf`.
- **Type-only TypeScript:** `tsc -b` never emits; Vite owns the build. `tsconfig.tsbuildinfo` is a
  cache artifact and is ignored.

## Author

**Haruki** — [@airiharuki](https://github.com/airiharuki)

No license file is present; all rights reserved unless stated otherwise.
