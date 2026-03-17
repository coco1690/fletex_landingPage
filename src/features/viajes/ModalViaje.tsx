import { useState, useEffect } from 'react'
import {
    Car, Calendar,
    DollarSign, Package, FileText,
} from 'lucide-react'
import {
    Dialog, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    useViajesStore, type Viaje, type DatosViaje,
} from './viajesStore'

interface Props {
    viaje?: Viaje | null
    onGuardar: (datos: DatosViaje) => Promise<boolean>
    onCerrar: () => void
    cargando: boolean
}

export function ModalViaje({ viaje, onGuardar, onCerrar, cargando }: Props) {
    const esEdicion = !!viaje

    const {
        conductoresOpciones,
        rutasOpciones,
        vehiculosOpciones,
        puntosAbordajeOpciones,
        cargarSelects,
    } = useViajesStore()

    // ── estado form ────────────────────────────────────
    const [conductorId, setConductorId] = useState('')
    const [rutaId, setRutaId] = useState('')
    const [vehiculoId, setVehiculoId] = useState('')
    const [horaSalida, setHoraSalida] = useState('')
    const [precio, setPrecio] = useState('')
    const [encomiendas, setEncomiendas] = useState(false)
    const [cargaKg, setCargaKg] = useState('')
    const [puntoId, setPuntoId] = useState('')
    const [observaciones, setObservaciones] = useState('')
    const [error, setError] = useState('')

    // precio sugerido según ruta seleccionada
    const rutaSeleccionada = rutasOpciones.find(r => r.id === rutaId)

    // ── carga inicial ──────────────────────────────────
    useEffect(() => {
        cargarSelects()
    }, [])

    // ── pre-rellenar si es edición ─────────────────────
    useEffect(() => {
        if (viaje) {
            setConductorId(viaje.conductor_id)
            setRutaId(viaje.ruta_id)
            setVehiculoId(viaje.vehiculo_id)
            setHoraSalida(viaje.hora_salida_programada.slice(0, 16))
            setPrecio(viaje.precio_pasaje.toString())
            setEncomiendas(viaje.acepta_encomiendas)
            setCargaKg(viaje.carga_disponible_kg?.toString() ?? '')
            setPuntoId(viaje.punto_abordaje_id ?? '')
            setObservaciones(viaje.observaciones ?? '')
        } else {
            setConductorId(''); setRutaId(''); setVehiculoId('')
            setHoraSalida(''); setPrecio(''); setEncomiendas(false)
            setCargaKg(''); setPuntoId(''); setObservaciones('')
        }
        setError('')
    }, [viaje])

    // auto-rellenar precio desde la ruta
    useEffect(() => {
        if (rutaSeleccionada && !esEdicion) {
            setPrecio(rutaSeleccionada.precio_pasaje.toString())
        }
    }, [rutaId])

    // ── submit ─────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!conductorId) return setError('Selecciona un conductor')
        if (!rutaId) return setError('Selecciona una ruta')
        if (!vehiculoId) return setError('Selecciona un vehículo')
        if (!horaSalida) return setError('La hora de salida es requerida')
        if (!precio) return setError('El precio es requerido')

        const ok = await onGuardar({
            conductor_id: conductorId,
            ruta_id: rutaId,
            vehiculo_id: vehiculoId,
            hora_salida_programada: horaSalida,
            precio_pasaje: parseFloat(precio),
            acepta_encomiendas: encomiendas,
            carga_disponible_kg: cargaKg ? parseFloat(cargaKg) : null,
            punto_abordaje_id: puntoId || null,
            observaciones: observaciones.trim() || null,
        })

        if (ok) onCerrar()
    }

    return (
        <Dialog open onOpenChange={onCerrar}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Car className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>
                                {esEdicion ? 'Editar viaje' : 'Nuevo viaje'}
                            </DialogTitle>
                            <DialogDescription>
                                {esEdicion ? 'Modifica los datos del viaje' : 'Programa un nuevo viaje'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Conductor y vehículo ── */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Conductor y vehículo
                        </p>

                        <div className="space-y-1.5">
                            <Label>Conductor <span className="text-destructive">*</span></Label>
                            <Select value={conductorId} onValueChange={setConductorId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un conductor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {conductoresOpciones.map(c => (
                                        <SelectItem key={c.id} value={c.id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{c.nombre}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {c.placa ? `Vehículo: ${c.placa}` : 'Sin vehículo asignado'}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Vehículo <span className="text-destructive">*</span></Label>
                            <Select value={vehiculoId} onValueChange={setVehiculoId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un vehículo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehiculosOpciones.map(v => (
                                        <SelectItem key={v.id} value={v.id}>
                                            <div className="flex flex-col">
                                                <span className="font-mono font-bold">{v.placa}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {v.tipo} · {v.capacidad_pasajeros} pasajeros
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    {/* ── Ruta y horario ── */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Ruta y horario
                        </p>

                        <div className="space-y-1.5">
                            <Label>Ruta <span className="text-destructive">*</span></Label>
                            <Select value={rutaId} onValueChange={setRutaId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una ruta" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rutasOpciones.map(r => (
                                        <SelectItem key={r.id} value={r.id}>
                                            {r.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Fecha y hora de salida <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <Input
                                    type="datetime-local"
                                    value={horaSalida}
                                    onChange={e => setHoraSalida(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {puntosAbordajeOpciones.length > 0 && (
                            <div className="space-y-1.5">
                                <Label>Punto de abordaje</Label>
                                <Select value={puntoId} onValueChange={setPuntoId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona punto de abordaje" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {puntosAbordajeOpciones.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* ── Precio y encomiendas ── */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Precio y encomiendas
                        </p>

                        <div className="space-y-1.5">
                            <Label>
                                Precio del pasaje (COP) <span className="text-destructive">*</span>
                                {rutaSeleccionada && (
                                    <span className="ml-2 text-[10px] text-muted-foreground font-normal">
                                        Sugerido: ${rutaSeleccionada.precio_pasaje.toLocaleString('es-CO')}
                                    </span>
                                )}
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <Input
                                    type="number"
                                    placeholder="35000"
                                    value={precio}
                                    onChange={e => setPrecio(e.target.value)}
                                    className="pl-9"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Toggle encomiendas */}
                        <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-4 py-3">
                            <div className="flex items-center gap-2.5">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">Acepta encomiendas</p>
                                    <p className="text-[10px] text-muted-foreground">El conductor puede llevar paquetes</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEncomiendas(!encomiendas)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${encomiendas ? 'bg-primary' : 'bg-secondary border border-border'
                                    }`}
                            >
                                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${encomiendas ? 'translate-x-4' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                        {encomiendas && (
                            <div className="space-y-1.5">
                                <Label>Capacidad de carga (kg)</Label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="50"
                                        value={cargaKg}
                                        onChange={e => setCargaKg(e.target.value)}
                                        className="pl-9"
                                        min="0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* ── Observaciones ── */}
                    <div className="space-y-1.5">
                        <Label>Observaciones</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
                            <textarea
                                value={observaciones}
                                onChange={e => setObservaciones(e.target.value)}
                                placeholder="Notas adicionales del viaje..."
                                rows={2}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none pl-9"
                            />
                        </div>
                    </div>

                    {/* ── Error ── */}
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                            <p className="text-xs text-destructive">{error}</p>
                        </div>
                    )}

                    {/* ── Botones ── */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onCerrar} className="flex-1">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={cargando} className="flex-1">
                            {cargando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear viaje'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}