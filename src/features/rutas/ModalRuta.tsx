import { useState, useEffect } from 'react'
import {
    Route, DollarSign,
    Milestone, Clock,
} from 'lucide-react'
import {
    Dialog, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useRutasStore, type Ruta, type DatosRuta } from './rutasStore'

interface Props {
    ruta?: Ruta | null
    onGuardar: (datos: DatosRuta) => Promise<boolean>
    onCerrar: () => void
    cargando: boolean
}

export function ModalRuta({ ruta, onGuardar, onCerrar, cargando }: Props) {
    const esEdicion = !!ruta

    const {
        regionesActivas,
        agenciasActivas,
        cargarSelects,
    } = useRutasStore()

    // ── estado del form ───────────────────────────────────
    const [nombre, setNombre] = useState('')
    const [regionId, setRegionId] = useState('')
    const [origenId, setOrigenId] = useState('')
    const [destinoId, setDestinoId] = useState('')
    const [precio, setPrecio] = useState('')
    const [distancia, setDistancia] = useState('')
    const [duracion, setDuracion] = useState('')
    const [error, setError] = useState('')

    // agencias filtradas por región seleccionada
    const agenciasFiltradas = agenciasActivas.filter(a => a.region_id === regionId)

    // ── carga inicial ──────────────────────────────────────
    useEffect(() => {
        cargarSelects()
    }, [])

    // ── pre-rellenar si es edición ─────────────────────────
    useEffect(() => {
        if (ruta) {
            setNombre(ruta.nombre)
            setRegionId(ruta.region_id)
            setOrigenId(ruta.agencia_origen_id)
            setDestinoId(ruta.agencia_destino_id)
            setPrecio(ruta.precio_pasaje.toString())
            setDistancia(ruta.distancia_km?.toString() ?? '')
            setDuracion(ruta.duracion_estimada_min?.toString() ?? '')
        } else {
            setNombre(''); setRegionId(''); setOrigenId('')
            setDestinoId(''); setPrecio(''); setDistancia(''); setDuracion('')
        }
        setError('')
    }, [ruta])

    // limpiar origen/destino al cambiar región
    useEffect(() => {
        if (!ruta) {
            setOrigenId('')
            setDestinoId('')
        }
    }, [regionId])

    // ── submit ─────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!nombre.trim()) return setError('El nombre es requerido')
        if (!regionId) return setError('Selecciona una región')
        if (!origenId) return setError('Selecciona la agencia de origen')
        if (!destinoId) return setError('Selecciona la agencia de destino')
        if (origenId === destinoId) return setError('El origen y destino no pueden ser iguales')
        if (!precio) return setError('El precio del pasaje es requerido')

        const ok = await onGuardar({
            nombre: nombre.trim(),
            region_id: regionId,
            agencia_origen_id: origenId,
            agencia_destino_id: destinoId,
            precio_pasaje: parseFloat(precio),
            distancia_km: distancia ? parseFloat(distancia) : null,
            duracion_estimada_min: duracion ? parseInt(duracion) : null,
        })

        if (ok) onCerrar()
    }

    return (
        <Dialog open onOpenChange={onCerrar}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Route className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>
                                {esEdicion ? 'Editar ruta' : 'Nueva ruta'}
                            </DialogTitle>
                            <DialogDescription>
                                {esEdicion ? `Editando: ${ruta.nombre}` : 'Define el recorrido y precio'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Nombre ── */}
                    <div className="space-y-1.5">
                        <Label>Nombre de la ruta <span className="text-destructive">*</span></Label>
                        <div className="relative">
                            <Route className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Ej: Puerto Gaitán → Campo Rubiales"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                className="pl-9"
                                autoFocus
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* ── Región ── */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Recorrido
                        </p>

                        <div className="space-y-1.5">
                            <Label>Región <span className="text-destructive">*</span></Label>
                            <Select value={regionId} onValueChange={setRegionId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una región" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regionesActivas.map(r => (
                                        <SelectItem key={r.id} value={r.id}>
                                            {r.nombre} ({r.codigo})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Origen y destino — solo si hay región */}
                        {regionId && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label>Agencia origen <span className="text-destructive">*</span></Label>
                                    <Select value={origenId} onValueChange={setOrigenId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Origen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agenciasFiltradas.map(a => (
                                                <SelectItem
                                                    key={a.id}
                                                    value={a.id}
                                                    disabled={a.id === destinoId}
                                                >
                                                    {a.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Agencia destino <span className="text-destructive">*</span></Label>
                                    <Select value={destinoId} onValueChange={setDestinoId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Destino" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agenciasFiltradas.map(a => (
                                                <SelectItem
                                                    key={a.id}
                                                    value={a.id}
                                                    disabled={a.id === origenId}
                                                >
                                                    {a.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {regionId && agenciasFiltradas.length === 0 && (
                            <div className="bg-warning/10 border border-warning/20 rounded-xl px-3 py-2.5">
                                <p className="text-xs text-warning font-medium">
                                    No hay agencias activas en esta región
                                </p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* ── Detalles ── */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Detalles
                        </p>

                        <div className="space-y-1.5">
                            <Label>Precio del pasaje (COP) <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="35000"
                                    value={precio}
                                    type="number"
                                    onChange={e => setPrecio(e.target.value)}
                                    className="pl-9"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Distancia (km)</Label>
                                <div className="relative">
                                    <Milestone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder="120"
                                        value={distancia}
                                        type="number"
                                        onChange={e => setDistancia(e.target.value)}
                                        className="pl-9"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Duración estimada (min)</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder="90"
                                        value={duracion}
                                        type="number"
                                        onChange={e => setDuracion(e.target.value)}
                                        className="pl-9"
                                        min="0"
                                    />
                                </div>
                            </div>
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
                            {cargando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear ruta'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}