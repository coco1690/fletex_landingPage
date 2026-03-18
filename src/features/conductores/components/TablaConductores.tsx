import {
  Building2, Car, Pencil,
  PowerOff, Power, DollarSign,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { EstadoBadge } from '@/components/shared/EstadoBadge'
import { cn } from '@/lib/utils'
import type { Conductor } from '../conductoresStore'

const SUSC_CONFIG = {
  activo:               { label: 'Activa',     cls: 'bg-success/10 text-success border-success/20' },
  por_vencer:           { label: 'Por vencer', cls: 'bg-warning/10 text-warning border-warning/20' },
  suspendido:           { label: 'Suspendida', cls: 'bg-destructive/10 text-destructive border-destructive/20' },
  pendiente_activacion: { label: 'Pendiente',  cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
} as Record<string, { label: string; cls: string }>

function SuscBadge({ estado }: { estado: string }) {
  const { label, cls } = SUSC_CONFIG[estado] ?? { label: estado, cls: 'bg-secondary text-muted-foreground border-border' }
  return <Badge variant="outline" className={cls}>{label}</Badge>
}

interface Props {
  conductores: Conductor[]
  conductorDetalle: Conductor | null
  onSeleccionar: (c: Conductor) => void
  onEditar: (c: Conductor) => void
  onPago: (c: Conductor) => void
  onToggleEstado: (c: Conductor) => void
}

export function TablaConductores({
  conductores, conductorDetalle,
  onSeleccionar, onEditar, onPago, onToggleEstado,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Conductor', 'Licencia', 'Agencia', 'Vehículo', 'Suscripción', 'Estado', ''].map(h => (
              <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4 py-3 first:pl-5 last:pr-5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {conductores.map(conductor => {
            const esSeleccionado = conductorDetalle?.id === conductor.id
            return (
              <tr
                key={conductor.id}
                onClick={() => onSeleccionar(conductor)}
                className={cn(
                  'hover:bg-secondary/30 transition-colors cursor-pointer',
                  esSeleccionado && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                <td className="px-4 py-3 pl-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {conductor.usuario?.nombre?.charAt(0).toUpperCase() ?? 'C'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {conductor.usuario?.nombre ?? '—'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {conductor.usuario?.telefono ?? ''}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono bg-secondary px-2 py-1 rounded-lg">
                      {conductor.numero_licencia}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {conductor.categoria_licencia}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {conductor.agencia?.nombre ?? '—'}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {conductor.vehiculo ? (
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs font-semibold text-foreground">
                        {conductor.vehiculo.placa}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">Sin vehículo</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <SuscBadge estado={conductor.estado_suscripcion} />
                    {conductor.fecha_corte && (
                      <p className="text-[10px] text-muted-foreground">
                        Vence {new Date(conductor.fecha_corte).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <EstadoBadge estado={conductor.usuario?.estado ?? 'activo'} />
                </td>

                <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                  <MenuAcciones items={[
                    {
                      icon: <Pencil className="w-3.5 h-3.5" />,
                      label: 'Editar',
                      fn: () => onEditar(conductor),
                    },
                    {
                      icon: <DollarSign className="w-3.5 h-3.5" />,
                      label: 'Registrar pago',
                      fn: () => onPago(conductor),
                      separadorAntes: true,
                    },
                    {
                      icon: conductor.usuario?.estado === 'activo'
                        ? <PowerOff className="w-3.5 h-3.5" />
                        : <Power className="w-3.5 h-3.5" />,
                      label: conductor.usuario?.estado === 'activo' ? 'Desactivar' : 'Activar',
                      fn: () => onToggleEstado(conductor),
                      danger: conductor.usuario?.estado === 'activo',
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