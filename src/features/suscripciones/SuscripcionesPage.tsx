import { useEffect, useState } from 'react'
import { CreditCard, Calendar, Pencil, ToggleLeft } from 'lucide-react'
import { useSuscripcionesStore, type PlanSuscripcion } from './suscripcionesStore'
import { useAuthStore } from '@/store/authStore'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { Paginacion } from '@/components/shared/Paginacion'
import { MenuAcciones } from '@/components/shared/MenuAcciones'
import { ModalSuscripcion } from './ModalSuscripcion'
import { POR_PAGINA } from './suscripcionesStore'

export function SuscripcionesPage() {
  const {
    planes, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarPlanes, cambiarPagina,
    crearPlan, actualizarPlan, toggleEstado,
    limpiarError,
  } = useSuscripcionesStore()

  const { usuario } = useAuthStore()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [planDetalle, setPlanDetalle] = useState<PlanSuscripcion | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [planEditando, setPlanEditando] = useState<PlanSuscripcion | null>(null)

  useEffect(() => { cargarPlanes() }, [])

  const filtrados = planes.filter(p => {
    const q = busqueda.toLowerCase()
    const coincide = p.nombre.toLowerCase().includes(q) ||
      (p.descripcion?.toLowerCase().includes(q) ?? false)
    if (filtroEstado === 'todos') return coincide
    if (filtroEstado === 'activo') return coincide && p.activo
    if (filtroEstado === 'inactivo') return coincide && !p.activo
    return coincide
  })

  const handleSeleccionar = (p: PlanSuscripcion) =>
    setPlanDetalle(planDetalle?.id === p.id ? null : p)

  const handleEditar = (p: PlanSuscripcion) => {
    setPlanEditando(p)
    setModalAbierto(true)
    setPlanDetalle(null)
  }

  const handleCrear = () => {
    setPlanEditando(null)
    setModalAbierto(true)
  }

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} plan${totalRegistros !== 1 ? 'es' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin planes registrados'

  return (
    <>
      <TablaPage
        titulo="Planes de suscripción"
        subtitulo={subtitulo}
        labelBoton="Nuevo plan"
        placeholder="Buscar por nombre o descripción..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        filtrosEstado={[
          { valor: 'todos',    label: 'Todos' },
          { valor: 'activo',   label: 'Activos' },
          { valor: 'inactivo', label: 'Inactivos' },
        ]}
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={() => cargarPlanes(paginaActual)}
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
        panelDetalle={planDetalle && (
          <PanelDetalle
            titulo="Detalle del plan"
            nombre={planDetalle.nombre}
            subtitulo={planDetalle.descripcion ?? 'Sin descripción'}
            badge={
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                planDetalle.activo
                  ? 'bg-success/10 text-success border-success/20'
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              }`}>
                {planDetalle.activo ? 'Activo' : 'Inactivo'}
              </span>
            }
            icono={<CreditCard className="w-7 h-7 text-primary" />}
            stats={[
              { valor: `$${planDetalle.precio.toLocaleString('es-CO')}`, label: 'Precio' },
              { valor: `${planDetalle.duracion_dias}d`, label: 'Duración' },
            ]}
            campos={[
              { label: 'Moneda', valor: planDetalle.moneda },
              { label: 'Incluye planilla', valor: planDetalle.incluye_planilla ? 'Sí' : 'No' },
              { label: 'Creación', valor: new Date(planDetalle.fecha_creacion).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric',
                }) },
            ]}
            onCerrar={() => setPlanDetalle(null)}
            onEditar={() => handleEditar(planDetalle)}
            labelEditar="Editar plan"
          />
        )}
      >
        {filtrados.length === 0 ? (
          <TablaVacia
            cargando={cargando}
            hayDatos={planes.length > 0}
            hayBusqueda={!!busqueda || filtroEstado !== 'todos'}
            icono={<CreditCard className="w-6 h-6" />}
            labelVacio="Sin planes de suscripción"
            labelCrear="Nuevo plan"
            onCrear={handleCrear}
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
                    planDetalle?.id === p.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{p.nombre}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      p.activo
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-lg font-black text-primary">${p.precio.toLocaleString('es-CO')}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {p.duracion_dias} días
                    </span>
                    <span>{p.moneda}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop — tabla */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                    <th className="text-right py-3 px-4 font-semibold">Precio</th>
                    <th className="text-center py-3 px-4 font-semibold">Duración</th>
                    <th className="text-center py-3 px-4 font-semibold">Planilla</th>
                    <th className="text-left py-3 px-4 font-semibold">Estado</th>
                    <th className="text-right py-3 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtrados.map(p => (
                    <tr
                      key={p.id}
                      onClick={() => handleSeleccionar(p)}
                      className={`cursor-pointer transition-colors ${
                        planDetalle?.id === p.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{p.nombre}</p>
                          {p.descripcion && (
                            <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{p.descripcion}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-lg text-primary">
                        ${p.precio.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-center text-muted-foreground">
                        {p.duracion_dias} días
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          p.incluye_planilla
                            ? 'bg-info/10 text-info border-info/20'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {p.incluye_planilla ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          p.activo
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-destructive/10 text-destructive border-destructive/20'
                        }`}>
                          {p.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <MenuAcciones
                          items={[
                            {
                              label: 'Editar',
                              icon: <Pencil className="w-3.5 h-3.5" />,
                              fn: () => handleEditar(p),
                            },
                            {
                              label: p.activo ? 'Desactivar' : 'Activar',
                              icon: <ToggleLeft className="w-3.5 h-3.5" />,
                              fn: () => toggleEstado(p.id, p.activo),
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

      {/* Modal crear/editar plan */}
      {modalAbierto && (
        <ModalSuscripcion
          plan={planEditando}
          onGuardar={crearPlan}
          onActualizar={actualizarPlan}
          onCerrar={() => { setModalAbierto(false); setPlanEditando(null) }}
          cargando={cargando}
          usuarioId={usuario?.id ?? ''}
        />
      )}
    </>
  )
}
