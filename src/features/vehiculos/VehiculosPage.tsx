import { useEffect, useState } from 'react'
import {
  Truck, Car, Users, Weight,
  Building2, Pencil, Wrench,
  PowerOff, Power, UserCog,
} from 'lucide-react'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  useVehiculosStore, TIPO_LABELS,type Vehiculo,
} from './vehiculosStore'
import { ModalVehiculo }          from './ModalVehiculo'
import { ModalAsignarConductor }  from './ModalAsignarConductor'
import { MenuAcciones }           from '@/components/shared/MenuAcciones'
import { PanelDetalle }           from '@/components/shared/PanelDetalle'
import { TablaPage }              from '@/components/shared/TablaPage'
import { TablaVacia }             from '@/components/shared/TablaVacia'
import { cn }                     from '@/lib/utils'
import type { Database }          from '@/supabase/types'

type EstadoVehiculo = Database['public']['Enums']['estado_vehiculo']
type TipoVehiculo   = Database['public']['Enums']['tipo_vehiculo']

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
    cargarVehiculos, crearVehiculo,
    actualizarVehiculo, cambiarEstado,
    asignarConductor, limpiarError,
  } = useVehiculosStore()

  const [busqueda, setBusqueda]                     = useState('')
  const [filtroEstado, setFiltroEstado]             = useState('todos')
  const [filtroTipo, setFiltroTipo]                 = useState('todos')
  const [filtroAgencia, setFiltroAgencia]           = useState('todas')
  const [modalAbierto, setModalAbierto]             = useState(false)
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false)
  const [vehiculoEditando, setVehiculoEditando]     = useState<Vehiculo | null>(null)
  const [vehiculoDetalle, setVehiculoDetalle]       = useState<Vehiculo | null>(null)
  const [vehiculoAsignando, setVehiculoAsignando]   = useState<Vehiculo | null>(null)

  useEffect(() => { cargarVehiculos() }, [])

  const agenciasUnicas = Array.from(
    new Map(
      vehiculos
        .filter(v => (v as any).agencia)
        .map(v => [(v as any).agencia.nombre, (v as any).agencia])
    ).values()
  )

  const filtrados = vehiculos.filter(v => {
    const matchQ = v.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
      (v.marca ?? '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (v.modelo ?? '').toLowerCase().includes(busqueda.toLowerCase())
    const matchE = filtroEstado === 'todos'  || v.estado === filtroEstado
    const matchT = filtroTipo   === 'todos'  || v.tipo   === filtroTipo
    const matchA = filtroAgencia === 'todas' || (v as any).agencia?.nombre === filtroAgencia
    return matchQ && matchE && matchT && matchA
  })

  const handleGuardar = async (datos: any) => {
    const payload = {
      ...datos,
      anio:                datos.anio ? parseInt(datos.anio) : null,
      capacidad_pasajeros: parseInt(datos.capacidad_pasajeros),
      capacidad_carga_kg:  datos.capacidad_carga_kg ? parseFloat(datos.capacidad_carga_kg) : null,
    }
    if (vehiculoEditando) return actualizarVehiculo(vehiculoEditando.id, payload)
    return crearVehiculo(payload)
  }

  return (
    <>
      <TablaPage
        titulo="Vehículos"
        subtitulo={`${vehiculos.length} vehículo${vehiculos.length !== 1 ? 's' : ''} registrado${vehiculos.length !== 1 ? 's' : ''}`}
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
          <div className="flex items-center gap-2">
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

            {agenciasUnicas.length > 1 && (
              <Select value={filtroAgencia} onValueChange={setFiltroAgencia}>
                <SelectTrigger className="h-9 w-48">
                  <SelectValue placeholder="Agencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las agencias</SelectItem>
                  {agenciasUnicas.map(a => (
                    <SelectItem key={a.nombre} value={a.nombre}>{a.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        }
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={cargarVehiculos}
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
              { label: 'Tipo',      valor: TIPO_LABELS[vehiculoDetalle.tipo] },
              { label: 'Marca',     valor: vehiculoDetalle.marca ?? '—' },
              { label: 'Modelo',    valor: vehiculoDetalle.modelo ?? '—' },
              { label: 'Año',       valor: vehiculoDetalle.anio?.toString() ?? '—' },
              { label: 'Agencia',   valor: (vehiculoDetalle as any).agencia?.nombre ?? '—' },
              {
                label: 'Conductor',
                valor: (vehiculoDetalle as any).conductor?.usuario?.nombre ?? 'Sin asignar',
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Vehículo', 'Tipo', 'Agencia', 'Conductor', 'Capacidad', 'Estado', ''].map(h => (
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
                {filtrados.map(vehiculo => {
                  const esSeleccionado = vehiculoDetalle?.id === vehiculo.id
                  const conductor      = (vehiculo as any).conductor?.usuario

                  return (
                    <tr
                      key={vehiculo.id}
                      onClick={() => setVehiculoDetalle(esSeleccionado ? null : vehiculo)}
                      className={cn(
                        'hover:bg-secondary/30 transition-colors cursor-pointer',
                        esSeleccionado && 'bg-primary/5 border-l-2 border-l-primary'
                      )}
                    >
                      {/* Vehículo */}
                      <td className="px-4 py-3 pl-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Car className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-foreground font-mono">
                              {vehiculo.placa}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {[vehiculo.marca, vehiculo.modelo, vehiculo.anio && `· ${vehiculo.anio}`]
                                .filter(Boolean).join(' ')}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tipo */}
                      <td className="px-4 py-3">
                        <span className="text-xs bg-secondary px-2 py-1 rounded-lg text-foreground">
                          {TIPO_LABELS[vehiculo.tipo]}
                        </span>
                      </td>

                      {/* Agencia */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {(vehiculo as any).agencia?.nombre ?? '—'}
                          </span>
                        </div>
                      </td>

                      {/* Conductor */}
                      <td className="px-4 py-3">
                        {conductor ? (
                          <div className="flex items-center gap-1.5">
                            <UserCog className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs text-foreground font-medium">
                              {conductor.nombre}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">Sin conductor</span>
                        )}
                      </td>

                      {/* Capacidad */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-bold text-foreground">
                              {vehiculo.capacidad_pasajeros}
                            </span>
                          </div>
                          {vehiculo.capacidad_carga_kg && (
                            <div className="flex items-center gap-1">
                              <Weight className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {vehiculo.capacidad_carga_kg}kg
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        <EstadoVehBadge estado={vehiculo.estado} />
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                        <MenuAcciones items={[
                          {
                            icon: <Pencil className="w-3.5 h-3.5" />,
                            label: 'Editar',
                            fn: () => { setVehiculoEditando(vehiculo); setModalAbierto(true) },
                          },
                          {
                            icon: <UserCog className="w-3.5 h-3.5" />,
                            label: 'Asignar conductor',
                            fn: () => { setVehiculoAsignando(vehiculo); setModalAsignarAbierto(true) },
                            separadorAntes: true,
                          },
                          {
                            icon: <Wrench className="w-3.5 h-3.5" />,
                            label: vehiculo.estado === 'mantenimiento'
                              ? 'Quitar mantenimiento'
                              : 'En mantenimiento',
                            fn: () => cambiarEstado(
                              vehiculo.id,
                              vehiculo.estado === 'mantenimiento' ? 'activo' : 'mantenimiento'
                            ),
                            separadorAntes: true,
                          },
                          {
                            icon: vehiculo.estado === 'activo'
                              ? <PowerOff className="w-3.5 h-3.5" />
                              : <Power className="w-3.5 h-3.5" />,
                            label: vehiculo.estado === 'inactivo' ? 'Activar' : 'Desactivar',
                            fn: () => cambiarEstado(
                              vehiculo.id,
                              vehiculo.estado === 'inactivo' ? 'activo' : 'inactivo'
                            ),
                            danger: vehiculo.estado !== 'inactivo',
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