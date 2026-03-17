import { ChevronRight, Pencil, X } from 'lucide-react'
import { Button }     from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator }  from '@/components/ui/separator'
import { cn }         from '@/lib/utils'

interface CampoInfo { label: string; valor: string }
interface StatInfo  { valor: number | string; label: string }

interface Props {
  titulo:       string
  nombre:       string
  subtitulo?:   string
  badge?:       React.ReactNode
  icono:        React.ReactNode
  stats?:       StatInfo[]
  campos:       CampoInfo[]
  onCerrar:     () => void
  onEditar:     () => void
  labelEditar?: string
}

export function PanelDetalle({
  titulo, nombre, subtitulo, badge, icono,
  stats, campos, onCerrar, onEditar,
  labelEditar = 'Editar',
}: Props) {

  const contenido = (
    <>
      {/* Identidad */}
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
          {icono}
        </div>
        <h2 className="text-base font-black text-foreground">{nombre}</h2>
        {subtitulo && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitulo}</p>
        )}
        {badge && (
          <div className="mt-2 flex justify-center">{badge}</div>
        )}
      </div>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className={cn(
          'grid gap-3',
          stats.length === 1 && 'grid-cols-1',
          stats.length === 2 && 'grid-cols-2',
          stats.length >= 3 && 'grid-cols-3',
        )}>
          {stats.map(s => (
            <div key={s.label} className="bg-secondary/50 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-primary">{s.valor}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <Separator />

      {/* Campos */}
      <div className="space-y-0">
        {campos.map((f, i) => (
          <div key={f.label}>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-xs text-muted-foreground shrink-0 mr-3">{f.label}</span>
              <span className="text-xs font-semibold text-foreground text-right max-w-40 truncate">
                {f.valor}
              </span>
            </div>
            {i < campos.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </>
  )

  return (
    <>
      {/* ── MÓVIL: drawer desde abajo ── */}
      <div className="md:hidden">
        {/* Overlay */}
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onCerrar}
        />

        {/* Panel */}
        <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl border-t border-border shadow-2xl max-h-[85dvh] flex flex-col">

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
            <p className="text-sm font-bold text-foreground">{titulo}</p>
            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={onCerrar}>
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-5">
              {contenido}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border shrink-0 pb-safe">
            <Button onClick={onEditar} className="w-full gap-2">
              <Pencil className="w-3.5 h-3.5" />
              {labelEditar}
            </Button>
          </div>

        </div>
      </div>

      {/* ── DESKTOP: panel lateral ── */}
      <div className="hidden md:flex flex-col h-full bg-card border-l border-border w-80 shrink-0">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-foreground">{titulo}</p>
          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onCerrar}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Contenido */}
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-5">
            {contenido}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <Button onClick={onEditar} className="w-full gap-2">
            <Pencil className="w-3.5 h-3.5" />
            {labelEditar}
          </Button>
        </div>

      </div>
    </>
  )
}