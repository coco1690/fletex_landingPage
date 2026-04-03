import { Menu, Bell, Sun, Moon } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Logo } from '@/components/Logo'

interface HeaderProps {
  onAbrirSidebar: () => void
}

export function Header({ onAbrirSidebar }: HeaderProps) {
  const { tema, toggle } = useThemeStore()
  const { usuario } = useAuthStore()
  const location = useLocation()

  // título dinámico según la ruta
  const path = location.pathname
  const titulo = {
    '/dashboard/inicio':        'Inicio',
    '/dashboard/regiones':      'Regiones',
    '/dashboard/agencias':      'Agencias',
    '/dashboard/conductores':   'Conductores',
    '/dashboard/vehiculos':     'Vehículos',
    '/dashboard/rutas':         'Rutas',
    '/dashboard/viajes':        'Viajes',
    '/dashboard/reservas':      'Reservas',
    '/dashboard/liquidaciones': 'Liquidaciones',
    '/dashboard/carreras':      'Carreras',
    '/dashboard/encomiendas':   'Encomiendas',
    '/dashboard/planillas':     'Planillas',
    '/dashboard/suscripciones': 'Planes',
    '/dashboard/comisiones':    'Comisiones',
    '/dashboard/reportes':      'Reportes',
    '/dashboard/usuarios':      'Usuarios',
  }[path] ?? 'Dashboard'

  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-6 border-b border-border bg-card shrink-0">

      {/* Izquierda */}
      <div className="flex items-center gap-3">
        {/* Hamburguesa + Logo — solo mobile */}
        <button
          onClick={onAbrirSidebar}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <Menu className="w-4 h-4 text-foreground" />
        </button>
        <div className="md:hidden">
          <Logo size="sm" showText={false} />
        </div>

        <div>
          <h1 className="text-base font-black tracking-tight text-foreground">{titulo}</h1>
          <p className="text-[10px] text-muted-foreground hidden md:block">
            Bienvenido, {usuario?.nombre?.split(' ')[0] ?? 'usuario'}
          </p>
        </div>
      </div>

      {/* Derecha */}
      <div className="flex items-center gap-2">

        {/* Notificaciones */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Toggle tema */}
        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors border border-border"
        >
          {tema === 'light'
            ? <Moon className="w-4 h-4 text-muted-foreground" />
            : <Sun className="w-4 h-4 text-muted-foreground" />
          }
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-primary">
            {usuario?.nombre?.charAt(0).toUpperCase() ?? 'U'}
          </span>
        </div>

      </div>
    </header>
  )
}