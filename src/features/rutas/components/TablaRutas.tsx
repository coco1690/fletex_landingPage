import {
    Route, Building2, MapPin,
    DollarSign, Milestone, Clock,
    Pencil, PowerOff, Power, Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { cn } from '@/lib/utils'
import type { Ruta } from '../rutasStore'

function formatPrecio(valor: number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP',
        minimumFractionDigits: 0,
    }).format(valor)
}

function formatDuracion(min: number | null) {
    if (!min) return '—'
    const h = Math.floor(min / 60)
    const m = min % 60
    if (h === 0) return `${m} min`
    if (m === 0) return `${h}h`
    return `${h}h ${m}min`
}

function ActivaBadge({ activa }: { activa: boolean }) {
    return (
        <Badge variant="outline" className={cn(
            activa
                ? 'bg-success/10 text-success border-success/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'
        )}>
            {activa ? 'Activa' : 'Inactiva'}
        </Badge>
    )
}

interface Props {
    rutas: Ruta[]
    rutaDetalle: Ruta | null
    onSeleccionar: (ruta: Ruta) => void
    onEditar: (ruta: Ruta) => void
    onEliminar: (ruta: Ruta) => void
    onToggleActiva: (ruta: Ruta) => void
}

export function TablaRutas({
    rutas, rutaDetalle,
    onSeleccionar, onEditar, onEliminar, onToggleActiva,
}: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        {['Ruta', 'Origen → Destino', 'Región', 'Precio', 'Distancia', 'Duración', 'Estado', ''].map(h => (
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
                    {rutas.map(ruta => {
                        const esSeleccionada = rutaDetalle?.id === ruta.id

                        return (
                            <tr
                                key={ruta.id}
                                onClick={() => onSeleccionar(ruta)}
                                className={cn(
                                    'hover:bg-secondary/30 transition-colors cursor-pointer',
                                    esSeleccionada && 'bg-primary/5 border-l-2 border-l-primary'
                                )}
                            >
                                <td className="px-4 py-3 pl-5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Route className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                            {ruta.nombre}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Building2 className="w-3 h-3 shrink-0" />
                                        <span>{(ruta as any).agencia_origen?.nombre ?? '—'}</span>
                                        <span className="text-muted-foreground/40 mx-0.5">→</span>
                                        <span>{(ruta as any).agencia_destino?.nombre ?? '—'}</span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                        <span className="text-xs text-muted-foreground">
                                            {(ruta as any).region?.nombre ?? '—'}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-sm font-bold text-foreground">
                                            {formatPrecio(ruta.precio_pasaje)}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <Milestone className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            {ruta.distancia_km ? `${ruta.distancia_km} km` : '—'}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            {formatDuracion(ruta.duracion_estimada_min)}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <ActivaBadge activa={ruta.activa} />
                                </td>

                                <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                                    <MenuAcciones items={[
                                        {
                                            icon: <Pencil className="w-3.5 h-3.5" />,
                                            label: 'Editar',
                                            fn: () => onEditar(ruta),
                                        },
                                        {
                                            icon: <Trash2 className="w-3.5 h-3.5" />,
                                            label: 'Eliminar',
                                            fn: () => onEliminar(ruta),
                                            danger: true,
                                            separadorAntes: true,
                                        },
                                        {
                                            icon: ruta.activa
                                                ? <PowerOff className="w-3.5 h-3.5" />
                                                : <Power className="w-3.5 h-3.5" />,
                                            label: ruta.activa ? 'Desactivar' : 'Activar',
                                            fn: () => onToggleActiva(ruta),
                                            danger: ruta.activa,
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