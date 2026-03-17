import { Route, User, Car, Clock, Pencil, XCircle, Trash2 } from 'lucide-react'
import { MenuAcciones }     from '@/components/shared/MenuAcciones'
import { EstadoViajeBadge } from './EstadoViajeBadge'
import { CuposBarra }       from './CuposBarra'
import { cn }               from '@/lib/utils'
import type { Viaje }       from '../viajesStore'

interface Props {
  viajes:         Viaje[]
  viajeDetalle:   Viaje | null
  onSeleccionar:  (v: Viaje) => void
  onEditar:       (v: Viaje) => void
  onCancelar:     (v: Viaje) => void
  onEliminar:     (v: Viaje) => void
  puedeEditar:    (v: Viaje) => boolean
  puedeCancelar:  (v: Viaje) => boolean
}

export function TablaViajes({
  viajes, viajeDetalle,
  onSeleccionar, onEditar, onCancelar, onEliminar,
  puedeEditar, puedeCancelar,
}: Props) {
  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-420px)]">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border">
            {['Ruta', 'Conductor', 'Vehículo', 'Salida', 'Cupos', 'Precio', 'Estado', ''].map(h => (
              <th
                key={h}
                className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4 py-3 first:pl-5 last:pr-5"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {viajes.map(viaje => {
            const esSeleccionado = viajeDetalle?.id === viaje.id
            return (
              <tr
                key={viaje.id}
                onClick={() => onSeleccionar(viaje)}
                className={cn(
                  'hover:bg-secondary/30 transition-colors cursor-pointer',
                  esSeleccionado && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                {/* Ruta */}
                <td className="px-4 py-3 pl-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Route className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {(viaje as any).ruta?.nombre ?? '—'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {(viaje as any).ruta?.agencia_origen?.nombre} →{' '}
                        {(viaje as any).ruta?.agencia_destino?.nombre}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Conductor */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-foreground">
                      {(viaje as any).conductor?.usuario?.nombre ?? '—'}
                    </span>
                  </div>
                </td>

                {/* Vehículo */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-mono font-bold text-foreground">
                      {(viaje as any).vehiculo?.placa ?? '—'}
                    </span>
                  </div>
                </td>

                {/* Salida */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-foreground">
                        {new Date(viaje.hora_salida_programada).toLocaleTimeString('es-CO', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(viaje.hora_salida_programada).toLocaleDateString('es-CO', {
                          day: 'numeric', month: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Cupos */}
                <td className="px-4 py-3 w-32">
                  <CuposBarra
                    confirmados={viaje.cupos_confirmados}
                    totales={viaje.cupos_totales}
                  />
                </td>

                {/* Precio */}
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-foreground whitespace-nowrap">
                    ${viaje.precio_pasaje.toLocaleString('es-CO')}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <EstadoViajeBadge estado={viaje.estado} />
                </td>

                {/* Acciones */}
                <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                  <MenuAcciones items={[
                    ...(puedeEditar(viaje) ? [{
                      icon: <Pencil className="w-3.5 h-3.5" />,
                      label: 'Editar',
                      fn: () => onEditar(viaje),
                    }] : []),
                    ...(puedeCancelar(viaje) ? [{
                      icon: <XCircle className="w-3.5 h-3.5" />,
                      label: 'Cancelar viaje',
                      fn: () => onCancelar(viaje),
                      danger: true,
                      separadorAntes: true,
                    }] : []),
                    {
                      icon: <Trash2 className="w-3.5 h-3.5" />,
                      label: 'Eliminar',
                      fn: () => onEliminar(viaje),
                      danger: true,
                      separadorAntes: !puedeCancelar(viaje),
                    },
                  ]} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}