import { Route, Building2, MapPin, DollarSign, Pencil, PowerOff, Power, Trash2 } from 'lucide-react'
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
    ruta: Ruta
    esSeleccionada: boolean
    onSeleccionar: () => void
    onEditar: () => void
    onEliminar: () => void
    onToggleActiva: () => void
}

export function RutaCard({
    ruta, esSeleccionada,
    onSeleccionar, onEditar, onEliminar, onToggleActiva,
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
                        <Route className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                            {ruta.nombre}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                                {ruta.agencia_origen?.nombre ?? '—'}
                                {' → '}
                                {ruta.agencia_destino?.nombre ?? '—'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    <ActivaBadge activa={ruta.activa} />
                    <MenuAcciones items={[
                        {
                            icon: <Pencil className="w-3.5 h-3.5" />,
                            label: 'Editar',
                            fn: onEditar,
                        },
                        {
                            icon: <Trash2 className="w-3.5 h-3.5" />,
                            label: 'Eliminar',
                            fn: onEliminar,
                            danger: true,
                            separadorAntes: true,
                        },
                        {
                            icon: ruta.activa
                                ? <PowerOff className="w-3.5 h-3.5" />
                                : <Power className="w-3.5 h-3.5" />,
                            label: ruta.activa ? 'Desactivar' : 'Activar',
                            fn: onToggleActiva,
                            danger: ruta.activa,
                            separadorAntes: true,
                        },
                    ]} />
                </div>
            </div>

            {/* Info extra */}
            <div className="flex items-center gap-4 mt-2 ml-12 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{ruta.region?.nombre ?? '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-bold text-foreground">{formatPrecio(ruta.precio_pasaje)}</span>
                </div>
                {ruta.duracion_estimada_min && (
                    <span>{formatDuracion(ruta.duracion_estimada_min)}</span>
                )}
                {ruta.distancia_km && (
                    <span>{ruta.distancia_km} km</span>
                )}
            </div>
        </div>
    )
}