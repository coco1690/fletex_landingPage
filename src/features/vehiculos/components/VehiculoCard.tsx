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
    vehiculo: Vehiculo
    esSeleccionado: boolean
    onSeleccionar: () => void
    onEditar: () => void
    onAsignarConductor: () => void
    onCambiarEstado: (estado: EstadoVehiculo) => void
}

export function VehiculoCard({
    vehiculo, esSeleccionado,
    onSeleccionar, onEditar, onAsignarConductor, onCambiarEstado,
}: Props) {
    const conductor = (vehiculo as any).conductor?.usuario

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
                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                        <Car className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-black text-foreground font-mono">
                            {vehiculo.placa}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            {[vehiculo.marca, vehiculo.modelo, vehiculo.anio && `· ${vehiculo.anio}`]
                                .filter(Boolean).join(' ')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    <EstadoVehBadge estado={vehiculo.estado} />
                    <MenuAcciones items={[
                        {
                            icon: <Pencil className="w-3.5 h-3.5" />,
                            label: 'Editar',
                            fn: onEditar,
                        },
                        {
                            icon: <UserCog className="w-3.5 h-3.5" />,
                            label: 'Asignar conductor',
                            fn: onAsignarConductor,
                            separadorAntes: true,
                        },
                        {
                            icon: <Wrench className="w-3.5 h-3.5" />,
                            label: vehiculo.estado === 'mantenimiento'
                                ? 'Quitar mantenimiento'
                                : 'En mantenimiento',
                            fn: () => onCambiarEstado(
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
                                vehiculo.estado === 'inactivo' ? 'activo' : 'inactivo'
                            ),
                            danger: vehiculo.estado !== 'inactivo',
                        },
                    ]} />
                </div>
            </div>

            {/* Info extra */}
            <div className="flex items-center gap-4 mt-2 ml-12 flex-wrap text-xs text-muted-foreground">
                <span className="bg-secondary px-2 py-0.5 rounded-lg text-foreground">
                    {TIPO_LABELS[vehiculo.tipo]}
                </span>
                <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{(vehiculo as any).agencia?.nombre ?? '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span className="font-bold text-foreground">{vehiculo.capacidad_pasajeros}</span>
                </div>
                {vehiculo.capacidad_carga_kg && (
                    <div className="flex items-center gap-1">
                        <Weight className="w-3 h-3" />
                        <span>{vehiculo.capacidad_carga_kg}kg</span>
                    </div>
                )}
                {conductor ? (
                    <div className="flex items-center gap-1">
                        <UserCog className="w-3 h-3" />
                        <span className="font-medium text-foreground">{conductor.nombre}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground/50">Sin conductor</span>
                )}
            </div>
        </div>
    )
}