import { useEffect, useState } from 'react'
import { Bike, MapPin, Phone, User } from 'lucide-react'
import { useCarrerasStore, type Carrera } from './carrerasStore'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { Paginacion } from '@/components/shared/Paginacion'
import { EstadoCarreraBadge } from './components/EstadoCarreraBadge'
import { POR_PAGINA } from './carrerasStore'

export function CarrerasPage() {
  const {
    carreras, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarCarreras, cambiarPagina, limpiarError,
  } = useCarrerasStore()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [carreraDetalle, setCarreraDetalle] = useState<Carrera | null>(null)

  useEffect(() => { cargarCarreras() }, [])

  useEffect(() => {
    cargarCarreras({
      estado: filtroEstado !== 'todos' ? filtroEstado : undefined,
    }, 1)
  }, [filtroEstado])

  const filtrados = carreras.filter(c => {
    const q = busqueda.toLowerCase()
    return (
      c.pasajero_nombre.toLowerCase().includes(q) ||
      c.direccion_recogida.toLowerCase().includes(q) ||
      (c.direccion_destino?.toLowerCase().includes(q) ?? false) ||
      c.pasajero_telefono.toLowerCase().includes(q)
    )
  })

  const handleSeleccionar = (c: Carrera) =>
    setCarreraDetalle(carreraDetalle?.id === c.id ? null : c)

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} carrera${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin carreras registradas'

  return (
    <TablaPage
      titulo="Carreras"
      subtitulo={subtitulo}
      placeholder="Buscar por pasajero, dirección o teléfono..."
      busqueda={busqueda}
      onBusqueda={setBusqueda}
      filtroEstado={filtroEstado}
      onFiltroEstado={setFiltroEstado}
      filtrosEstado={[
        { valor: 'todos',      label: 'Todas' },
        { valor: 'pendiente',  label: 'Pendiente' },
        { valor: 'aceptada',   label: 'Aceptada' },
        { valor: 'en_curso',   label: 'En curso' },
        { valor: 'completada', label: 'Completada' },
        { valor: 'cancelada',  label: 'Cancelada' },
      ]}
      cargando={cargando}
      error={error}
      onLimpiarError={limpiarError}
      onRefresh={() => cargarCarreras({
        estado: filtroEstado !== 'todos' ? filtroEstado : undefined,
      }, paginaActual)}
      paginacion={
        totalPaginas > 1 ? (
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            totalRegistros={totalRegistros}
            porPagina={POR_PAGINA}
            onCambiar={cambiarPagina}
            cargando={cargando}
          />
        ) : undefined
      }
      panelDetalle={carreraDetalle && (
        <PanelDetalle
          titulo="Detalle carrera"
          nombre={carreraDetalle.pasajero_nombre}
          subtitulo={carreraDetalle.pasajero_telefono}
          badge={<EstadoCarreraBadge estado={carreraDetalle.estado} />}
          icono={<Bike className="w-7 h-7 text-primary" />}
          campos={[
            { label: 'ID', valor: carreraDetalle.id.slice(0, 8) },
            { label: 'Recogida', valor: carreraDetalle.direccion_recogida },
            { label: 'Destino', valor: carreraDetalle.direccion_destino ?? '—' },
            { label: 'Conductor', valor: carreraDetalle.conductor?.usuario?.nombre ?? 'Sin asignar' },
            { label: 'Agencia', valor: carreraDetalle.agencia?.nombre ?? '—' },
            { label: 'Código', valor: carreraDetalle.codigo_confirmacion ?? '—' },
            { label: 'Solicitud', valor: carreraDetalle.fecha_solicitud
              ? new Date(carreraDetalle.fecha_solicitud).toLocaleString('es-CO', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })
              : '—' },
            { label: 'Aceptación', valor: carreraDetalle.fecha_aceptacion
              ? new Date(carreraDetalle.fecha_aceptacion).toLocaleString('es-CO', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })
              : '—' },
            { label: 'Finalización', valor: carreraDetalle.fecha_fin
              ? new Date(carreraDetalle.fecha_fin).toLocaleString('es-CO', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })
              : '—' },
          ]}
          onCerrar={() => setCarreraDetalle(null)}
        />
      )}
    >
      {filtrados.length === 0 ? (
        <TablaVacia
          cargando={cargando}
          hayDatos={carreras.length > 0}
          hayBusqueda={!!busqueda}
          icono={<Bike className="w-6 h-6" />}
          labelVacio="Sin carreras"
          labelCrear="Sin carreras"
          onCrear={() => {}}
        />
      ) : (
        <>
          {/* Móvil — cards */}
          <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
            {filtrados.map(c => (
              <button
                key={c.id}
                onClick={() => handleSeleccionar(c)}
                className={`w-full text-left p-4 transition-colors ${
                  carreraDetalle?.id === c.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">{c.pasajero_nombre}</span>
                  <EstadoCarreraBadge estado={c.estado} />
                </div>
                <p className="text-[10px] font-mono text-muted-foreground mb-1">{c.id.slice(0, 8)}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {c.direccion_recogida}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Phone className="w-3 h-3" />
                  {c.pasajero_telefono}
                </div>
              </button>
            ))}
          </div>

          {/* Desktop — tabla */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left py-3 px-4 pl-5 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Pasajero</th>
                  <th className="text-left py-3 px-4 font-semibold">Recogida</th>
                  <th className="text-left py-3 px-4 font-semibold">Destino</th>
                  <th className="text-left py-3 px-4 font-semibold">Conductor</th>
                  <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtrados.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => handleSeleccionar(c)}
                    className={`cursor-pointer transition-colors ${
                      carreraDetalle?.id === c.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                    }`}
                  >
                    <td className="px-4 py-3 pl-5">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {c.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{c.pasajero_nombre}</p>
                          <p className="text-[10px] text-muted-foreground">{c.pasajero_telefono}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate">{c.direccion_recogida}</td>
                    <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate">{c.direccion_destino ?? '—'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{c.conductor?.usuario?.nombre ?? 'Sin asignar'}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {c.fecha_solicitud
                        ? new Date(c.fecha_solicitud).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
                        : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <EstadoCarreraBadge estado={c.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </TablaPage>
  )
}
