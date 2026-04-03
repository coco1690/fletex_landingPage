import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MapPin, Building2, Users, Truck,
  Route, Car, BookOpen, Wallet, BarChart3,
  UserCog, X, LogOut, Bike, Package, FileText,
  CreditCard, DollarSign, Percent,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useAuthStore } from '@/store/authStore'
import { usePermisos } from '@/hooks/usePermisos'
import { ROLES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onCerrar?: () => void
}

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  modulo?: Parameters<typeof usePermisos>[0]
}

// Principal [0], Gestión [1-6], Operaciones [7-9], Administración [10-14], Sistema [15-16]
const NAV_ITEMS: NavItem[] = [
  // ── Principal ──
  { label: 'Inicio',        path: '/dashboard/inicio',        icon: <LayoutDashboard className="w-4 h-4" /> },
  // ── Gestión ──
  { label: 'Regiones',      path: '/dashboard/regiones',      icon: <MapPin className="w-4 h-4" />,       modulo: 'regiones' },
  { label: 'Agencias',      path: '/dashboard/agencias',      icon: <Building2 className="w-4 h-4" />,    modulo: 'agencias' },
  { label: 'Conductores',   path: '/dashboard/conductores',   icon: <UserCog className="w-4 h-4" />,      modulo: 'conductores' },
  { label: 'Vehículos',     path: '/dashboard/vehiculos',     icon: <Truck className="w-4 h-4" />,        modulo: 'vehiculos' },
  { label: 'Rutas',         path: '/dashboard/rutas',         icon: <Route className="w-4 h-4" />,        modulo: 'rutas' },
  { label: 'Viajes',        path: '/dashboard/viajes',        icon: <Car className="w-4 h-4" />,          modulo: 'viajes' },
  // ── Operaciones ──
  { label: 'Reservas',      path: '/dashboard/reservas',      icon: <BookOpen className="w-4 h-4" />,     modulo: 'reservas' },
  { label: 'Encomiendas',   path: '/dashboard/encomiendas',   icon: <Package className="w-4 h-4" />,      modulo: 'encomiendas' },
  { label: 'Carreras',      path: '/dashboard/carreras',      icon: <Bike className="w-4 h-4" />,         modulo: 'carreras' },
  // ── Administración ──
  { label: 'Liquidaciones', path: '/dashboard/liquidaciones', icon: <Wallet className="w-4 h-4" />,       modulo: 'liquidaciones' },
  { label: 'Planillas',     path: '/dashboard/planillas',     icon: <FileText className="w-4 h-4" />,     modulo: 'planillas' },
  { label: 'Planes',        path: '/dashboard/planes',        icon: <CreditCard className="w-4 h-4" />,   modulo: 'planes' },
  { label: 'Pagos',         path: '/dashboard/pagos',         icon: <DollarSign className="w-4 h-4" />,   modulo: 'pagos' },
  { label: 'Comisiones',    path: '/dashboard/comisiones',    icon: <Percent className="w-4 h-4" />,      modulo: 'comisiones' },
  // ── Sistema ──
  { label: 'Reportes',      path: '/dashboard/reportes',      icon: <BarChart3 className="w-4 h-4" />,    modulo: 'reportes' },
  { label: 'Usuarios',      path: '/dashboard/usuarios',      icon: <Users className="w-4 h-4" />,        modulo: 'usuarios' },
]

// componente interno que usa el hook de permisos por ítem
function NavItemComponent({ item, onCerrar }: { item: NavItem; onCerrar?: () => void }) {
  const permisos = item.modulo ? usePermisos(item.modulo) : null

  // si tiene módulo y no puede ver, ocultar
  if (item.modulo && permisos && !permisos.puedeVer) return null

  return (
    <NavLink
      to={item.path}
      onClick={onCerrar}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
      )}
    >
      {item.icon}
      {item.label}
    </NavLink>
  )
}

function RolBadge({ rol }: { rol: string }) {
  const config = {
    [ROLES.SUPER_ADMIN]:       { label: 'Super Admin',  bg: 'bg-red-500/10',   text: 'text-red-400',   border: 'border-red-500/20' },
    [ROLES.ADMIN_REGIONAL]:    { label: 'Admin Regional', bg: 'bg-blue-500/10', text: 'text-blue-400',  border: 'border-blue-500/20' },
    [ROLES.ENCARGADO_AGENCIA]: { label: 'Agencia',       bg: 'bg-primary/10',  text: 'text-primary',   border: 'border-primary/20' },
  }[rol] ?? { label: rol, bg: 'bg-secondary', text: 'text-muted-foreground', border: 'border-border' }

  return (
    <span className={cn(
      'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
      config.bg, config.text, config.border
    )}>
      {config.label}
    </span>
  )
}

export function Sidebar({ onCerrar }: SidebarProps) {
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuthStore()

  const handleCerrarSesion = async () => {
    await cerrarSesion()
    navigate('/login')
  }

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">

      {/* Header sidebar */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
        <Logo size="md" />
        {onCerrar && (
          <button
            onClick={onCerrar}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">

        {/* Sección principal */}
        <div className="mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2">
            Principal
          </p>
          {NAV_ITEMS.slice(0, 1).map(item => (
            <NavItemComponent key={item.path} item={item} onCerrar={onCerrar} />
          ))}
        </div>

        {/* Sección gestión */}
        <div className="mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2 mt-4">
            Gestión
          </p>
          {NAV_ITEMS.slice(1, 7).map(item => (
            <NavItemComponent key={item.path} item={item} onCerrar={onCerrar} />
          ))}
        </div>

        {/* Sección operaciones */}
        <div className="mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2 mt-4">
            Operaciones
          </p>
          {NAV_ITEMS.slice(7, 10).map(item => (
            <NavItemComponent key={item.path} item={item} onCerrar={onCerrar} />
          ))}
        </div>

        {/* Sección administración */}
        <div className="mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2 mt-4">
            Administración
          </p>
          {NAV_ITEMS.slice(10, 15).map(item => (
            <NavItemComponent key={item.path} item={item} onCerrar={onCerrar} />
          ))}
        </div>

        {/* Sección sistema */}
        <div className="mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2 mt-4">
            Sistema
          </p>
          {NAV_ITEMS.slice(15).map(item => (
            <NavItemComponent key={item.path} item={item} onCerrar={onCerrar} />
          ))}
        </div>

      </nav>

      {/* Footer — usuario */}
      <div className="px-3 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 mb-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">
              {usuario?.nombre?.charAt(0).toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {usuario?.nombre ?? '—'}
            </p>
            <RolBadge rol={usuario?.rol ?? ''} />
          </div>
        </div>

        <button
          onClick={handleCerrarSesion}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>

    </div>
  )
}