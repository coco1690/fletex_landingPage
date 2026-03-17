import { Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  cargando: boolean
  hayDatos: boolean
  hayBusqueda: boolean
  icono: React.ReactNode
  labelVacio: string
  labelCrear: string
  onCrear: () => void
}

export function TablaVacia({
  cargando, hayDatos, hayBusqueda,
  icono, labelVacio, labelCrear, onCrear,
}: Props) {
  if (cargando && !hayDatos) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3">
      <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground">
        {icono}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{labelVacio}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {hayBusqueda ? 'No hay resultados para tu búsqueda' : 'Crea el primer registro'}
        </p>
      </div>
      {!hayBusqueda && (
        <Button variant="ghost" size="sm" onClick={onCrear} className="gap-1.5 text-primary hover:text-primary">
          <Plus className="w-3.5 h-3.5" />
          {labelCrear}
        </Button>
      )}
    </div>
  )
}