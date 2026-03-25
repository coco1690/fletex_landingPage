import { Building2, Calendar, DollarSign, Bus, CheckCircle, AlertTriangle } from 'lucide-react'
import { MenuAcciones }            from '@/components/shared/MenuAcciones'
import { EstadoLiquidacionBadge }  from './EstadoLiquidacionBadge'
import { cn }                      from '@/lib/utils'
import type { Liquidacion }        from '../liquidacionesStore'

interface Props {
  liquidaciones:       Liquidacion[]
  liquidacionDetalle:  Liquidacion | null
  onSeleccionar:       (l: Liquidacion) => void
  onMarcarPagado:      (l: Liquidacion) => void
  onMarcarDisputa:     (l: Liquidacion) => void
}

export function TablaLiquidaciones({
  liquidaciones, liquidacionDetalle,
  onSeleccionar, onMarcarPagado, onMarcarDisputa,
}: Props) {
  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-420px)]">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border">
            {['Agencia', 'Período', 'Viajes', 'Recaudado', 'Comisiones', 'Estado', ''].map(h => (
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
          {liquidaciones.map(liquidacion => {
            const esSeleccionada = liquidacionDetalle?.id === liquidacion.id
            return (
              <tr
                key={liquidacion.id}
                onClick={() => onSeleccionar(liquidacion)}
                className={cn(
                  'hover:bg-secondary/30 transition-colors cursor-pointer',
                  esSeleccionada && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                {/* Agencia */}
                <td className="px-4 py-3 pl-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {liquidacion.agencia?.nombre ?? '—'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {liquidacion.agencia?.codigo ?? '—'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Período */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-foreground">
                        {new Date(liquidacion.periodo_inicio).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                        {' — '}
                        {new Date(liquidacion.periodo_fin).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Viajes */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Bus className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">
                      {liquidacion.total_viajes}
                    </span>
                  </div>
                </td>

                {/* Recaudado */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground whitespace-nowrap">
                      ${liquidacion.total_recaudado.toLocaleString('es-CO')}
                    </span>
                  </div>
                </td>

                {/* Comisiones */}
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground whitespace-nowrap">
                    ${liquidacion.total_comisiones.toLocaleString('es-CO')}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <EstadoLiquidacionBadge estado={liquidacion.estado} />
                </td>

                {/* Acciones */}
                <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                  <MenuAcciones items={[
                    {
                      icon:  <CheckCircle className="w-3.5 h-3.5" />,
                      label: 'Marcar pagado',
                      fn:    () => onMarcarPagado(liquidacion),
                    },
                    {
                      icon:  <AlertTriangle className="w-3.5 h-3.5" />,
                      label: 'Marcar en disputa',
                      fn:    () => onMarcarDisputa(liquidacion),
                      danger: true,
                      separadorAntes: true,
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
