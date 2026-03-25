import { Building2, Calendar, DollarSign, Bus, CheckCircle, AlertTriangle } from 'lucide-react'
import { MenuAcciones }            from '@/components/shared/MenuAcciones'
import { EstadoLiquidacionBadge }  from './EstadoLiquidacionBadge'
import { cn }                      from '@/lib/utils'
import type { Liquidacion }        from '../liquidacionesStore'

interface Props {
  liquidacion:     Liquidacion
  esSeleccionada:  boolean
  onSeleccionar:   () => void
  onMarcarPagado:  () => void
  onMarcarDisputa: () => void
}

export function LiquidacionCard({
  liquidacion, esSeleccionada,
  onSeleccionar, onMarcarPagado, onMarcarDisputa,
}: Props) {
  return (
    <div
      onClick={onSeleccionar}
      className={cn(
        'p-4 cursor-pointer hover:bg-secondary/30 transition-colors',
        esSeleccionada && 'bg-primary/5 border-l-2 border-l-primary'
      )}
    >
      {/* Fila superior: agencia + estado + menú */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {liquidacion.agencia?.nombre ?? '—'}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {liquidacion.agencia?.codigo ?? '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <EstadoLiquidacionBadge estado={liquidacion.estado} />
          <MenuAcciones items={[
            {
              icon:  <CheckCircle className="w-3.5 h-3.5" />,
              label: 'Marcar pagado',
              fn:    onMarcarPagado,
            },
            {
              icon:  <AlertTriangle className="w-3.5 h-3.5" />,
              label: 'Marcar en disputa',
              fn:    onMarcarDisputa,
              danger: true,
              separadorAntes: true,
            },
          ]} />
        </div>
      </div>

      {/* Período */}
      <div className="mt-3 flex items-center gap-1.5">
        <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="text-[10px] text-muted-foreground">
          {new Date(liquidacion.periodo_inicio).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
          {' — '}
          {new Date(liquidacion.periodo_fin).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Detalles */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <Bus className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] text-foreground">
            {liquidacion.total_viajes} viaje{liquidacion.total_viajes !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] font-bold text-foreground">
            ${liquidacion.total_recaudado.toLocaleString('es-CO')}
          </span>
        </div>
      </div>

      {/* Pasajeros + comisiones */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {liquidacion.total_pasajeros} pasajero{liquidacion.total_pasajeros !== 1 ? 's' : ''}
        </span>
        <span className="text-[10px] font-semibold text-foreground">
          Comisión: ${liquidacion.total_comisiones.toLocaleString('es-CO')}
        </span>
      </div>
    </div>
  )
}
