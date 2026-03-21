import { useEffect, useState } from 'react'
import { MapPin, Building2, Users, Pencil, PowerOff, Power, UserCog } from 'lucide-react'
import { useRegionesStore, type Region } from './regionesStore'
import { ModalRegion } from './ModalRegion'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { EstadoBadge } from '@/components/shared/EstadoBadge'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { cn } from '@/lib/utils'

export function RegionesPage() {
  const { regiones, cargando, error, cargarRegiones, crearRegion, actualizarRegion, toggleEstado, limpiarError } = useRegionesStore()
  const [busqueda, setBusqueda]               = useState('')
  const [filtroEstado, setFiltroEstado]       = useState('todos')
  const [modalAbierto, setModalAbierto]       = useState(false)
  const [regionEditando, setRegionEditando]   = useState<Region | null>(null)
  const [regionDetalle, setRegionDetalle]     = useState<Region | null>(null)

  useEffect(() => { cargarRegiones() }, [])

  const filtradas = regiones.filter(r => {
    const matchQ = r.nombre.toLowerCase().includes(busqueda.toLowerCase()) || r.codigo.toLowerCase().includes(busqueda.toLowerCase())
    const matchE = filtroEstado === 'todos' || r.estado === filtroEstado
    return matchQ && matchE
  })

  const handleGuardar = async (datos: { nombre: string; codigo: string; pais: string }) =>
    regionEditando ? actualizarRegion(regionEditando.id, datos) : crearRegion(datos)

  return (
    <>
      <TablaPage
        titulo="Regiones"
        subtitulo={`${regiones.length} región${regiones.length !== 1 ? 'es' : ''} registrada${regiones.length !== 1 ? 's' : ''}`}
        labelBoton="Nueva región"
        placeholder="Buscar región..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={cargarRegiones}
        onCrear={() => { setRegionEditando(null); setModalAbierto(true) }}
        panelDetalle={regionDetalle && (
          <PanelDetalle
            titulo="Detalle región"
            nombre={regionDetalle.nombre}
            subtitulo={regionDetalle.pais}
            badge={<EstadoBadge estado={regionDetalle.estado} />}
            icono={<MapPin className="w-7 h-7 text-primary" />}
            stats={[
              { valor: regionDetalle._count?.agencias ?? 0,   label: 'Agencias' },
              { valor: regionDetalle._count?.conductores ?? 0, label: 'Conductores' },
            ]}
            campos={[
              { label: 'Código',        valor: regionDetalle.codigo },
              { label: 'País',          valor: regionDetalle.pais },
              { label: 'Admin asignado',valor: regionDetalle.admin?.nombre ?? 'Sin asignar' },
              { label: 'Creado',        valor: new Date(regionDetalle.fecha_creacion).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) },
            ]}
            onCerrar={() => setRegionDetalle(null)}
            onEditar={() => { setRegionEditando(regionDetalle); setModalAbierto(true); setRegionDetalle(null) }}
            labelEditar="Editar región"
          />
        )}
      >
        {filtradas.length === 0 ? (
          <TablaVacia
            cargando={cargando}
            hayDatos={regiones.length > 0}
            hayBusqueda={!!busqueda}
            icono={<MapPin className="w-6 h-6" />}
            labelVacio="Sin regiones"
            labelCrear="Nueva región"
            onCrear={() => { setRegionEditando(null); setModalAbierto(true) }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Región', 'Código', 'País', 'Admin', 'Agencias', 'Conductores', 'Estado', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4 py-3 first:pl-5 last:pr-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtradas.map(region => (
                  <tr
                    key={region.id}
                    onClick={() => setRegionDetalle(regionDetalle?.id === region.id ? null : region)}
                    className={cn(
                      'hover:bg-secondary/30 transition-colors cursor-pointer',
                      regionDetalle?.id === region.id && 'bg-primary/5 border-l-2 border-l-primary'
                    )}
                  >
                    <td className="px-4 py-3 pl-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{region.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-secondary px-2 py-1 rounded-lg text-foreground">{region.codigo}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{region.pais}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <UserCog className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{region.admin?.nombre ?? 'Sin asignar'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{region._count?.agencias ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{region._count?.conductores ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={region.estado} />
                    </td>
                    <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                      <MenuAcciones items={[
                        { icon: <Pencil className="w-3.5 h-3.5" />,    label: 'Editar',    fn: () => { setRegionEditando(region); setModalAbierto(true) } },
                        { icon: <Building2 className="w-3.5 h-3.5" />, label: 'Ver agencias',    fn: () => {} },
                        { icon: <Users className="w-3.5 h-3.5" />,     label: 'Ver conductores', fn: () => {} },
                        {
                          icon: region.estado === 'activo' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />,
                          label: region.estado === 'activo' ? 'Desactivar' : 'Activar',
                          fn: () => toggleEstado(region.id, region.estado),
                          danger: region.estado === 'activo',
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
        <ModalRegion
          region={regionEditando}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setRegionEditando(null) }}
          cargando={cargando}
        />
      )}
    </>
  )
}