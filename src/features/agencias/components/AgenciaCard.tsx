import {
  Building2, MapPin, Phone, Users, Truck,
  Pencil, PowerOff, Power, UserCog,
} from 'lucide-react'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { EstadoBadge } from '@/components/shared/EstadoBadge'
import { cn } from '@/lib/utils'
import type { Agencia } from '../agenciasStore'

interface Props {
  agencia: Agencia
  esSeleccionada: boolean
  onSeleccionar: () => void
  onEditar: () => void
  onAsignarEncargado: () => void
  onToggleEstado: () => void
}

export function AgenciaCard({
  agencia, esSeleccionada,
  onSeleccionar, onEditar, onAsignarEncargado, onToggleEstado,
}: Props) {
  return (
    <div
      onClick={onSeleccionar}
      className={cn(
        'px-4 py-3 cursor-pointer transition-colors hover:bg-secondary/30',
        esSeleccionada && 'bg-primary/5 border-l-2 border-l-primary'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {agencia.nombre}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {agencia.codigo}
              {agencia.direccion && ` · ${agencia.direccion}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <EstadoBadge estado={agencia.estado} />
          <MenuAcciones items={[
            {
              icon: <Pencil className="w-3.5 h-3.5" />,
              label: 'Editar',
              fn: onEditar,
            },
            {
              icon: <UserCog className="w-3.5 h-3.5" />,
              label: 'Asignar encargado',
              fn: onAsignarEncargado,
              separadorAntes: true,
            },
            {
              icon: agencia.estado === 'activo'
                ? <PowerOff className="w-3.5 h-3.5" />
                : <Power className="w-3.5 h-3.5" />,
              label: agencia.estado === 'activo' ? 'Desactivar' : 'Activar',
              fn: onToggleEstado,
              danger: agencia.estado === 'activo',
            },
          ]} />
        </div>
      </div>

      {/* Info extra */}
      <div className="flex items-center gap-4 mt-2 ml-12 flex-wrap text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{(agencia as any).region?.nombre ?? '—'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span className="font-bold text-foreground">{agencia._count?.conductores ?? 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <Truck className="w-3 h-3" />
          <span className="font-bold text-foreground">{agencia._count?.vehiculos ?? 0}</span>
        </div>
        {agencia.telefono && (
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{agencia.telefono}</span>
          </div>
        )}
        {(agencia as any).encargado?.nombre && (
          <div className="flex items-center gap-1">
            <UserCog className="w-3 h-3" />
            <span>{(agencia as any).encargado.nombre}</span>
          </div>
        )}
      </div>
    </div>
  )
}