import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  paginaActual:   number
  totalPaginas:   number
  totalRegistros: number
  porPagina:      number
  onCambiar:      (pagina: number) => void
  cargando?:      boolean
}

export function Paginacion({
  paginaActual,
  totalPaginas,
  totalRegistros,
  porPagina,
  onCambiar,
  cargando = false,
}: Props) {
  if (totalPaginas <= 1) return null

  const inicio  = (paginaActual - 1) * porPagina + 1
  const fin     = Math.min(paginaActual * porPagina, totalRegistros)
  const paginas = generarPaginas(paginaActual, totalPaginas)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-border">

      {/* Info — centrado en móvil, izquierda en desktop */}
      <p className="text-xs text-muted-foreground text-center sm:text-left">
        Mostrando{' '}
        <span className="font-semibold text-foreground">{inicio}–{fin}</span>
        {' '}de{' '}
        <span className="font-semibold text-foreground">{totalRegistros}</span>
        {' '}registros
      </p>

      {/* Botones */}
      <div className="flex items-center gap-1">

        {/* Anterior */}
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 shrink-0"
          onClick={() => onCambiar(paginaActual - 1)}
          disabled={paginaActual === 1 || cargando}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>

        {/* Números */}
        {paginas.map((p, i) =>
          p === '...' ? (
            <span
              key={`dots-${i}`}
              className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
            >
              ···
            </span>
          ) : (
            <Button
              key={p}
              variant={paginaActual === p ? 'default' : 'outline'}
              size="icon"
              className={cn(
                'w-8 h-8 text-xs shrink-0',
                paginaActual === p && 'pointer-events-none'
              )}
              onClick={() => onCambiar(p as number)}
              disabled={cargando}
            >
              {p}
            </Button>
          )
        )}

        {/* Siguiente */}
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 shrink-0"
          onClick={() => onCambiar(paginaActual + 1)}
          disabled={paginaActual === totalPaginas || cargando}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>

      </div>
    </div>
  )
}

function generarPaginas(actual: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const paginas: (number | '...')[] = [1]

  if (actual > 3)              paginas.push('...')
  if (actual > 2)              paginas.push(actual - 1)
  if (actual !== 1 && actual !== total) paginas.push(actual)
  if (actual < total - 1)      paginas.push(actual + 1)
  if (actual < total - 2)      paginas.push('...')

  paginas.push(total)
  return paginas
}