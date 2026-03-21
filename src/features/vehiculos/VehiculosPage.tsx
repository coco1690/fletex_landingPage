import { useEffect, useState } from 'react'
import {
    Truck
} from 'lucide-react'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    useVehiculosStore, TIPO_LABELS, type Vehiculo,
} from './vehiculosStore'
import { ModalVehiculo } from './ModalVehiculo'
import { ModalAsignarConductor } from './ModalAsignarConductor'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { Paginacion } from '@/components/shared/Paginacion'
import { VehiculoCard } from './components/VehiculoCard'
import { TablaVehiculos } from './components/TablaVehiculos'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/supabase/types'

type EstadoVehiculo = Database['public']['Enums']['estado_vehiculo']
type TipoVehiculo = Database['public']['Enums']['tipo_vehiculo']

// ── helpers ──────────────────────────────────────────────

const ESTADO_VEH_CONFIG: Record<EstadoVehiculo, { label: string; cls: string }> = {
    activo:        { label: 'Activo',        cls: 'bg-success/10 text-success border-success/20' },
    mantenimiento: { label: 'Mantenimiento', cls: 'bg-warning/10 text-warning border-warning/20' },
    inactivo:      { label: 'Inactivo',      cls: 'bg-destructive/10 text-destructive border-destructive/20' },
}

function EstadoVehBadge({ estado }: { estado: EstadoVehiculo }) {
    const { label, cls } = ESTADO_VEH_CONFIG[estado]
    return <Badge variant="outline" className={cls}>{label}</Badge>
}

// ── Página ────────────────────────────────────────────────

export function VehiculosPage() {
    const {
        vehiculos, cargando, error,
        paginaActual, totalRegistros, totalPaginas,
        cargarVehiculos, cambiarPagina,
        crearVehiculo, actualizarVehiculo,
        cambiarEstado, asignarConductor,
        limpiarError,
    } = useVehiculosStore()

    const [busqueda, setBusqueda]                       = useState('')
    const [filtroEstado, setFiltroEstado]               = useState('todos')
    const [filtroTipo, setFiltroTipo]                   = useState('todos')
    const [modalAbierto, setModalAbierto]               = useState(false)
    const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false)
    const [vehiculoEditando, setVehiculoEditando]       = useState<Vehiculo | null>(null)
    const [vehiculoDetalle, setVehiculoDetalle]         = useState<Vehiculo | null>(null)
    const [vehiculoAsignando, setVehiculoAsignando]     = useState<Vehiculo | null>(null)

    // ── carga inicial ─────────────────────────────────────
    useEffect(() => { cargarVehiculos() }, [])

    // ── recargar al cambiar filtros (server-side) ─────────
    useEffect(() => {
        cargarVehiculos(
            {
                estado: filtroEstado,
                tipo: filtroTipo,
            },
            1,
        )
    }, [filtroEstado, filtroTipo])

    // ── filtro local por búsqueda de texto ────────────────
    const filtrados = vehiculos.filter(v => {
        const q = busqueda.toLowerCase()
        return (
            v.placa.toLowerCase().includes(q) ||
            (v.marca ?? '').toLowerCase().includes(q) ||
            (v.modelo ?? '').toLowerCase().includes(q)
        )
    })

    // ── handlers ─────────────────────────────────────────
    const handleSeleccionar = (v: Vehiculo) =>
        setVehiculoDetalle(vehiculoDetalle?.id === v.id ? null : v)

    const handleGuardar = async (datos: { placa: string; marca: string; modelo: string; anio: string; tipo: TipoVehiculo; capacidad_pasajeros: string; capacidad_carga_kg: string; agencia_id: string; estado: EstadoVehiculo }) => {
        const payload = {
            ...datos,
            anio: datos.anio ? parseInt(datos.anio) : null,
            capacidad_pasajeros: parseInt(datos.capacidad_pasajeros),
            capacidad_carga_kg: datos.capacidad_carga_kg ? parseFloat(datos.capacidad_carga_kg) : null,
        }
        if (vehiculoEditando) return actualizarVehiculo(vehiculoEditando.id, payload)
        return crearVehiculo(payload)
    }

    const buildFiltros = () => ({
        estado: filtroEstado,
        tipo: filtroTipo,
    })

    const subtitulo = totalRegistros > 0
        ? `${totalRegistros} vehículo${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
        : 'Sin vehículos registrados'

    return (
        <>
            <TablaPage
                titulo="Vehículos"
                subtitulo={subtitulo}
                labelBoton="Nuevo vehículo"
                placeholder="Buscar por placa, marca o modelo..."
                busqueda={busqueda}
                onBusqueda={setBusqueda}
                filtroEstado={filtroEstado}
                onFiltroEstado={setFiltroEstado}
                filtrosEstado={[
                    { valor: 'todos',         label: 'Todos' },
                    { valor: 'activo',        label: 'Activo' },
                    { valor: 'mantenimiento', label: 'Mantenimiento' },
                    { valor: 'inactivo',      label: 'Inactivo' },
                ]}
                filtroExtra={
                    <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                        <SelectTrigger className="h-9 w-44">
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos los tipos</SelectItem>
                            {(Object.entries(TIPO_LABELS) as [TipoVehiculo, string][]).map(([val, label]) => (
                                <SelectItem key={val} value={val}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                }
                cargando={cargando}
                error={error}
                onLimpiarError={limpiarError}
                onRefresh={() => cargarVehiculos(buildFiltros(), paginaActual)}
                onCrear={() => { setVehiculoEditando(null); setModalAbierto(true) }}
                panelDetalle={vehiculoDetalle && (
                    <PanelDetalle
                        titulo="Detalle vehículo"
                        nombre={vehiculoDetalle.placa}
                        subtitulo={
                            `${vehiculoDetalle.marca ?? ''} ${vehiculoDetalle.modelo ?? ''}`.trim() || 'Sin descripción'
                        }
                        badge={<EstadoVehBadge estado={vehiculoDetalle.estado} />}
                        icono={<Truck className="w-7 h-7 text-primary" />}
                        stats={[
                            { valor: vehiculoDetalle.capacidad_pasajeros, label: 'Pasajeros' },
                            {
                                valor: vehiculoDetalle.capacidad_carga_kg
                                    ? `${vehiculoDetalle.capacidad_carga_kg}kg`
                                    : '—',
                                label: 'Carga',
                            },
                        ]}
                        campos={[
                            { label: 'Tipo', valor: TIPO_LABELS[vehiculoDetalle.tipo] },
                            { label: 'Marca', valor: vehiculoDetalle.marca ?? '—' },
                            { label: 'Modelo', valor: vehiculoDetalle.modelo ?? '—' },
                            { label: 'Año', valor: vehiculoDetalle.anio?.toString() ?? '—' },
                            { label: 'Agencia', valor: vehiculoDetalle.agencia?.nombre ?? '—' },
                            {
                                label: 'Conductor',
                                valor: vehiculoDetalle.conductor?.nombre ?? 'Sin asignar',
                            },
                            {
                                label: 'Registrado',
                                valor: new Date(vehiculoDetalle.fecha_registro).toLocaleDateString('es-CO', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                }),
                            },
                        ]}
                        onCerrar={() => setVehiculoDetalle(null)}
                        onEditar={() => {
                            setVehiculoEditando(vehiculoDetalle)
                            setModalAbierto(true)
                            setVehiculoDetalle(null)
                        }}
                        labelEditar="Editar vehículo"
                    />
                )}
            >
                {filtrados.length === 0 ? (
                    <TablaVacia
                        cargando={cargando}
                        hayDatos={vehiculos.length > 0}
                        hayBusqueda={!!busqueda}
                        icono={<Truck className="w-6 h-6" />}
                        labelVacio="Sin vehículos"
                        labelCrear="Nuevo vehículo"
                        onCrear={() => { setVehiculoEditando(null); setModalAbierto(true) }}
                    />
                ) : (
                    <>
                        {/* Móvil — cards con scroll */}
                        <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
                            {filtrados.map(vehiculo => (
                                <VehiculoCard
                                    key={vehiculo.id}
                                    vehiculo={vehiculo}
                                    esSeleccionado={vehiculoDetalle?.id === vehiculo.id}
                                    onSeleccionar={() => handleSeleccionar(vehiculo)}
                                    onEditar={() => { setVehiculoEditando(vehiculo); setModalAbierto(true) }}
                                    onAsignarConductor={() => { setVehiculoAsignando(vehiculo); setModalAsignarAbierto(true) }}
                                    onCambiarEstado={(estado) => cambiarEstado(vehiculo.id, estado)}
                                />
                            ))}
                        </div>

                        {/* Desktop — tabla con scroll */}
                        <div className="hidden md:block">
                            <TablaVehiculos
                                vehiculos={filtrados}
                                vehiculoDetalle={vehiculoDetalle}
                                onSeleccionar={handleSeleccionar}
                                onEditar={(v) => { setVehiculoEditando(v); setModalAbierto(true) }}
                                onAsignarConductor={(v) => { setVehiculoAsignando(v); setModalAsignarAbierto(true) }}
                                onCambiarEstado={(v, estado) => cambiarEstado(v.id, estado)}
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

            {/* Modal crear/editar vehículo */}
            {modalAbierto && (
                <ModalVehiculo
                    vehiculo={vehiculoEditando}
                    onGuardar={handleGuardar}
                    onCerrar={() => { setModalAbierto(false); setVehiculoEditando(null) }}
                    cargando={cargando}
                />
            )}

            {/* Modal asignar conductor */}
            {modalAsignarAbierto && vehiculoAsignando && (
                <ModalAsignarConductor
                    vehiculo={vehiculoAsignando}
                    onGuardar={conductorId => asignarConductor(vehiculoAsignando.id, conductorId)}
                    onCerrar={() => { setModalAsignarAbierto(false); setVehiculoAsignando(null) }}
                    cargando={cargando}
                />
            )}
        </>
    )
}