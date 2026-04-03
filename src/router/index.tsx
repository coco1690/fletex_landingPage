import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { AuthLayout } from '@/layouts/AuthLayout'
import { RegionesPage } from '@/features/regiones/RegionesPage'
import { AgenciasPage } from '@/features/agencias/AgenciasPage'
import { ConductoresPage } from '@/features/conductores/ConductoresPage'
import { VehiculosPage } from '@/features/vehiculos/VehiculosPage'
import { RutasPage } from '@/features/rutas/RutasPage'
import { ViajesPage } from '@/features/viajes/ViajesPage'
import { ReservasPage } from '@/features/reservas/ReservasPage'
import { LiquidacionesPage } from '@/features/liquidaciones/LiquidacionesPage'
import { UsuariosPage } from '@/features/usuarios/UsuariosPage'
import { CarrerasPage } from '@/features/carreras/CarrerasPage'
import { EncomiendasPage } from '@/features/encomiendas/EncomiendasPage'
import { PlanillasPage } from '@/features/planillas/PlanillasPage'
import { PlanesPage } from '@/features/planes/PlanesPage'
import { PagosPage } from '@/features/pagos/PagosPage'
import { ComisionesPage } from '@/features/comisiones/ComisionesPage'




// dashboards por rol
import { SuperAdminHome } from '@/features/dashboard/SuperAdminHome'
import { PagoResultadoPage } from '@/pages/PagoResultadoPage'


// páginas placeholder — las iremos construyendo
const Placeholder = ({ titulo }: { titulo: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="text-4xl mb-3">🚧</div>
      <h2 className="text-lg font-bold">{titulo}</h2>
      <p className="text-sm text-muted-foreground mt-1">Módulo en construcción</p>
    </div>
  </div>
)

export const router = createBrowserRouter([
  // ── PÚBLICAS ──────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/pago-resultado', element: <PagoResultadoPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },

  // ── PROTEGIDAS ────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <Navigate to="/dashboard/inicio" replace /> },
          { path: '/dashboard/inicio', element: <SuperAdminHome /> },
          { path: '/dashboard/regiones', element: <RegionesPage /> },
          { path: '/dashboard/agencias', element: <AgenciasPage /> },
          { path: '/dashboard/conductores', element: <ConductoresPage /> },
          { path: '/dashboard/vehiculos', element: <VehiculosPage /> },
          { path: '/dashboard/rutas', element: <RutasPage /> },
          { path: '/dashboard/viajes', element: <ViajesPage /> },
          { path: '/dashboard/reservas', element: <ReservasPage /> },
          { path: '/dashboard/liquidaciones', element: <LiquidacionesPage /> },
          { path: '/dashboard/carreras', element: <CarrerasPage /> },
          { path: '/dashboard/encomiendas', element: <EncomiendasPage /> },
          { path: '/dashboard/planillas', element: <PlanillasPage /> },
          { path: '/dashboard/planes', element: <PlanesPage /> },
          { path: '/dashboard/pagos', element: <PagosPage /> },
          { path: '/dashboard/comisiones', element: <ComisionesPage /> },
          { path: '/dashboard/reportes', element: <Placeholder titulo="Reportes" /> },
          { path: '/dashboard/usuarios', element: <UsuariosPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])





