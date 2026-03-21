import {
  Building2, MapPin, Phone, Users, Truck,
  Pencil, PowerOff, Power, UserCog,
} from 'lucide-react'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { EstadoBadge } from '@/components/shared/EstadoBadge'
import { cn } from '@/lib/utils'
import type { Agencia } from '../agenciasStore'

interface Props {
  agencias: Agencia[]
  agenciaDetalle: Agencia | null
  onSeleccionar: (a: Agencia) => void
  onEditar: (a: Agencia) => void
  onAsignarEncargado: (a: Agencia) => void
  onToggleEstado: (a: Agencia) => void
}

export function TablaAgencias({
  agencias, agenciaDetalle,
  onSeleccionar, onEditar, onAsignarEncargado, onToggleEstado,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Agencia', 'Código', 'Región', 'Encargado', 'Conductores', 'Vehículos', 'Contacto', 'Estado', ''].map(h => (
              <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4 py-3 first:pl-5 last:pr-5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {agencias.map(agencia => {
            const esSeleccionada = agenciaDetalle?.id === agencia.id

            return (
              <tr
                key={agencia.id}
                onClick={() => onSeleccionar(agencia)}
                className={cn(
                  'hover:bg-secondary/30 transition-colors cursor-pointer',
                  esSeleccionada && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                <td className="px-4 py-3 pl-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-foreground block">{agencia.nombre}</span>
                      {agencia.direccion && <span className="text-[10px] text-muted-foreground">{agencia.direccion}</span>}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="text-xs font-mono bg-secondary px-2 py-1 rounded-lg text-foreground">
                    {agencia.codigo}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {agencia.region?.nombre ?? '—'}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {agencia.encargado?.nombre ?? 'Sin asignar'}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">
                      {agencia._count?.conductores ?? 0}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">
                      {agencia._count?.vehiculos ?? 0}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {agencia.telefono ? (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{agencia.telefono}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <EstadoBadge estado={agencia.estado} />
                </td>

                <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                  <MenuAcciones items={[
                    {
                      icon: <Pencil className="w-3.5 h-3.5" />,
                      label: 'Editar',
                      fn: () => onEditar(agencia),
                    },
                    {
                      icon: <UserCog className="w-3.5 h-3.5" />,
                      label: 'Asignar encargado',
                      fn: () => onAsignarEncargado(agencia),
                      separadorAntes: true,
                    },
                    {
                      icon: agencia.estado === 'activo'
                        ? <PowerOff className="w-3.5 h-3.5" />
                        : <Power className="w-3.5 h-3.5" />,
                      label: agencia.estado === 'activo' ? 'Desactivar' : 'Activar',
                      fn: () => onToggleEstado(agencia),
                      danger: agencia.estado === 'activo',
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