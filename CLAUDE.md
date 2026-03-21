# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fletex Dashboard — a transportation/fleet management SPA for a bus company. Built with React 19, TypeScript, Vite, and Supabase. Deployed on Vercel. The codebase is written in **Spanish** (variable names, UI text, comments).

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint`
- **Preview production build:** `npm run preview`
- **Add shadcn component:** `npx shadcn@latest add <component>`

No test framework is configured.

## Architecture

### Routing & Layouts

`src/router/index.tsx` defines three route groups:
1. **Public** (`PublicLayout`) — landing page, payment results
2. **Auth** (`AuthLayout`) — login page
3. **Protected** (`ProtectedRoute` → `AppLayout`) — all `/dashboard/*` routes

`ProtectedRoute` checks `useAuthStore` for an authenticated user; unauthenticated users redirect to `/login`. `RoleRoute` provides additional role-based gating.

### Feature Modules

Each domain lives in `src/features/<module>/` with a consistent pattern:
- `<Module>Page.tsx` — main page component
- `<module>Store.ts` — Zustand store with Supabase queries
- `Modal<Entity>.tsx` — create/edit dialogs
- `components/` — module-specific subcomponents

Active modules: agencias, auth, conductores, dashboard, liquidaciones, regiones, reportes, reservas, rutas, vehiculos, viajes.

### State Management

**Zustand** stores in two locations:
- `src/store/` — global stores (auth, theme, landing, pago resultado)
- `src/features/*/` — feature-scoped stores colocated with their module

`authStore` handles login via Supabase Auth, loads user profile from the `usuarios` table, and enforces dashboard-allowed roles (`super_admin`, `admin_regional`, `encargado_agencia`).

### Backend / Data

**Supabase** is the sole backend. Client is configured in `src/supabase/client.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars. Database types are generated in `src/supabase/types.ts`. Row type aliases are re-exported from `src/types/index.ts`.

### UI Layer

- **shadcn/ui** (radix-nova style) with Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Path alias: `@` → `src/` (configured in `vite.config.ts` and `components.json`)
- Icons: `lucide-react`
- Charts: `recharts`
- Maps: `mapbox-gl` / `react-map-gl`
- Animations: `lottie-react`
- Toasts: `sonner`
- Theme: light/dark toggle managed by `themeStore`

### Roles & Permissions

Five roles defined in `src/lib/constants.ts`: `super_admin`, `admin_regional`, `encargado_agencia`, `conductor`, `pasajero`. Only the first three can access the dashboard. The `usePermisos` hook (`src/hooks/usePermisos.ts`) provides role-based permission checks in components.

### Key Conventions

- Spanish naming throughout: `usuario`, `cerrarSesion`, `cargando`, `listo`, etc.
- Feature stores follow the pattern: state + async actions that call `supabase.from(table)` and update Zustand state
- Vercel SPA rewrites configured in `vercel.json`
