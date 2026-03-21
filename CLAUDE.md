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
- `Modal<Entity>.tsx` — create/edit dialogs (using shadcn `Dialog`)
- `components/` — module-specific subcomponents (`Tabla<Entity>.tsx`, `<Entity>Card.tsx`, `Estado<Entity>Badge.tsx`)

Active modules: agencias, auth, conductores, dashboard, liquidaciones, regiones, reportes, reservas, rutas, vehiculos, viajes.

### Page Composition Pattern

Every CRUD page follows this composition (see `ReservasPage.tsx` as reference):

```
<TablaPage>              ← header, search, filters, error banner
  <Tabla<Entity>>        ← desktop table (hidden on mobile)
  <Entity>Card           ← mobile cards (hidden on desktop)
  <TablaVacia>           ← empty state when no records
  panelDetalle={<PanelDetalle>}  ← side panel / bottom drawer
  paginacion={<Paginacion>}      ← server-side pagination controls
</TablaPage>
```

Each page uses local `useState` for UI state (search, filters, selected item) and the feature store for server data + pagination state.

### State Management

**Zustand** stores in two locations:
- `src/store/` — global stores (auth, theme, landing, pago resultado)
- `src/features/*/` — feature-scoped stores colocated with their module

`authStore` handles login via Supabase Auth, loads user profile from the `usuarios` table, and enforces dashboard-allowed roles (`super_admin`, `admin_regional`, `encargado_agencia`).

Feature stores follow a consistent interface pattern:
```ts
interface <Module>State {
  items: <Entity>[]
  cargando: boolean
  error: string | null
  // paginación server-side
  paginaActual: number
  totalRegistros: number
  totalPaginas: number
  // acciones
  cargar<Entities>: (filtros?, pagina?) => Promise<void>
  cambiarPagina: (pagina: number) => Promise<void>
  crear<Entity>: (datos) => Promise<boolean>
  actualizar<Entity>: (id, datos) => Promise<boolean>
  toggleEstado: (id, estadoActual) => Promise<boolean>
  limpiarError: () => void
}
```

Pagination uses Supabase `.range(from, to)` with `{ count: 'exact' }` and a `POR_PAGINA` constant (typically 8–10) exported from each store.

### Backend / Data

**Supabase** is the sole backend. Client is configured in `src/supabase/client.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars. Database types are generated in `src/supabase/types.ts`. Row type aliases (e.g., `UsuarioRow`, `ViajeRow`, `RolUsuario`) are re-exported from `src/types/index.ts`. Feature stores extend Row types with joined relations (e.g., `type Reserva = ReservaRow & { pasajero?: {...} | null }`).

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

Five roles defined in `src/lib/constants.ts` (`ROLES` constant): `super_admin`, `admin_regional`, `encargado_agencia`, `conductor`, `pasajero`. Only the first three (`ROLES_DASHBOARD`) can access the dashboard. The `usePermisos` hook (`src/hooks/usePermisos.ts`) provides role-based permission checks in components. `RoleRoute` in the router provides route-level gating.

### Layouts

`src/layouts/` contains: `AppLayout` (dashboard shell with `Sidebar` + `Header`), `PublicLayout` (landing pages), `AuthLayout` (login). The sidebar navigation and header are in `Sidebar.tsx` and `Header.tsx`.

### Key Conventions

- Spanish naming throughout: `usuario`, `cerrarSesion`, `cargando`, `listo`, etc.
- Feature stores follow the pattern: state + async actions that call `supabase.from(table)` and update Zustand state
- Vercel SPA rewrites configured in `vercel.json`
- **CRÍTICO**: Nunca importar el cliente de Supabase directamente en componentes o páginas. Todas las llamadas a Supabase deben ir a través de los stores de Zustand, sin excepciones. Es una violación arquitectónica grave.
- **CRÍTICO**: Nunca utilizar el cliente de Supabase dentro de componentes o páginas. El cliente de Supabase solo puede ser usado dentro de los stores de Zustand.
- **CRÍTICO**: Zustand es el único gestor de estado permitido. Nunca usar useState o useReducer para estado global o datos del servidor.
- **CRÍTICO**: Siempre utilizar componentes de shadcn/ui para la interfaz. Nunca crear componentes UI personalizados (botones, inputs, modals, selects, etc.) cuando ya existe un componente de shadcn/ui disponible.
- **CRÍTICO**: Nunca usar el tipo `any` en TypeScript. Siempre usar tipos explícitos o `unknown` si el tipo es verdaderamente desconocido.
- **CRÍTICO**: Siempre reutilizar los componentes compartidos de `src/components/shared/`: `TablaPage` (layout CRUD con filtros), `PanelDetalle` (panel lateral/drawer responsive), `MenuAcciones` (dropdown de acciones por fila), `EstadoBadge` (badge activo/inactivo), `Paginacion` (controles de paginación), `TablaVacia` (estado vacío). Nunca recrear componentes similares desde cero.
- Toda paginación debe ser server-side usando `.range()` y `count: 'exact'` de Supabase. Nunca cargar todos los registros de una vez.
- Los tipos de base de datos vienen de `src/supabase/types.ts`. Siempre usar los tipos generados, nunca redefinir las tablas manualmente.
- Todos los estados y acciones de los stores deben estar completamente tipados con interfaces explícitas.
- No dejar `console.log` en código de producción. Solo usar para depuración temporal y eliminar antes de hacer commit.
- Siempre manejar los tres estados en cada módulo: cargando, error, y vacío.
- Todo texto visible al usuario y nombres de variables en español. Comentarios en español.
