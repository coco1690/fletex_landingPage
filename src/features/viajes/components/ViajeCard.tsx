import { Route, User, Car, Clock, Pencil, XCircle, Trash2 } from 'lucide-react'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { EstadoViajeBadge } from './EstadoViajeBadge'
import { CuposBarra }       from './CuposBarra'
import { cn }               from '@/lib/utils'
import type { Viaje }       from '../viajesStore'

interface Props {
  viaje:          Viaje
  esSeleccionado: boolean
  onSeleccionar:  () => void
  onEditar:       () => void
  onCancelar:     () => void
  onEliminar:     () => void
  puedeEditar:    boolean
  puedeCancelar:  boolean
}

export function ViajeCard({
  viaje, esSeleccionado,
  onSeleccionar, onEditar, onCancelar, onEliminar,
  puedeEditar, puedeCancelar,
}: Props) {
  return (
    <div
      onClick={onSeleccionar}
      className={cn(
        'p-4 cursor-pointer hover:bg-secondary/30 transition-colors',
        esSeleccionado && 'bg-primary/5 border-l-2 border-l-primary'
      )}
    >
      {/* Fila superior: ruta + estado + menú */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
            <Route className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {viaje.ruta?.nombre ?? '—'}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {viaje.ruta?.agencia_origen?.nombre} →{' '}
              {viaje.ruta?.agencia_destino?.nombre}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <EstadoViajeBadge estado={viaje.estado} />
          <MenuAcciones items={[
            ...(puedeEditar ? [{
              icon: <Pencil className="w-3.5 h-3.5" />,
              label: 'Editar',
              fn: onEditar,
            }] : []),
            ...(puedeCancelar ? [{
              icon: <XCircle className="w-3.5 h-3.5" />,
              label: 'Cancelar viaje',
              fn: onCancelar,
              danger: true,
              separadorAntes: true,
            }] : []),
            {
              icon: <Trash2 className="w-3.5 h-3.5" />,
              label: 'Eliminar',
              fn: onEliminar,
              danger: true,
              separadorAntes: !puedeCancelar,
            },
          ]} />
        </div>
      </div>

      {/* Fila media: conductor, placa, hora */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] text-muted-foreground truncate">
            {viaje.conductor?.usuario?.nombre ?? '—'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Car className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] font-mono font-bold text-foreground">
            {viaje.vehiculo?.placa ?? '—'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] text-foreground">
            {new Date(viaje.hora_salida_programada).toLocaleTimeString('es-CO', {
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Fila inferior: cupos + precio */}
      <div className="mt-3 flex items-center gap-4">
        <div className="flex-1">
          <CuposBarra
            confirmados={viaje.cupos_confirmados}
            totales={viaje.cupos_totales}
          />
        </div>
        <span className="text-sm font-black text-foreground shrink-0">
          ${viaje.precio_pasaje.toLocaleString('es-CO')}
        </span>
      </div>
    </div>
  )
}