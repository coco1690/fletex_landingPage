import { RefreshCw, Search, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { cn }     from '@/lib/utils'

interface FiltroEstado { valor: string; label: string }

interface Props {
  titulo:         string
  subtitulo:      string
  labelBoton?:    string
  placeholder:    string
  busqueda:       string
  onBusqueda:     (v: string) => void
  filtroEstado?:  string
  onFiltroEstado?: (v: string) => void
  filtrosEstado?: FiltroEstado[]
  filtroExtra?:   React.ReactNode
  cargando:       boolean
  error:          string | null
  onLimpiarError: () => void
  onRefresh:      () => void
  onCrear?:       () => void
  children:       React.ReactNode
  panelDetalle?:  React.ReactNode
  paginacion?:    React.ReactNode
}

export function TablaPage({
  titulo, subtitulo, labelBoton, placeholder,
  busqueda, onBusqueda,
  filtroEstado, onFiltroEstado,
  filtrosEstado = [
    { valor: 'todos',    label: 'Todos' },
    { valor: 'activo',   label: 'Activo' },
    { valor: 'inactivo', label: 'Inactivo' },
  ],
  filtroExtra,
  cargando, error, onLimpiarError,
  onRefresh, onCrear,
  children, panelDetalle,
  paginacion,
}: Props) {
  return (
    <div className="flex h-full gap-0">

      {/* ── Contenido principal ── */}
      <div className="flex-1 flex flex-col min-w-0 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base md:text-lg font-black tracking-tight text-foreground truncate">
              {titulo}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitulo}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={cargando}
              className="w-8 h-8 md:w-9 md:h-9"
            >
              <RefreshCw className={cn('w-4 h-4', cargando && 'animate-spin')} />
            </Button>
            {onCrear && (
              <Button onClick={onCrear} size="sm" className="gap-1.5 h-8 md:h-9 px-3 md:px-4">
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{labelBoton ?? 'Nuevo'}</span>
                <span className="sm:hidden">Nuevo</span>
              </Button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3">
            <p className="text-xs text-destructive">{error}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLimpiarError}
              className="w-6 h-6 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col gap-2.5">

          {/* Fila 1: buscador + filtroExtra */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-40">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                value={busqueda}
                onChange={e => onBusqueda(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            {filtroExtra && (
              <div className="shrink-0">{filtroExtra}</div>
            )}
          </div>

          {/* Fila 2: toggle estado — scroll horizontal en móvil */}
          {filtroEstado && onFiltroEstado && (
            <div className="overflow-x-auto pb-0.5 -mx-0.5 px-0.5">
              <div className="flex items-center gap-1 bg-secondary rounded-xl p-1 w-fit">
                {filtrosEstado.map(f => (
                  <button
                    key={f.valor}
                    onClick={() => onFiltroEstado(f.valor)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap',
                      filtroEstado === f.valor
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Tabla — overflow-hidden para bordes redondeados */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex-1">
          {children}
        </div>

        {/* Paginación — FUERA del overflow-hidden */}
        {paginacion}

      </div>

      {/* ── Panel detalle  ── */}
      
        {panelDetalle}
     

    </div>
  )
}