import { useEffect, useState } from 'react'
import {
    Route, Building2, MapPin,
    DollarSign, Milestone, Clock,
    Pencil, PowerOff, Power, Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    Dialog, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRutasStore, type Ruta } from './rutasStore'
import { ModalRuta } from './ModalRuta'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { cn } from '@/lib/utils'

// ── helpers ───────────────────────────────────────────────

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

// ── Página ────────────────────────────────────────────────

export function RutasPage() {
    const {
        rutas, cargando, error,
        regionesActivas,
        cargarRutas, cargarSelects,
        crearRuta, actualizarRuta, eliminarRuta,
        toggleActiva, limpiarError,
    } = useRutasStore()

    const [busqueda, setBusqueda] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [filtroRegion, setFiltroRegion] = useState('todas')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [rutaEditando, setRutaEditando] = useState<Ruta | null>(null)
    const [rutaDetalle, setRutaDetalle] = useState<Ruta | null>(null)
    const [rutaEliminando, setRutaEliminando] = useState<Ruta | null>(null)


    // ── carga inicial ─────────────────────────────────────
    useEffect(() => {
        cargarRutas()
        cargarSelects()
    }, [])

    // ── filtros ───────────────────────────────────────────
    const filtradas = rutas.filter(r => {
        const matchQ = r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            (r as any).agencia_origen?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            (r as any).agencia_destino?.nombre.toLowerCase().includes(busqueda.toLowerCase())
        const matchE = filtroEstado === 'todos' ||
            (filtroEstado === 'activa' && r.activa) ||
            (filtroEstado === 'inactiva' && !r.activa)
        const matchR = filtroRegion === 'todas' ||
            (r as any).region?.nombre === filtroRegion
        return matchQ && matchE && matchR
    })

    // ── handlers ─────────────────────────────────────────
    const handleGuardar = async (datos: any) => {
        if (rutaEditando) return actualizarRuta(rutaEditando.id, datos)
        return crearRuta(datos)
    }

    const handleEliminar = async (ruta: Ruta) => {
        const ok = await eliminarRuta(ruta.id)
        if (ok && rutaDetalle?.id === ruta.id) setRutaDetalle(null)
        setRutaEliminando(null)
    }

    const abrirCrear = () => {
        setRutaEditando(null)
        setModalAbierto(true)
    }

    const abrirEditar = (ruta: Ruta) => {
        setRutaEditando(ruta)
        setModalAbierto(true)
    }

    return (
        <>
            <TablaPage
                titulo="Rutas"
                subtitulo={`${rutas.length} ruta${rutas.length !== 1 ? 's' : ''} registrada${rutas.length !== 1 ? 's' : ''}`}
                labelBoton="Nueva ruta"
                placeholder="Buscar por nombre o agencia..."
                busqueda={busqueda}
                onBusqueda={setBusqueda}
                filtroEstado={filtroEstado}
                onFiltroEstado={setFiltroEstado}
                filtrosEstado={[
                    { valor: 'todos', label: 'Todas' },
                    { valor: 'activa', label: 'Activa' },
                    { valor: 'inactiva', label: 'Inactiva' },
                ]}
                filtroExtra={
                    regionesActivas.length > 1 && (
                        <Select value={filtroRegion} onValueChange={setFiltroRegion}>
                            <SelectTrigger className="h-9 w-48">
                                <SelectValue placeholder="Región" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas las regiones</SelectItem>
                                {regionesActivas.map(r => (
                                    <SelectItem key={r.id} value={r.nombre}>{r.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                }
                cargando={cargando}
                error={error}
                onLimpiarError={limpiarError}
                onRefresh={cargarRutas}
                onCrear={abrirCrear}
                panelDetalle={rutaDetalle && (
                    <PanelDetalle
                        titulo="Detalle ruta"
                        nombre={rutaDetalle.nombre}
                        subtitulo={(rutaDetalle as any).region?.nombre}
                        badge={<ActivaBadge activa={rutaDetalle.activa} />}
                        icono={<Route className="w-7 h-7 text-primary" />}
                        stats={[
                            { valor: formatPrecio(rutaDetalle.precio_pasaje), label: 'Precio' },
                            { valor: formatDuracion(rutaDetalle.duracion_estimada_min), label: 'Duración' },
                        ]}
                        campos={[
                            {
                                label: 'Origen',
                                valor: (rutaDetalle as any).agencia_origen?.nombre ?? '—',
                            },
                            {
                                label: 'Destino',
                                valor: (rutaDetalle as any).agencia_destino?.nombre ?? '—',
                            },
                            {
                                label: 'Distancia',
                                valor: rutaDetalle.distancia_km ? `${rutaDetalle.distancia_km} km` : '—',
                            },
                            {
                                label: 'Región',
                                valor: (rutaDetalle as any).region?.nombre ?? '—',
                            },
                            {
                                label: 'Creada',
                                valor: new Date(rutaDetalle.fecha_creacion).toLocaleDateString('es-CO', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                }),
                            },
                        ]}
                        onCerrar={() => setRutaDetalle(null)}
                        onEditar={() => { abrirEditar(rutaDetalle); setRutaDetalle(null) }}
                        labelEditar="Editar ruta"
                    />
                )}
            >
                {filtradas.length === 0 ? (
                    <TablaVacia
                        cargando={cargando}
                        hayDatos={rutas.length > 0}
                        hayBusqueda={!!busqueda}
                        icono={<Route className="w-6 h-6" />}
                        labelVacio="Sin rutas"
                        labelCrear="Nueva ruta"
                        onCrear={abrirCrear}
                    />
                ) : (
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
                                {filtradas.map(ruta => {
                                    const esSeleccionada = rutaDetalle?.id === ruta.id

                                    return (
                                        <tr
                                            key={ruta.id}
                                            onClick={() => setRutaDetalle(esSeleccionada ? null : ruta)}
                                            className={cn(
                                                'hover:bg-secondary/30 transition-colors cursor-pointer',
                                                esSeleccionada && 'bg-primary/5 border-l-2 border-l-primary'
                                            )}
                                        >
                                            {/* Nombre ruta */}
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

                                            {/* Origen → Destino */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Building2 className="w-3 h-3 shrink-0" />
                                                    <span>{(ruta as any).agencia_origen?.nombre ?? '—'}</span>
                                                    <span className="text-muted-foreground/40 mx-0.5">→</span>
                                                    <span>{(ruta as any).agencia_destino?.nombre ?? '—'}</span>
                                                </div>
                                            </td>

                                            {/* Región */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {(ruta as any).region?.nombre ?? '—'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Precio */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-sm font-bold text-foreground">
                                                        {formatPrecio(ruta.precio_pasaje)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Distancia */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Milestone className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {ruta.distancia_km ? `${ruta.distancia_km} km` : '—'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Duración */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDuracion(ruta.duracion_estimada_min)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Estado */}
                                            <td className="px-4 py-3">
                                                <ActivaBadge activa={ruta.activa} />
                                            </td>

                                            {/* Acciones */}
                                            <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                                                <MenuAcciones items={[
                                                    {
                                                        icon: <Pencil className="w-3.5 h-3.5" />,
                                                        label: 'Editar',
                                                        fn: () => abrirEditar(ruta),
                                                    },
                                                    {
                                                        icon: <Trash2 className="w-3.5 h-3.5" />,
                                                        label: 'Eliminar',
                                                        fn: () => setRutaEliminando(ruta),
                                                        danger: true,
                                                        separadorAntes: true,
                                                    },
                                                    {
                                                        icon: ruta.activa
                                                            ? <PowerOff className="w-3.5 h-3.5" />
                                                            : <Power className="w-3.5 h-3.5" />,
                                                        label: ruta.activa ? 'Desactivar' : 'Activar',
                                                        fn: () => toggleActiva(ruta.id, ruta.activa),
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
                )}
            </TablaPage>

            {/* Modal crear/editar */}
            {modalAbierto && (
                <ModalRuta
                    ruta={rutaEditando}
                    onGuardar={handleGuardar}
                    onCerrar={() => { setModalAbierto(false); setRutaEditando(null) }}
                    cargando={cargando}
                />
            )}

            {/* Modal confirmar eliminación */}
            {rutaEliminando && (
                <Dialog open onOpenChange={() => setRutaEliminando(null)}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-destructive/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </div>
                                <div>
                                    <DialogTitle>Eliminar ruta</DialogTitle>
                                    <DialogDescription>
                                        Esta acción no se puede deshacer
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="bg-secondary/50 rounded-xl p-3">
                                <p className="text-[10px] text-muted-foreground mb-0.5">Ruta a eliminar</p>
                                <p className="text-sm font-semibold text-foreground">{rutaEliminando.nombre}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {(rutaEliminando as any).agencia_origen?.nombre} →{' '}
                                    {(rutaEliminando as any).agencia_destino?.nombre}
                                </p>
                            </div>

                            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5">
                                <p className="text-xs text-destructive">
                                    Al eliminar esta ruta se perderá toda su configuración. Los viajes existentes no se verán afectados.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setRutaEliminando(null)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => handleEliminar(rutaEliminando)}
                                    disabled={cargando}
                                    className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
                                >
                                    {cargando ? 'Eliminando...' : 'Eliminar ruta'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}





