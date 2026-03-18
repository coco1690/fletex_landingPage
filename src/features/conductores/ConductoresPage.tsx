import { useEffect, useState } from 'react'
import {
  User, UserCog,
} from 'lucide-react'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useConductoresStore, type Conductor } from './conductoresStore'
import { useAuthStore } from '@/store/authStore'
import { ModalConductor } from './ModalConductor'
import { ModalPago } from './ModalPago'
import { EstadoBadge } from '@/components/shared/EstadoBadge'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { Paginacion } from '@/components/shared/Paginacion'
import { ConductorCard } from './components/ConductorCard'
import { TablaConductores } from './components/TablaConductores'
import { Badge } from '@/components/ui/badge'

// ── helpers ──────────────────────────────────────────────

const SUSC_CONFIG = {
  activo:               { label: 'Activa',     cls: 'bg-success/10 text-success border-success/20' },
  por_vencer:           { label: 'Por vencer', cls: 'bg-warning/10 text-warning border-warning/20' },
  suspendido:           { label: 'Suspendida', cls: 'bg-destructive/10 text-destructive border-destructive/20' },
  pendiente_activacion: { label: 'Pendiente',  cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
} as Record<string, { label: string; cls: string }>

function SuscBadge({ estado }: { estado: string }) {
  const { label, cls } = SUSC_CONFIG[estado] ?? { label: estado, cls: 'bg-secondary text-muted-foreground border-border' }
  return <Badge variant="outline" className={cls}>{label}</Badge>
}

// ── Página ────────────────────────────────────────────────

export function ConductoresPage() {
  const {
    conductores, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarConductores, cambiarPagina,
    crearConductor, actualizarConductor,
    toggleEstadoUsuario, registrarPago,
    limpiarError,
  } = useConductoresStore()
  const { usuario } = useAuthStore()

  const [busqueda, setBusqueda]                   = useState('')
  const [filtroEstado, setFiltroEstado]           = useState('todos')
  const [filtroSusc, setFiltroSusc]               = useState('todas')
  const [modalAbierto, setModalAbierto]           = useState(false)
  const [modalPagoAbierto, setModalPagoAbierto]   = useState(false)
  const [conductorEditando, setConductorEditando] = useState<Conductor | null>(null)
  const [conductorPago, setConductorPago]         = useState<Conductor | null>(null)
  const [conductorDetalle, setConductorDetalle]   = useState<Conductor | null>(null)

  // ── carga inicial ─────────────────────────────────────
  useEffect(() => { cargarConductores() }, [])

  // ── recargar al cambiar filtros (server-side) ─────────
  useEffect(() => {
    cargarConductores(
      { estado: filtroEstado, suscripcion: filtroSusc },
      1,
    )
  }, [filtroEstado, filtroSusc])

  // ── filtro local por búsqueda de texto ────────────────
  const filtrados = conductores.filter(c => {
    const q = busqueda.toLowerCase()
    const nombre   = c.usuario?.nombre?.toLowerCase() ?? ''
    const licencia = c.numero_licencia.toLowerCase()
    return nombre.includes(q) || licencia.includes(q)
  })

  // ── handlers ─────────────────────────────────────────
  const handleSeleccionar = (c: Conductor) =>
    setConductorDetalle(conductorDetalle?.id === c.id ? null : c)

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} conductor${totalRegistros !== 1 ? 'es' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin conductores registrados'

  return (
    <>
      <TablaPage
        titulo="Conductores"
        subtitulo={subtitulo}
        labelBoton="Nuevo conductor"
        placeholder="Buscar por nombre o licencia..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        filtroExtra={
          <Select value={filtroSusc} onValueChange={setFiltroSusc}>
            <SelectTrigger className="h-9 w-52">
              <SelectValue placeholder="Suscripción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las suscripciones</SelectItem>
              <SelectItem value="activo">Activa</SelectItem>
              <SelectItem value="por_vencer">Por vencer</SelectItem>
              <SelectItem value="suspendido">Suspendida</SelectItem>
              <SelectItem value="pendiente_activacion">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        }
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={() => cargarConductores(
          { estado: filtroEstado, suscripcion: filtroSusc },
          paginaActual,
        )}
        onCrear={() => { setConductorEditando(null); setModalAbierto(true) }}
        panelDetalle={conductorDetalle && (
          <PanelDetalle
            titulo="Perfil conductor"
            nombre={conductorDetalle.usuario?.nombre ?? '—'}
            subtitulo={conductorDetalle.agencia?.nombre}
            badge={
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <EstadoBadge estado={conductorDetalle.usuario?.estado ?? 'activo'} />
                <SuscBadge estado={conductorDetalle.estado_suscripcion} />
              </div>
            }
            icono={<UserCog className="w-7 h-7 text-primary" />}
            stats={[
              { valor: conductorDetalle.categoria_licencia, label: 'Categoría' },
              { valor: conductorDetalle.vehiculo?.placa ?? '—', label: 'Vehículo' },
            ]}
            campos={[
              { label: 'Teléfono',    valor: conductorDetalle.usuario?.telefono ?? '—' },
              { label: 'Licencia',    valor: conductorDetalle.numero_licencia },
              { label: 'Vence lic.', valor: new Date(conductorDetalle.fecha_vencimiento_licencia).toLocaleDateString('es-CO') },
              { label: 'Nequi',      valor: conductorDetalle.numero_nequi ?? 'No registrado' },
              { label: 'Agencia',    valor: conductorDetalle.agencia?.nombre ?? '—' },
              { label: 'Suscripción vence', valor: conductorDetalle.fecha_corte ? new Date(conductorDetalle.fecha_corte).toLocaleDateString('es-CO') : '—' },
            ]}
            onCerrar={() => setConductorDetalle(null)}
            onEditar={() => {
              setConductorEditando(conductorDetalle)
              setModalAbierto(true)
              setConductorDetalle(null)
            }}
            labelEditar="Editar conductor"
          />
        )}
      >
        {filtrados.length === 0 ? (
          <TablaVacia
            cargando={cargando}
            hayDatos={conductores.length > 0}
            hayBusqueda={!!busqueda}
            icono={<User className="w-6 h-6" />}
            labelVacio="Sin conductores"
            labelCrear="Nuevo conductor"
            onCrear={() => { setConductorEditando(null); setModalAbierto(true) }}
          />
        ) : (
          <>
            {/* Móvil — cards con scroll */}
            <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
              {filtrados.map(conductor => (
                <ConductorCard
                  key={conductor.id}
                  conductor={conductor}
                  esSeleccionado={conductorDetalle?.id === conductor.id}
                  onSeleccionar={() => handleSeleccionar(conductor)}
                  onEditar={() => { setConductorEditando(conductor); setModalAbierto(true) }}
                  onPago={() => { setConductorPago(conductor); setModalPagoAbierto(true) }}
                  onToggleEstado={() => toggleEstadoUsuario(conductor.usuario_id, conductor.usuario?.estado ?? 'activo')}
                />
              ))}
            </div>

            {/* Desktop — tabla con scroll */}
            <div className="hidden md:block">
              <TablaConductores
                conductores={filtrados}
                conductorDetalle={conductorDetalle}
                onSeleccionar={handleSeleccionar}
                onEditar={(c) => { setConductorEditando(c); setModalAbierto(true) }}
                onPago={(c) => { setConductorPago(c); setModalPagoAbierto(true) }}
                onToggleEstado={(c) => toggleEstadoUsuario(c.usuario_id, c.usuario?.estado ?? 'activo')}
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

      {/* Modal conductor */}
      {modalAbierto && (
        <ModalConductor
          conductor={conductorEditando}
          onGuardar={datos => crearConductor(datos)}
          onActualizar={datos => {
            if (!conductorEditando) return Promise.resolve(false)
            return actualizarConductor(conductorEditando.id, datos)
          }}
          onCerrar={() => { setModalAbierto(false); setConductorEditando(null) }}
          cargando={cargando}
        />
      )}

      {/* Modal pago */}
      {modalPagoAbierto && conductorPago && (
        <ModalPago
          conductor={conductorPago}
          onGuardar={datos => registrarPago(datos, usuario?.id ?? '')}
          onCerrar={() => { setModalPagoAbierto(false); setConductorPago(null) }}
          cargando={cargando}
        />
      )}
    </>
  )
}