# Repository structure

This document explains how the repo is organized: what ships as the product, what is experimental, and what is archived reference code.

## Production app (`src/`)

The **main Vite + React application** lives under `src/`. Build and dev commands (`npm run dev`, `npm run build`) compile and bundle **only** what is imported from this tree (see `index.html`, `vite.config.ts`, and `tsconfig.app.json`).

Supporting assets for that app:

- **`public/`** — Static files served as-is.
- **`server/`** — Optional Node API used in local development (`npm run dev:server` / `dev:all`).
- **`package.json`** — Root app dependencies and scripts.

## Experiments (`experiments/`)

Standalone or sandbox projects that are **not** part of the production bundle. They may have their own `package.json` and Vite/TS setup. Use them for spikes, isolated prototypes, or demos.

| Path | Notes |
|------|--------|
| `experiments/futurelaunch/` | Retirement activation hub prototype (formerly `futurelaunch---retirement-activation-hub` under `_isolated`). |
| `experiments/_isolated/` | Reserved for other isolated snapshots; may be empty aside from incidental files. |

## Archive (`archive/`)

**Legacy or reference** mini-apps and dumps kept for history and design/code reference. They are **not** imported by the main app. Run them only if you `cd` into the subfolder and use that project’s own tooling.

| Path | Notes |
|------|--------|
| `archive/figma-dump/` | Figma-to-code dumps (e.g. retiresmart pre-enrollment mini-app); previously under `src/figma-dump`. |
| `archive/core-ascend---retirement-command-center/` | Earlier retirement command-center exploration. |
| `archive/lumina-retirement/` | Earlier Lumina retirement UI/reference. |
| `archive/intelligent-plan-selector/` | Plan selector reference / design source. |

## Other top-level folders

- **`docs/`** — Architecture notes, audits, and this structure guide.
- **`netlify/`**, **`supabase/`**, **`scripts/`** — Deployment, database, and tooling aligned with the production app.

When in doubt: if it is under **`src/`** and reachable from the app entry, it is production surface area; everything under **`experiments/`** and **`archive/`** is intentionally outside the default app build.
