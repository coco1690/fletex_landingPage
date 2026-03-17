import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Car, Sun, Moon, Menu, X } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'


const NAV_LINKS = [
  { label: 'Inicio',    id: 'inicio' },
  { label: 'Nosotros',  id: 'nosotros' },
  { label: 'Ubicación', id: 'ubicacion' },
  { label: 'Contacto',  id: 'contacto' },
]

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tema, toggle } = useThemeStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const esLanding = location.pathname === '/'

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    if (!esLanding) {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">Fletex</span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="w-px h-4 bg-border mx-2" />
          <button
            onClick={toggle}
            className="w-8 h-8 bg-secondary border border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            {tema === 'light'
              ? <Moon className="w-4 h-4 text-muted-foreground" />
              : <Sun className="w-4 h-4 text-muted-foreground" />
            }
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggle}
            className="w-8 h-8 bg-secondary border border-border rounded-lg flex items-center justify-center"
          >
            {tema === 'light'
              ? <Moon className="w-4 h-4 text-muted-foreground" />
              : <Sun className="w-4 h-4 text-muted-foreground" />
            }
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 bg-secondary border border-border rounded-lg flex items-center justify-center"
          >
            {menuOpen
              ? <X className="w-4 h-4 text-foreground" />
              : <Menu className="w-4 h-4 text-foreground" />
            }
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/97 backdrop-blur-sm pt-14">
          <div className="p-5 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-1">
              Navega
            </p>
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="flex items-center gap-3 bg-secondary border border-border rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors hover:border-primary/40 w-full"
              >
                <span className="text-base">
                  {link.id === 'inicio'    && '🏠'}
                  {link.id === 'nosotros'  && '👥'}
                  {link.id === 'ubicacion' && '📍'}
                  {link.id === 'contacto'  && '💬'}
                </span>
                {link.label}
              </button>
            ))}
            <div className="w-full h-px bg-border my-1" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-1">
              Acceso
            </p>
            <button
              onClick={() => { setMenuOpen(false); navigate('/login') }}
              className="flex items-center gap-3 bg-secondary border border-border rounded-xl px-4 py-3 text-left text-sm font-semibold w-full"
            >
              <span className="text-base">👤</span>
              Iniciar sesión
            </button>
            <button className="flex items-center gap-3 bg-primary rounded-xl px-4 py-3 text-left text-sm font-semibold text-primary-foreground w-full">
              <span className="text-base">📱</span>
              Descargar app
            </button>
          </div>
        </div>
      )}
    </>
  )
}