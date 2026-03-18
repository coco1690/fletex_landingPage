import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useAgenciasStore, type Agencia } from './agenciasStore'
import { ModalAgencia } from './ModalAgencia'
import { ModalAsignarEncargado } from './ModalAsignarEncargado'
import { EstadoBadge } from '@/components/shared/EstadoBadge'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { Paginacion } from '@/components/shared/Paginacion'
import { AgenciaCard } from './components/AgenciaCard'
import { TablaAgencias } from './components/TablaAgencias'

export function AgenciasPage() {
  const {
    agencias, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    regionesOpciones,
    cargarAgencias, cargarSelects, cambiarPagina,
    crearAgencia, actualizarAgencia,
    toggleEstado, limpiarError,
  } = useAgenciasStore()

  const [busqueda, setBusqueda]                       = useState('')
  const [filtroEstado, setFiltroEstado]               = useState('todos')
  const [filtroRegion, setFiltroRegion]               = useState('todas')
  const [modalAbierto, setModalAbierto]               = useState(false)
  const [agenciaEditando, setAgenciaEditando]         = useState<Agencia | null>(null)
  const [agenciaDetalle, setAgenciaDetalle]           = useState<Agencia | null>(null)
  const [modalEncargadoAbierto, setModalEncargadoAbierto] = useState(false)
  const [agenciaEncargando, setAgenciaEncargando]     = useState<Agencia | null>(null)

  // ── carga inicial ─────────────────────────────────────
  useEffect(() => { cargarAgencias(); cargarSelects() }, [])

  // ── recargar al cambiar filtros (server-side) ─────────
  useEffect(() => {
    cargarAgencias(
      {
        estado: filtroEstado,
        region_id: filtroRegion !== 'todas' ? filtroRegion : undefined,
      },
      1,
    )
  }, [filtroEstado, filtroRegion])

  // ── filtro local por búsqueda de texto ────────────────
  const filtradas = agencias.filter(a => {
    const q = busqueda.toLowerCase()
    return (
      a.nombre.toLowerCase().includes(q) ||
      a.codigo.toLowerCase().includes(q)
    )
  })

  // ── handlers ─────────────────────────────────────────
  const handleSeleccionar = (a: Agencia) =>
    setAgenciaDetalle(agenciaDetalle?.id === a.id ? null : a)

  const handleGuardar = async (datos: any) =>
    agenciaEditando ? actualizarAgencia(agenciaEditando.id, datos) : crearAgencia(datos)

  const buildFiltros = () => ({
    estado: filtroEstado,
    region_id: filtroRegion !== 'todas' ? filtroRegion : undefined,
  })

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} agencia${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin agencias registradas'

  return (
    <>
      <TablaPage
        titulo="Agencias"
        subtitulo={subtitulo}
        labelBoton="Nueva agencia"
        placeholder="Buscar agencia..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        filtroExtra={
          regionesOpciones.length > 1 && (
            <Select value={filtroRegion} onValueChange={setFiltroRegion}>
              <SelectTrigger className="h-9 w-48">
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las regiones</SelectItem>
                {regionesOpciones.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={() => cargarAgencias(buildFiltros(), paginaActual)}
        onCrear={() => { setAgenciaEditando(null); setModalAbierto(true) }}
        panelDetalle={agenciaDetalle && (
          <PanelDetalle
            titulo="Detalle agencia"
            nombre={agenciaDetalle.nombre}
            subtitulo={(agenciaDetalle as any).region?.nombre}
            badge={<EstadoBadge estado={agenciaDetalle.estado} />}
            icono={<Building2 className="w-7 h-7 text-primary" />}
            stats={[
              { valor: agenciaDetalle._count?.conductores ?? 0, label: 'Conductores' },
              { valor: agenciaDetalle._count?.vehiculos ?? 0, label: 'Vehículos' },
            ]}
            campos={[
              { label: 'Código', valor: agenciaDetalle.codigo },
              { label: 'Región', valor: (agenciaDetalle as any).region?.nombre ?? '—' },
              { label: 'Teléfono', valor: agenciaDetalle.telefono ?? 'No registrado' },
              { label: 'Dirección', valor: agenciaDetalle.direccion ?? 'No registrada' },
              { label: 'Encargado', valor: (agenciaDetalle as any).encargado?.nombre ?? 'Sin asignar' },
              {
                label: 'Creada',
                valor: new Date(agenciaDetalle.fecha_creacion).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric',
                }),
              },
            ]}
            onCerrar={() => setAgenciaDetalle(null)}
            onEditar={() => {
              setAgenciaEditando(agenciaDetalle)
              setModalAbierto(true)
              setAgenciaDetalle(null)
            }}
            labelEditar="Editar agencia"
          />
        )}
      >
        {filtradas.length === 0 ? (
          <TablaVacia
            cargando={cargando}
            hayDatos={agencias.length > 0}
            hayBusqueda={!!busqueda}
            icono={<Building2 className="w-6 h-6" />}
            labelVacio="Sin agencias"
            labelCrear="Nueva agencia"
            onCrear={() => { setAgenciaEditando(null); setModalAbierto(true) }}
          />
        ) : (
          <>
            {/* Móvil — cards con scroll */}
            <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
              {filtradas.map(agencia => (
                <AgenciaCard
                  key={agencia.id}
                  agencia={agencia}
                  esSeleccionada={agenciaDetalle?.id === agencia.id}
                  onSeleccionar={() => handleSeleccionar(agencia)}
                  onEditar={() => { setAgenciaEditando(agencia); setModalAbierto(true) }}
                  onAsignarEncargado={() => { setAgenciaEncargando(agencia); setModalEncargadoAbierto(true) }}
                  onToggleEstado={() => toggleEstado(agencia.id, agencia.estado)}
                />
              ))}
            </div>

            {/* Desktop — tabla con scroll */}
            <div className="hidden md:block">
              <TablaAgencias
                agencias={filtradas}
                agenciaDetalle={agenciaDetalle}
                onSeleccionar={handleSeleccionar}
                onEditar={(a) => { setAgenciaEditando(a); setModalAbierto(true) }}
                onAsignarEncargado={(a) => { setAgenciaEncargando(a); setModalEncargadoAbierto(true) }}
                onToggleEstado={(a) => toggleEstado(a.id, a.estado)}
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
        <ModalAgencia
          agencia={agenciaEditando}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setAgenciaEditando(null) }}
          cargando={cargando}
        />
      )}

      {/* Modal asignar encargado */}
      {modalEncargadoAbierto && agenciaEncargando && (
        <ModalAsignarEncargado
          agencia={agenciaEncargando}
          onCerrar={() => { setModalEncargadoAbierto(false); setAgenciaEncargando(null) }}
          cargando={cargando}
        />
      )}
    </>
  )
}