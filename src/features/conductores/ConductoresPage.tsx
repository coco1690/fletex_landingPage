import { useEffect, useState } from 'react'
import {
  User, Building2, Car, Pencil,
  PowerOff, Power, DollarSign, UserCog,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useConductoresStore, type Conductor } from './conductoresStore'
import { useAuthStore } from '@/store/authStore'
import { ModalConductor } from './ModalConductor'
import { ModalPago } from './ModalPago'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { EstadoBadge } from '@/components/shared/EstadoBadge'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { cn } from '@/lib/utils'

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
    cargarConductores, crearConductor,
    actualizarConductor, toggleEstadoUsuario,
    registrarPago, limpiarError,
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

  useEffect(() => { cargarConductores() }, [])

  const filtrados = conductores.filter(c => {
    const nombre   = c.usuario?.nombre?.toLowerCase() ?? ''
    const licencia = c.numero_licencia.toLowerCase()
    const matchQ   = nombre.includes(busqueda.toLowerCase()) || licencia.includes(busqueda.toLowerCase())
    const matchE   = filtroEstado === 'todos' || c.usuario?.estado === filtroEstado
    const matchS   = filtroSusc === 'todas' || c.estado_suscripcion === filtroSusc
    return matchQ && matchE && matchS
  })

  return (
    <>
      <TablaPage
        titulo="Conductores"
        subtitulo={`${conductores.length} conductor${conductores.length !== 1 ? 'es' : ''} registrado${conductores.length !== 1 ? 's' : ''}`}
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
        onRefresh={cargarConductores}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Conductor', 'Licencia', 'Agencia', 'Vehículo', 'Suscripción', 'Estado', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4 py-3 first:pl-5 last:pr-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtrados.map(conductor => {
                  const esSeleccionado = conductorDetalle?.id === conductor.id
                  return (
                    <tr
                      key={conductor.id}
                      onClick={() => setConductorDetalle(esSeleccionado ? null : conductor)}
                      className={cn(
                        'hover:bg-secondary/30 transition-colors cursor-pointer',
                        esSeleccionado && 'bg-primary/5 border-l-2 border-l-primary'
                      )}
                    >
                      {/* Conductor */}
                      <td className="px-4 py-3 pl-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {conductor.usuario?.nombre?.charAt(0).toUpperCase() ?? 'C'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {conductor.usuario?.nombre ?? '—'}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {conductor.usuario?.telefono ?? ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Licencia */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono bg-secondary px-2 py-1 rounded-lg">
                            {conductor.numero_licencia}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {conductor.categoria_licencia}
                          </span>
                        </div>
                      </td>

                      {/* Agencia */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {conductor.agencia?.nombre ?? '—'}
                          </span>
                        </div>
                      </td>

                      {/* Vehículo */}
                      <td className="px-4 py-3">
                        {conductor.vehiculo ? (
                          <div className="flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs font-semibold text-foreground">
                              {conductor.vehiculo.placa}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">Sin vehículo</span>
                        )}
                      </td>

                      {/* Suscripción */}
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <SuscBadge estado={conductor.estado_suscripcion} />
                          {conductor.fecha_corte && (
                            <p className="text-[10px] text-muted-foreground">
                              Vence {new Date(conductor.fecha_corte).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        <EstadoBadge estado={conductor.usuario?.estado ?? 'activo'} />
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                        <MenuAcciones items={[
                          {
                            icon: <Pencil className="w-3.5 h-3.5" />,
                            label: 'Editar',
                            fn: () => { setConductorEditando(conductor); setModalAbierto(true) },
                          },
                          {
                            icon: <DollarSign className="w-3.5 h-3.5" />,
                            label: 'Registrar pago',
                            fn: () => { setConductorPago(conductor); setModalPagoAbierto(true) },
                            separadorAntes: true,
                          },
                          {
                            icon: conductor.usuario?.estado === 'activo'
                              ? <PowerOff className="w-3.5 h-3.5" />
                              : <Power className="w-3.5 h-3.5" />,
                            label: conductor.usuario?.estado === 'activo' ? 'Desactivar' : 'Activar',
                            fn: () => toggleEstadoUsuario(conductor.usuario_id, conductor.usuario?.estado ?? 'activo'),
                            danger: conductor.usuario?.estado === 'activo',
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