import { useEffect, useState } from 'react'
import {
    Route, Trash2,
} from 'lucide-react'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    Dialog, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRutasStore, type Ruta, type DatosRuta } from './rutasStore'
import { ModalRuta } from './ModalRuta'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { Paginacion } from '@/components/shared/Paginacion'
import { RutaCard } from './components/RutaCard'
import { TablaRutas } from './components/TablaRutas'
import { Badge } from '@/components/ui/badge'
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
        paginaActual, totalRegistros, totalPaginas,
        regionesActivas,
        cargarRutas, cargarSelects, cambiarPagina,
        crearRuta, actualizarRuta, eliminarRuta,
        toggleActiva, limpiarError,
    } = useRutasStore()

    const [busqueda, setBusqueda]           = useState('')
    const [filtroEstado, setFiltroEstado]   = useState('todos')
    const [filtroRegion, setFiltroRegion]   = useState('todas')
    const [modalAbierto, setModalAbierto]   = useState(false)
    const [rutaEditando, setRutaEditando]   = useState<Ruta | null>(null)
    const [rutaDetalle, setRutaDetalle]     = useState<Ruta | null>(null)
    const [rutaEliminando, setRutaEliminando] = useState<Ruta | null>(null)

    // ── carga inicial ─────────────────────────────────────
    useEffect(() => { cargarRutas(); cargarSelects() }, [])

    // ── recargar al cambiar filtros (server-side) ─────────
    useEffect(() => {
        cargarRutas(
            { estado: filtroEstado, region: filtroRegion !== 'todas' ? filtroRegion : undefined },
            1,
        )
    }, [filtroEstado, filtroRegion])

    // ── filtro local por búsqueda de texto ────────────────
    const filtradas = rutas.filter(r => {
        const q = busqueda.toLowerCase()
        return (
            r.nombre.toLowerCase().includes(q) ||
            (r.agencia_origen?.nombre ?? '').toLowerCase().includes(q) ||
            (r.agencia_destino?.nombre ?? '').toLowerCase().includes(q)
        )
    })

    // ── handlers ─────────────────────────────────────────
    const abrirCrear  = () => { setRutaEditando(null); setModalAbierto(true) }
    const abrirEditar = (ruta: Ruta) => { setRutaEditando(ruta); setModalAbierto(true) }

    const handleGuardar = async (datos: DatosRuta) =>
        rutaEditando ? actualizarRuta(rutaEditando.id, datos) : crearRuta(datos)

    const handleEliminar = async (ruta: Ruta) => {
        const ok = await eliminarRuta(ruta.id)
        if (ok && rutaDetalle?.id === ruta.id) setRutaDetalle(null)
        setRutaEliminando(null)
    }

    const handleSeleccionar = (ruta: Ruta) =>
        setRutaDetalle(rutaDetalle?.id === ruta.id ? null : ruta)

    const subtitulo = totalRegistros > 0
        ? `${totalRegistros} ruta${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
        : 'Sin rutas registradas'

    return (
        <>
            <TablaPage
                titulo="Rutas"
                subtitulo={subtitulo}
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
                                    <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                }
                cargando={cargando}
                error={error}
                onLimpiarError={limpiarError}
                onRefresh={() => cargarRutas(
                    { estado: filtroEstado, region: filtroRegion !== 'todas' ? filtroRegion : undefined },
                    paginaActual,
                )}
                onCrear={abrirCrear}
                panelDetalle={rutaDetalle && (
                    <PanelDetalle
                        titulo="Detalle ruta"
                        nombre={rutaDetalle.nombre}
                        subtitulo={rutaDetalle.region?.nombre}
                        badge={<ActivaBadge activa={rutaDetalle.activa} />}
                        icono={<Route className="w-7 h-7 text-primary" />}
                        stats={[
                            { valor: formatPrecio(rutaDetalle.precio_pasaje), label: 'Precio' },
                            { valor: formatDuracion(rutaDetalle.duracion_estimada_min), label: 'Duración' },
                        ]}
                        campos={[
                            { label: 'Origen', valor: rutaDetalle.agencia_origen?.nombre ?? '—' },
                            { label: 'Destino', valor: rutaDetalle.agencia_destino?.nombre ?? '—' },
                            { label: 'Distancia', valor: rutaDetalle.distancia_km ? `${rutaDetalle.distancia_km} km` : '—' },
                            { label: 'Región', valor: rutaDetalle.region?.nombre ?? '—' },
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
                    <>
                        {/* Móvil — cards con scroll */}
                        <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
                            {filtradas.map(ruta => (
                                <RutaCard
                                    key={ruta.id}
                                    ruta={ruta}
                                    esSeleccionada={rutaDetalle?.id === ruta.id}
                                    onSeleccionar={() => handleSeleccionar(ruta)}
                                    onEditar={() => abrirEditar(ruta)}
                                    onEliminar={() => setRutaEliminando(ruta)}
                                    onToggleActiva={() => toggleActiva(ruta.id, ruta.activa)}
                                />
                            ))}
                        </div>

                        {/* Desktop — tabla con scroll */}
                        <div className="hidden md:block">
                            <TablaRutas
                                rutas={filtradas}
                                rutaDetalle={rutaDetalle}
                                onSeleccionar={handleSeleccionar}
                                onEditar={abrirEditar}
                                onEliminar={setRutaEliminando}
                                onToggleActiva={(ruta) => toggleActiva(ruta.id, ruta.activa)}
                            />
                        </div>
                    </>
                )}

                {totalPaginas > 1 && (
                    <Paginacion
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        totalRegistros={totalRegistros}
                        porPagina={8}
                        onCambiar={cambiarPagina}
                        cargando={cargando}
                    />
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
                                    <DialogDescription>Esta acción no se puede deshacer</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="bg-secondary/50 rounded-xl p-3">
                                <p className="text-[10px] text-muted-foreground mb-0.5">Ruta a eliminar</p>
                                <p className="text-sm font-semibold text-foreground">{rutaEliminando.nombre}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {rutaEliminando.agencia_origen?.nombre} →{' '}
                                    {rutaEliminando.agencia_destino?.nombre}
                                </p>
                            </div>

                            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5">
                                <p className="text-xs text-destructive">
                                    Al eliminar esta ruta se perderá toda su configuración. Los viajes existentes no se verán afectados.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setRutaEliminando(null)} className="flex-1">
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