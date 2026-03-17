import { useEffect, useState } from 'react'
import { Building2, Users, Truck, Pencil, PowerOff, Power, MapPin, Phone, UserCog } from 'lucide-react'
import { useAgenciasStore, type Agencia } from './agenciasStore'
import { ModalAgencia } from './ModalAgencia'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { EstadoBadge } from '@/components/shared/EstadoBadge'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { ModalAsignarEncargado } from './ModalAsignarEncargado'
import { cn } from '@/lib/utils'

export function AgenciasPage() {
  const { agencias, cargando, error, cargarAgencias, crearAgencia, actualizarAgencia, toggleEstado, limpiarError } = useAgenciasStore()
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroRegion, setFiltroRegion] = useState('todas')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [agenciaEditando, setAgenciaEditando] = useState<Agencia | null>(null)
  const [agenciaDetalle, setAgenciaDetalle] = useState<Agencia | null>(null)
  const [modalEncargadoAbierto, setModalEncargadoAbierto] = useState(false)
  const [agenciaEncargando, setAgenciaEncargando] = useState<Agencia | null>(null)

  useEffect(() => { cargarAgencias() }, [])

  const regionesUnicas = Array.from(
    new Map(agencias.filter(a => (a as any).region).map(a => [(a as any).region.nombre, (a as any).region])).values()
  )

  const filtradas = agencias.filter(a => {
    const matchQ = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) || a.codigo.toLowerCase().includes(busqueda.toLowerCase())
    const matchE = filtroEstado === 'todos' || a.estado === filtroEstado
    const matchR = filtroRegion === 'todas' || (a as any).region?.nombre === filtroRegion
    return matchQ && matchE && matchR
  })

  const handleGuardar = async (datos: any) =>
    agenciaEditando ? actualizarAgencia(agenciaEditando.id, datos) : crearAgencia(datos)

  return (
    <>
      <TablaPage
        titulo="Agencias"
        subtitulo={`${agencias.length} agencia${agencias.length !== 1 ? 's' : ''} registrada${agencias.length !== 1 ? 's' : ''}`}
        labelBoton="Nueva agencia"
        placeholder="Buscar agencia..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        filtroExtra={regionesUnicas.length > 1 && (
          <select
            value={filtroRegion}
            onChange={e => setFiltroRegion(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="todas">Todas las regiones</option>
            {regionesUnicas.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
          </select>
        )}
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={cargarAgencias}
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
              { label: 'Creada', valor: new Date(agenciaDetalle.fecha_creacion).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) },
            ]}
            onCerrar={() => setAgenciaDetalle(null)}
            onEditar={() => { setAgenciaEditando(agenciaDetalle); setModalAbierto(true); setAgenciaDetalle(null) }}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Agencia', 'Código', 'Región', 'Encargado', 'Conductores', 'Vehículos', 'Contacto', 'Estado', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4 py-3 first:pl-5 last:pr-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtradas.map(agencia => (
                  <tr
                    key={agencia.id}
                    onClick={() => setAgenciaDetalle(agenciaDetalle?.id === agencia.id ? null : agencia)}
                    className={cn(
                      'hover:bg-secondary/30 transition-colors cursor-pointer',
                      agenciaDetalle?.id === agencia.id && 'bg-primary/5 border-l-2 border-l-primary'
                    )}
                  >
                    <td className="px-4 py-3 pl-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-foreground block">{agencia.nombre}</span>
                          {agencia.direccion && <span className="text-[10px] text-muted-foreground">{agencia.direccion}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-secondary px-2 py-1 rounded-lg text-foreground">{agencia.codigo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{(agencia as any).region?.nombre ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{(agencia as any).encargado?.nombre ?? 'Sin asignar'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{agencia._count?.conductores ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{agencia._count?.vehiculos ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {agencia.telefono
                        ? <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">{agencia.telefono}</span></div>
                        : <span className="text-xs text-muted-foreground/50">—</span>
                      }
                    </td>
                    <td className="px-4 py-3"><EstadoBadge estado={agencia.estado} /></td>
                    <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>

                      {/* Menú de acciones para cada agencia */}
                      <MenuAcciones items={[
                        { icon: <Pencil className="w-3.5 h-3.5" />, label: 'Editar', fn: () => { setAgenciaEditando(agencia); setModalAbierto(true) } },

                        {
                          icon: <UserCog className="w-3.5 h-3.5" />,
                          label: 'Asignar encargado',
                          fn: () => { setAgenciaEncargando(agencia); setModalEncargadoAbierto(true) },
                          separadorAntes: true,
                        },

                        {
                          icon: agencia.estado === 'activo' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />,
                          label: agencia.estado === 'activo' ? 'Desactivar' : 'Activar',
                          fn: () => toggleEstado(agencia.id, agencia.estado),
                          danger: agencia.estado === 'activo',
                        },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TablaPage>

      {modalAbierto && (
        <ModalAgencia
          agencia={agenciaEditando}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setAgenciaEditando(null) }}
          cargando={cargando}
        />
      )}
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

