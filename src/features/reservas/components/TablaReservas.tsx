import { User, Route, Clock, XCircle, CreditCard } from 'lucide-react'
import { MenuAcciones }        from '@/components/shared/MenuAcciones'
import { EstadoReservaBadge, EstadoPagoBadge } from './EstadoReservaBadge'
import { cn }                  from '@/lib/utils'
import type { Reserva }        from '../reservasStore'

interface Props {
  reservas:        Reserva[]
  reservaDetalle:  Reserva | null
  onSeleccionar:   (r: Reserva) => void
  onCancelar:      (r: Reserva) => void
  puedeCancelar:   (r: Reserva) => boolean
}

export function TablaReservas({
  reservas, reservaDetalle,
  onSeleccionar, onCancelar, puedeCancelar,
}: Props) {
  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-420px)]">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border">
            {['Pasajero', 'Ruta', 'Salida', 'Cupos', 'Total', 'Estado', 'Pago', ''].map(h => (
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
          {reservas.map(reserva => {
            const esSeleccionada = reservaDetalle?.id === reserva.id
            return (
              <tr
                key={reserva.id}
                onClick={() => onSeleccionar(reserva)}
                className={cn(
                  'hover:bg-secondary/30 transition-colors cursor-pointer',
                  esSeleccionada && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                {/* Pasajero */}
                <td className="px-4 py-3 pl-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {reserva.pasajero?.nombre?.charAt(0).toUpperCase() ?? 'P'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {reserva.pasajero?.nombre ?? '—'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {reserva.pasajero?.telefono ?? 'Sin teléfono'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Ruta */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Route className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-foreground">
                        {reserva.viaje?.ruta?.nombre ?? '—'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {reserva.viaje?.ruta?.agencia_origen?.nombre} →{' '}
                        {reserva.viaje?.ruta?.agencia_destino?.nombre}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Salida */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-foreground">
                        {reserva.viaje?.hora_salida_programada
                          ? new Date(reserva.viaje.hora_salida_programada)
                              .toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {reserva.viaje?.hora_salida_programada
                          ? new Date(reserva.viaje.hora_salida_programada)
                              .toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
                          : ''}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Cupos */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">
                      {reserva.cupos_solicitados}
                    </span>
                  </div>
                </td>

                {/* Total */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground whitespace-nowrap">
                      ${reserva.valor_total.toLocaleString('es-CO')}
                    </span>
                  </div>
                </td>

                {/* Estado reserva */}
                <td className="px-4 py-3">
                  <EstadoReservaBadge estado={reserva.estado} />
                </td>

                {/* Estado pago */}
                <td className="px-4 py-3">
                  <EstadoPagoBadge estado={reserva.estado_pago} />
                </td>

                {/* Acciones */}
                <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                  {puedeCancelar(reserva) && (
                    <MenuAcciones items={[{
                      icon:   <XCircle className="w-3.5 h-3.5" />,
                      label:  'Cancelar reserva',
                      fn:     () => onCancelar(reserva),
                      danger: true,
                    }]} />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}