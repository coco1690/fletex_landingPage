import {  Building2, Car, Pencil, PowerOff, Power, DollarSign } from 'lucide-react'
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
  conductor: Conductor
  esSeleccionado: boolean
  onSeleccionar: () => void
  onEditar: () => void
  onPago: () => void
  onToggleEstado: () => void
}

export function ConductorCard({
  conductor, esSeleccionado,
  onSeleccionar, onEditar, onPago, onToggleEstado,
}: Props) {
  return (
    <div
      onClick={onSeleccionar}
      className={cn(
        'px-4 py-3 cursor-pointer transition-colors hover:bg-secondary/30',
        esSeleccionado && 'bg-primary/5 border-l-2 border-l-primary'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold text-primary">
              {conductor.usuario?.nombre?.charAt(0).toUpperCase() ?? 'C'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {conductor.usuario?.nombre ?? '—'}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {conductor.usuario?.telefono ?? ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <EstadoBadge estado={conductor.usuario?.estado ?? 'activo'} />
          <MenuAcciones items={[
            {
              icon: <Pencil className="w-3.5 h-3.5" />,
              label: 'Editar',
              fn: onEditar,
            },
            {
              icon: <DollarSign className="w-3.5 h-3.5" />,
              label: 'Registrar pago',
              fn: onPago,
              separadorAntes: true,
            },
            {
              icon: conductor.usuario?.estado === 'activo'
                ? <PowerOff className="w-3.5 h-3.5" />
                : <Power className="w-3.5 h-3.5" />,
              label: conductor.usuario?.estado === 'activo' ? 'Desactivar' : 'Activar',
              fn: onToggleEstado,
              danger: conductor.usuario?.estado === 'activo',
              separadorAntes: true,
            },
          ]} />
        </div>
      </div>

      {/* Info extra */}
      <div className="flex items-center gap-4 mt-2 ml-12 flex-wrap text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          <span>{conductor.agencia?.nombre ?? '—'}</span>
        </div>
        {conductor.vehiculo ? (
          <div className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            <span className="font-semibold text-foreground">{conductor.vehiculo.placa}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/50">Sin vehículo</span>
        )}
        <SuscBadge estado={conductor.estado_suscripcion} />
      </div>
    </div>
  )
}