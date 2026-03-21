import {
    Car, Building2, Users, Weight, UserCog,
    Pencil, Wrench, PowerOff, Power,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { cn } from '@/lib/utils'
import { TIPO_LABELS, type Vehiculo } from '../vehiculosStore'
import type { Database } from '@/supabase/types'

type EstadoVehiculo = Database['public']['Enums']['estado_vehiculo']

const ESTADO_VEH_CONFIG: Record<EstadoVehiculo, { label: string; cls: string }> = {
    activo:        { label: 'Activo',        cls: 'bg-success/10 text-success border-success/20' },
    mantenimiento: { label: 'Mantenimiento', cls: 'bg-warning/10 text-warning border-warning/20' },
    inactivo:      { label: 'Inactivo',      cls: 'bg-destructive/10 text-destructive border-destructive/20' },
}

function EstadoVehBadge({ estado }: { estado: EstadoVehiculo }) {
    const { label, cls } = ESTADO_VEH_CONFIG[estado]
    return <Badge variant="outline" className={cls}>{label}</Badge>
}

interface Props {
    vehiculos: Vehiculo[]
    vehiculoDetalle: Vehiculo | null
    onSeleccionar: (v: Vehiculo) => void
    onEditar: (v: Vehiculo) => void
    onAsignarConductor: (v: Vehiculo) => void
    onCambiarEstado: (v: Vehiculo, estado: EstadoVehiculo) => void
}

export function TablaVehiculos({
    vehiculos, vehiculoDetalle,
    onSeleccionar, onEditar, onAsignarConductor, onCambiarEstado,
}: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        {['Vehículo', 'Tipo', 'Agencia', 'Conductor', 'Capacidad', 'Estado', ''].map(h => (
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
                    {vehiculos.map(vehiculo => {
                        const esSeleccionado = vehiculoDetalle?.id === vehiculo.id
                        const conductor = vehiculo.conductor

                        return (
                            <tr
                                key={vehiculo.id}
                                onClick={() => onSeleccionar(vehiculo)}
                                className={cn(
                                    'hover:bg-secondary/30 transition-colors cursor-pointer',
                                    esSeleccionado && 'bg-primary/5 border-l-2 border-l-primary'
                                )}
                            >
                                <td className="px-4 py-3 pl-5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Car className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground font-mono">
                                                {vehiculo.placa}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {[vehiculo.marca, vehiculo.modelo, vehiculo.anio && `· ${vehiculo.anio}`]
                                                    .filter(Boolean).join(' ')}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <span className="text-xs bg-secondary px-2 py-1 rounded-lg text-foreground">
                                        {TIPO_LABELS[vehiculo.tipo]}
                                    </span>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                        <span className="text-xs text-muted-foreground">
                                            {vehiculo.agencia?.nombre ?? '—'}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    {conductor ? (
                                        <div className="flex items-center gap-1.5">
                                            <UserCog className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                            <span className="text-xs text-foreground font-medium">
                                                {conductor.nombre}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground/50">Sin conductor</span>
                                    )}
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs font-bold text-foreground">
                                                {vehiculo.capacidad_pasajeros}
                                            </span>
                                        </div>
                                        {vehiculo.capacidad_carga_kg && (
                                            <div className="flex items-center gap-1">
                                                <Weight className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {vehiculo.capacidad_carga_kg}kg
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <EstadoVehBadge estado={vehiculo.estado} />
                                </td>

                                <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                                    <MenuAcciones items={[
                                        {
                                            icon: <Pencil className="w-3.5 h-3.5" />,
                                            label: 'Editar',
                                            fn: () => onEditar(vehiculo),
                                        },
                                        {
                                            icon: <UserCog className="w-3.5 h-3.5" />,
                                            label: 'Asignar conductor',
                                            fn: () => onAsignarConductor(vehiculo),
                                            separadorAntes: true,
                                        },
                                        {
                                            icon: <Wrench className="w-3.5 h-3.5" />,
                                            label: vehiculo.estado === 'mantenimiento'
                                                ? 'Quitar mantenimiento'
                                                : 'En mantenimiento',
                                            fn: () => onCambiarEstado(
                                                vehiculo,
                                                vehiculo.estado === 'mantenimiento' ? 'activo' : 'mantenimiento'
                                            ),
                                            separadorAntes: true,
                                        },
                                        {
                                            icon: vehiculo.estado === 'activo'
                                                ? <PowerOff className="w-3.5 h-3.5" />
                                                : <Power className="w-3.5 h-3.5" />,
                                            label: vehiculo.estado === 'inactivo' ? 'Activar' : 'Desactivar',
                                            fn: () => onCambiarEstado(
                                                vehiculo,
                                                vehiculo.estado === 'inactivo' ? 'activo' : 'inactivo'
                                            ),
                                            danger: vehiculo.estado !== 'inactivo',
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