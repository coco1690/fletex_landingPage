import { useEffect, useState } from 'react'
import { Percent, MapPin, Pencil, ToggleLeft } from 'lucide-react'
import { useComisionesStore, type Comision } from './comisionesStore'
import { useAuthStore } from '@/store/authStore'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { Paginacion } from '@/components/shared/Paginacion'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { ModalComision } from './ModalComision'
import { POR_PAGINA } from './comisionesStore'

function TipoServicioBadge({ tipo }: { tipo: string }) {
  const esEncomienda = tipo === 'encomienda'
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
      esEncomienda
        ? 'bg-warning/10 text-warning border-warning/20'
        : 'bg-info/10 text-info border-info/20'
    }`}>
      {esEncomienda ? 'Encomienda' : 'Pasajero'}
    </span>
  )
}

export function ComisionesPage() {
  const {
    comisiones, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarComisiones, cambiarPagina,
    actualizarComision, toggleEstado, limpiarError,
  } = useComisionesStore()

  const { usuario } = useAuthStore()

  const [busqueda, setBusqueda] = useState('')
  const [comisionDetalle, setComisionDetalle] = useState<Comision | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [comisionEditando, setComisionEditando] = useState<Comision | null>(null)

  useEffect(() => { cargarComisiones() }, [])

  const filtrados = comisiones.filter(c => {
    const q = busqueda.toLowerCase()
    return (
      c.tipo_servicio.toLowerCase().includes(q) ||
      (c.region?.nombre?.toLowerCase().includes(q) ?? false)
    )
  })

  const handleSeleccionar = (c: Comision) =>
    setComisionDetalle(comisionDetalle?.id === c.id ? null : c)

  const handleEditar = (c: Comision) => {
    setComisionEditando(c)
    setModalAbierto(true)
    setComisionDetalle(null)
  }

  const handleCrear = () => {
    setComisionEditando(null)
    setModalAbierto(true)
  }

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} configuración${totalRegistros !== 1 ? 'es' : ''}`
    : 'Sin configuraciones de comisión'

  return (
    <>
      <TablaPage
        titulo="Comisiones"
        subtitulo={subtitulo}
        labelBoton="Nueva comisión"
        placeholder="Buscar por tipo de servicio o región..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={() => cargarComisiones(paginaActual)}
        onCrear={handleCrear}
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
        panelDetalle={comisionDetalle && (
          <PanelDetalle
            titulo="Detalle comisión"
            nombre={`${comisionDetalle.porcentaje}%`}
            subtitulo={comisionDetalle.tipo_servicio === 'encomienda' ? 'Encomienda' : 'Pasajero'}
            badge={
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                comisionDetalle.activo
                  ? 'bg-success/10 text-success border-success/20'
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              }`}>
                {comisionDetalle.activo ? 'Activo' : 'Inactivo'}
              </span>
            }
            icono={<Percent className="w-7 h-7 text-primary" />}
            campos={[
              { label: 'Tipo servicio', valor: comisionDetalle.tipo_servicio === 'encomienda' ? 'Encomienda' : 'Pasajero' },
              { label: 'Porcentaje', valor: `${comisionDetalle.porcentaje}%` },
              { label: 'Región', valor: comisionDetalle.region?.nombre ?? 'Global (todas)' },
              { label: 'Última modificación', valor: new Date(comisionDetalle.fecha_modificacion).toLocaleString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                }) },
            ]}
            onCerrar={() => setComisionDetalle(null)}
            onEditar={() => handleEditar(comisionDetalle)}
            labelEditar="Editar comisión"
          />
        )}
      >
        {filtrados.length === 0 ? (
          <TablaVacia
            cargando={cargando}
            hayDatos={comisiones.length > 0}
            hayBusqueda={!!busqueda}
            icono={<Percent className="w-6 h-6" />}
            labelVacio="Sin comisiones configuradas"
            labelCrear="Nueva comisión"
            onCrear={handleCrear}
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
                    comisionDetalle?.id === c.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-black text-primary">{c.porcentaje}%</span>
                    <TipoServicioBadge tipo={c.tipo_servicio} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {c.region?.nombre ?? 'Global'}
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop — tabla */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="text-left py-3 px-4 font-semibold">Tipo servicio</th>
                    <th className="text-right py-3 px-4 font-semibold">Porcentaje</th>
                    <th className="text-left py-3 px-4 font-semibold">Región</th>
                    <th className="text-left py-3 px-4 font-semibold">Última modificación</th>
                    <th className="text-left py-3 px-4 font-semibold">Estado</th>
                    <th className="text-right py-3 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtrados.map(c => (
                    <tr
                      key={c.id}
                      onClick={() => handleSeleccionar(c)}
                      className={`cursor-pointer transition-colors ${
                        comisionDetalle?.id === c.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <TipoServicioBadge tipo={c.tipo_servicio} />
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-lg text-primary">{c.porcentaje}%</td>
                      <td className="py-3 px-4 text-muted-foreground">{c.region?.nombre ?? 'Global'}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(c.fecha_modificacion).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          c.activo
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-destructive/10 text-destructive border-destructive/20'
                        }`}>
                          {c.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <MenuAcciones
                          items={[
                            {
                              label: 'Editar',
                              icon: <Pencil className="w-3.5 h-3.5" />,
                              fn: () => handleEditar(c),
                            },
                            {
                              label: c.activo ? 'Desactivar' : 'Activar',
                              icon: <ToggleLeft className="w-3.5 h-3.5" />,
                              fn: () => toggleEstado(c.id, c.activo),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </TablaPage>

      {/* Modal crear/editar comisión */}
      {modalAbierto && (
        <ModalComision
          comision={comisionEditando}
          onGuardar={actualizarComision}
          onCerrar={() => { setModalAbierto(false); setComisionEditando(null) }}
          cargando={cargando}
          usuarioId={usuario?.id ?? ''}
        />
      )}
    </>
  )
}
