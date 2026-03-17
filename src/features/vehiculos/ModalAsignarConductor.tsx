import { useState, useEffect } from 'react'
import { UserCog, X } from 'lucide-react'
import {
    Dialog, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    useVehiculosStore, type Vehiculo,
} from './vehiculosStore'

interface Props {
    vehiculo: Vehiculo
    onGuardar: (conductorId: string | null) => Promise<boolean>
    onCerrar: () => void
    cargando: boolean
}

export function ModalAsignarConductor({ vehiculo, onGuardar, onCerrar, cargando }: Props) {
    const {
        conductoresDisponibles,
        cargandoConductores,
        cargarConductoresPorAgencia,
    } = useVehiculosStore()

    const [conductorId, setConductorId] = useState('')
    const [error, setError] = useState('')

    const conductorActual = (vehiculo as any).conductor?.usuario?.nombre ?? null

    useEffect(() => {
        cargarConductoresPorAgencia(vehiculo.agencia_id, vehiculo.id)
    }, [])

    useEffect(() => {
        // preseleccionar conductor actual si existe en la lista
        if (vehiculo.conductor_id && conductoresDisponibles.length > 0) {
            const actual = conductoresDisponibles.find(c => c.id === vehiculo.conductor_id)
            if (actual) setConductorId(actual.id)
        }
    }, [conductoresDisponibles])

    const handleGuardar = async () => {
        setError('')
        try {
            const ok = await onGuardar(conductorId || null)
            if (ok) {
                onCerrar()
            } else {
                setError('Error al asignar el conductor')
            }
        } catch (e: any) {
            setError(e.message)
        }
    }

    const handleDesasignar = async () => {
        setError('')
        try {
            const ok = await onGuardar(null)
            if (ok) {
                onCerrar()
            } else {
                setError('Error al quitar el conductor')
            }
        } catch (e: any) {
            setError(e.message)
        }
    }

    const conductorSeleccionado = conductoresDisponibles.find(c => c.id === conductorId)

    return (
        <Dialog open onOpenChange={onCerrar}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <UserCog className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Asignar conductor</DialogTitle>
                            <DialogDescription>
                                Vehículo <span className="font-mono font-bold">{vehiculo.placa}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">

                    {/* Conductor actual */}
                    <div className="bg-secondary/50 rounded-xl p-3">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Conductor actual</p>
                        <p className="text-sm font-semibold text-foreground">
                            {conductorActual ?? 'Sin conductor asignado'}
                        </p>
                    </div>

                    {/* Select conductor */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-foreground">Nuevo conductor</p>

                        {cargandoConductores ? (
                            <div className="h-9 bg-secondary animate-pulse rounded-lg" />
                        ) : conductoresDisponibles.length === 0 ? (
                            <div className="bg-warning/10 border border-warning/20 rounded-xl px-3 py-2.5">
                                <p className="text-xs text-warning font-medium">
                                    No hay conductores activos en esta agencia
                                </p>
                            </div>
                        ) : (
                            <Select value={conductorId} onValueChange={setConductorId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona un conductor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {conductoresDisponibles.map(c => (
                                        <SelectItem key={c.id} value={c.id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{c.nombre}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {c.licencia}
                                                    {c.tiene_vehiculo && ' · Ya tiene vehículo'}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Advertencia conductor con vehículo */}
                    {conductorSeleccionado?.tiene_vehiculo && (
                        <div className="bg-warning/10 border border-warning/20 rounded-xl px-3 py-2">
                            <p className="text-xs text-warning">
                                Este conductor ya tiene un vehículo asignado. Al continuar se reasignará a este vehículo.
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                            <p className="text-xs text-destructive">{error}</p>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-2 pt-1">
                        {conductorActual && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleDesasignar}
                                disabled={cargando}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                            >
                                <X className="w-3.5 h-3.5 mr-1.5" />
                                Quitar
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCerrar}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleGuardar}
                            disabled={cargando || !conductorId || cargandoConductores}
                            className="flex-1"
                        >
                            {cargando ? 'Asignando...' : 'Asignar'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}