import { Route, Clock, XCircle, CreditCard } from 'lucide-react'
import { MenuAcciones }        from '@/components/shared/MenuAcciones'
import { EstadoReservaBadge, EstadoPagoBadge } from './EstadoReservaBadge'
import { cn }                  from '@/lib/utils'
import type { Reserva }        from '../reservasStore'

interface Props {
  reserva:        Reserva
  esSeleccionada: boolean
  onSeleccionar:  () => void
  onCancelar:     () => void
  puedeCancelar:  boolean
}

export function ReservaCard({
  reserva, esSeleccionada,
  onSeleccionar, onCancelar, puedeCancelar,
}: Props) {
  return (
    <div
      onClick={onSeleccionar}
      className={cn(
        'p-4 cursor-pointer hover:bg-secondary/30 transition-colors',
        esSeleccionada && 'bg-primary/5 border-l-2 border-l-primary'
      )}
    >
      {/* Fila superior: pasajero + estado + menú */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sm font-bold text-primary">
              {(reserva as any).pasajero?.nombre?.charAt(0).toUpperCase() ?? 'P'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {(reserva as any).pasajero?.nombre ?? '—'}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {(reserva as any).pasajero?.telefono ?? 'Sin teléfono'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <EstadoReservaBadge estado={reserva.estado} />
          {puedeCancelar && (
            <MenuAcciones items={[{
              icon:  <XCircle className="w-3.5 h-3.5" />,
              label: 'Cancelar reserva',
              fn:    onCancelar,
              danger: true,
            }]} />
          )}
        </div>
      </div>

      {/* Ruta */}
      <div className="mt-3 flex items-center gap-1.5">
        <Route className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="text-[10px] text-muted-foreground truncate">
          {(reserva as any).viaje?.ruta?.nombre ?? '—'}
        </span>
      </div>

      {/* Detalles */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] text-foreground">
            {(reserva as any).viaje?.hora_salida_programada
              ? new Date((reserva as any).viaje.hora_salida_programada).toLocaleString('es-CO', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })
              : '—'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] font-bold text-foreground">
            ${reserva.valor_total.toLocaleString('es-CO')}
          </span>
        </div>
      </div>

      {/* Cupos + estado pago */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {reserva.cupos_solicitados} cupo{reserva.cupos_solicitados !== 1 ? 's' : ''}
        </span>
        <EstadoPagoBadge estado={reserva.estado_pago} />
      </div>
    </div>
  )
}