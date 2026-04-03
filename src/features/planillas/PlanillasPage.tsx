import { useEffect, useState } from 'react'
import { FileText, Users, Package as PackageIcon } from 'lucide-react'
import { usePlanillasStore, type Planilla } from './planillasStore'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { Paginacion } from '@/components/shared/Paginacion'
import { EstadoPlanillaBadge } from './components/EstadoPlanillaBadge'
import { POR_PAGINA } from './planillasStore'

export function PlanillasPage() {
  const {
    planillas, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarPlanillas, cambiarPagina, limpiarError,
  } = usePlanillasStore()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [planillaDetalle, setPlanillaDetalle] = useState<Planilla | null>(null)

  useEffect(() => { cargarPlanillas() }, [])

  useEffect(() => {
    cargarPlanillas({
      estado: filtroEstado !== 'todos' ? filtroEstado : undefined,
    }, 1)
  }, [filtroEstado])

  const filtrados = planillas.filter(p => {
    const q = busqueda.toLowerCase()
    return (
      p.conductor_nombre.toLowerCase().includes(q) ||
      p.ruta_nombre.toLowerCase().includes(q) ||
      p.vehiculo_placa.toLowerCase().includes(q) ||
      p.agencia_origen.toLowerCase().includes(q) ||
      p.agencia_destino.toLowerCase().includes(q)
    )
  })

  const handleSeleccionar = (p: Planilla) =>
    setPlanillaDetalle(planillaDetalle?.id === p.id ? null : p)

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} planilla${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin planillas generadas'

  return (
    <TablaPage
      titulo="Planillas"
      subtitulo={subtitulo}
      placeholder="Buscar por conductor, ruta, placa o agencia..."
      busqueda={busqueda}
      onBusqueda={setBusqueda}
      filtroEstado={filtroEstado}
      onFiltroEstado={setFiltroEstado}
      filtrosEstado={[
        { valor: 'todos',      label: 'Todas' },
        { valor: 'generada',   label: 'Generada' },
        { valor: 'completada', label: 'Completada' },
        { valor: 'anulada',    label: 'Anulada' },
      ]}
      cargando={cargando}
      error={error}
      onLimpiarError={limpiarError}
      onRefresh={() => cargarPlanillas({
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
      panelDetalle={planillaDetalle && (
        <PanelDetalle
          titulo="Detalle planilla"
          nombre={planillaDetalle.conductor_nombre}
          subtitulo={planillaDetalle.ruta_nombre}
          badge={<EstadoPlanillaBadge estado={planillaDetalle.estado} />}
          icono={<FileText className="w-7 h-7 text-primary" />}
          stats={[
            { valor: planillaDetalle.total_pasajeros, label: 'Pasajeros' },
            { valor: planillaDetalle.total_encomiendas, label: 'Encomiendas' },
            { valor: planillaDetalle.total_no_show, label: 'No show' },
          ]}
          campos={[
            { label: 'Origen', valor: planillaDetalle.agencia_origen },
            { label: 'Destino', valor: planillaDetalle.agencia_destino },
            { label: 'Vehículo', valor: `${planillaDetalle.vehiculo_placa} (${planillaDetalle.vehiculo_tipo})` },
            { label: 'Licencia', valor: `${planillaDetalle.conductor_licencia} - ${planillaDetalle.conductor_categoria_licencia}` },
            { label: 'Hora salida', valor: new Date(planillaDetalle.hora_salida).toLocaleString('es-CO', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              }) },
            { label: 'Hora llegada', valor: planillaDetalle.hora_llegada
              ? new Date(planillaDetalle.hora_llegada).toLocaleString('es-CO', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })
              : 'Pendiente' },
            { label: 'Generación', valor: new Date(planillaDetalle.fecha_generacion).toLocaleString('es-CO', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              }) },
            ...(planillaDetalle.novedad ? [{
              label: 'Novedad', valor: planillaDetalle.novedad,
            }] : []),
          ]}
          onCerrar={() => setPlanillaDetalle(null)}
        />
      )}
    >
      {filtrados.length === 0 ? (
        <TablaVacia
          cargando={cargando}
          hayDatos={planillas.length > 0}
          hayBusqueda={!!busqueda}
          icono={<FileText className="w-6 h-6" />}
          labelVacio="Sin planillas"
          labelCrear="Sin planillas"
          onCrear={() => {}}
        />
      ) : (
        <>
          {/* Móvil — cards */}
          <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
            {filtrados.map(p => (
              <button
                key={p.id}
                onClick={() => handleSeleccionar(p)}
                className={`w-full text-left p-4 transition-colors ${
                  planillaDetalle?.id === p.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">{p.conductor_nombre}</span>
                  <EstadoPlanillaBadge estado={p.estado} />
                </div>
                <p className="text-xs text-muted-foreground">{p.ruta_nombre}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {p.total_pasajeros}
                  </span>
                  <span className="flex items-center gap-1">
                    <PackageIcon className="w-3 h-3" />
                    {p.total_encomiendas}
                  </span>
                  <span>{p.vehiculo_placa}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Desktop — tabla */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left py-3 px-4 font-semibold">Conductor</th>
                  <th className="text-left py-3 px-4 font-semibold">Ruta</th>
                  <th className="text-left py-3 px-4 font-semibold">Vehículo</th>
                  <th className="text-center py-3 px-4 font-semibold">Pasajeros</th>
                  <th className="text-center py-3 px-4 font-semibold">Encomiendas</th>
                  <th className="text-left py-3 px-4 font-semibold">Salida</th>
                  <th className="text-left py-3 px-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtrados.map(p => (
                  <tr
                    key={p.id}
                    onClick={() => handleSeleccionar(p)}
                    className={`cursor-pointer transition-colors ${
                      planillaDetalle?.id === p.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{p.conductor_nombre}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.ruta_nombre}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.vehiculo_placa}</td>
                    <td className="py-3 px-4 text-center">{p.total_pasajeros}</td>
                    <td className="py-3 px-4 text-center">{p.total_encomiendas}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(p.hora_salida).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3 px-4">
                      <EstadoPlanillaBadge estado={p.estado} />
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
