import { useEffect, useState } from 'react'
import {
  Wallet, Building2, CalendarDays,
} from 'lucide-react'
import { Input }   from '@/components/ui/input'
import { useLiquidacionesStore, type Liquidacion, POR_PAGINA } from './liquidacionesStore'
import { TablaPage }                     from '@/components/shared/TablaPage'
import { TablaVacia }                    from '@/components/shared/TablaVacia'
import { PanelDetalle }                  from '@/components/shared/PanelDetalle'
import { Paginacion }                    from '@/components/shared/Paginacion'
import { EstadoLiquidacionBadge }        from './components/EstadoLiquidacionBadge'
import { LiquidacionCard }              from './components/LiquidacionCard'
import { TablaLiquidaciones }           from './components/TablaLiquidaciones'

export function LiquidacionesPage() {
  const {
    liquidaciones, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarLiquidaciones, cambiarPagina,
    cambiarEstado, limpiarError,
  } = useLiquidacionesStore()

  const [busqueda, setBusqueda]                 = useState('')
  const [filtroEstado, setFiltroEstado]         = useState('todos')
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('')
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('')
  const [liquidacionDetalle, setLiquidacionDetalle] = useState<Liquidacion | null>(null)

  // ── carga inicial ─────────────────────────────────────
  useEffect(() => { cargarLiquidaciones() }, [])

  // ── recargar al cambiar filtros ───────────────────────
  useEffect(() => {
    cargarLiquidaciones({
      estado:      filtroEstado      !== 'todos' ? filtroEstado      : undefined,
      fecha_desde: filtroFechaDesde || undefined,
      fecha_hasta: filtroFechaHasta || undefined,
    }, 1)
  }, [filtroEstado, filtroFechaDesde, filtroFechaHasta])

  // ── filtro local búsqueda ─────────────────────────────
  const filtrados = liquidaciones.filter(l => {
    const q       = busqueda.toLowerCase()
    const agencia = l.agencia?.nombre?.toLowerCase() ?? ''
    const codigo  = l.agencia?.codigo?.toLowerCase() ?? ''
    return agencia.includes(q) || codigo.includes(q)
  })

  // ── handlers ─────────────────────────────────────────
  const handleSeleccionar = (l: Liquidacion) =>
    setLiquidacionDetalle(liquidacionDetalle?.id === l.id ? null : l)

  const handleMarcarPagado = async (l: Liquidacion) => {
    const ok = await cambiarEstado(l.id, 'pagado')
    if (ok && liquidacionDetalle?.id === l.id) setLiquidacionDetalle(null)
  }

  const handleMarcarDisputa = async (l: Liquidacion) => {
    const ok = await cambiarEstado(l.id, 'en_disputa')
    if (ok && liquidacionDetalle?.id === l.id) setLiquidacionDetalle(null)
  }

  const filtrosActuales = () => ({
    estado:      filtroEstado      !== 'todos' ? filtroEstado      : undefined,
    fecha_desde: filtroFechaDesde || undefined,
    fecha_hasta: filtroFechaHasta || undefined,
  })

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} liquidación${totalRegistros !== 1 ? 'es' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin liquidaciones registradas'

  return (
    <TablaPage
      titulo="Liquidaciones"
      subtitulo={subtitulo}
      labelBoton="Nueva liquidación"
      placeholder="Buscar por agencia o código..."
      busqueda={busqueda}
      onBusqueda={setBusqueda}
      filtroEstado={filtroEstado}
      onFiltroEstado={setFiltroEstado}
      filtrosEstado={[
        { valor: 'todos',      label: 'Todas' },
        { valor: 'pendiente',  label: 'Pendiente' },
        { valor: 'pagado',     label: 'Pagado' },
        { valor: 'en_disputa', label: 'En disputa' },
      ]}
      filtroExtra={
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtro fecha desde */}
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="date"
              value={filtroFechaDesde}
              onChange={e => setFiltroFechaDesde(e.target.value)}
              className="pl-9 h-9 w-40"
              placeholder="Desde"
            />
          </div>
          {/* Filtro fecha hasta */}
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="date"
              value={filtroFechaHasta}
              onChange={e => setFiltroFechaHasta(e.target.value)}
              className="pl-9 h-9 w-40"
              placeholder="Hasta"
            />
          </div>
        </div>
      }
      cargando={cargando}
      error={error}
      onLimpiarError={limpiarError}
      onRefresh={() => cargarLiquidaciones(filtrosActuales(), paginaActual)}
      onCrear={() => {}}
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
      panelDetalle={liquidacionDetalle && (
        <PanelDetalle
          titulo="Detalle liquidación"
          nombre={liquidacionDetalle.agencia?.nombre ?? '—'}
          subtitulo={liquidacionDetalle.agencia?.codigo ?? '—'}
          badge={<EstadoLiquidacionBadge estado={liquidacionDetalle.estado} />}
          icono={<Building2 className="w-7 h-7 text-primary" />}
          stats={[
            { valor: liquidacionDetalle.total_viajes,                                      label: 'Viajes' },
            { valor: liquidacionDetalle.total_pasajeros,                                   label: 'Pasajeros' },
            { valor: `$${liquidacionDetalle.total_recaudado.toLocaleString('es-CO')}`,     label: 'Recaudado' },
          ]}
          campos={[
            { label: 'Período inicio',   valor: new Date(liquidacionDetalle.periodo_inicio).toLocaleDateString('es-CO', {
                day: 'numeric', month: 'short', year: 'numeric',
              }) },
            { label: 'Período fin',       valor: new Date(liquidacionDetalle.periodo_fin).toLocaleDateString('es-CO', {
                day: 'numeric', month: 'short', year: 'numeric',
              }) },
            { label: 'Total recaudado',   valor: `$${liquidacionDetalle.total_recaudado.toLocaleString('es-CO')}` },
            { label: 'Comisiones',        valor: `$${liquidacionDetalle.total_comisiones.toLocaleString('es-CO')}` },
            { label: 'Encomiendas',       valor: `$${liquidacionDetalle.total_encomiendas.toLocaleString('es-CO')}` },
            { label: 'Registrado por',    valor: liquidacionDetalle.registrado?.nombre ?? '—' },
            { label: 'Fecha creación',    valor: new Date(liquidacionDetalle.fecha_creacion).toLocaleString('es-CO', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              }) },
            ...(liquidacionDetalle.fecha_pago ? [{
              label: 'Fecha de pago',
              valor: new Date(liquidacionDetalle.fecha_pago).toLocaleString('es-CO', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              }),
            }] : []),
            ...(liquidacionDetalle.referencia_nequi ? [{
              label: 'Ref. Nequi',
              valor: liquidacionDetalle.referencia_nequi,
            }] : []),
            ...(liquidacionDetalle.observaciones ? [{
              label: 'Observaciones',
              valor: liquidacionDetalle.observaciones,
            }] : []),
          ]}
          onCerrar={() => setLiquidacionDetalle(null)}
          onEditar={() => {}}
          labelEditar="Editar liquidación"
        />
      )}
    >
      {filtrados.length === 0 ? (
        <TablaVacia
          cargando={cargando}
          hayDatos={liquidaciones.length > 0}
          hayBusqueda={!!busqueda}
          icono={<Wallet className="w-6 h-6" />}
          labelVacio="Sin liquidaciones"
          labelCrear="Nueva liquidación"
          onCrear={() => {}}
        />
      ) : (
        <>
          {/* Móvil — cards */}
          <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
            {filtrados.map(l => (
              <LiquidacionCard
                key={l.id}
                liquidacion={l}
                esSeleccionada={liquidacionDetalle?.id === l.id}
                onSeleccionar={() => handleSeleccionar(l)}
                onMarcarPagado={() => handleMarcarPagado(l)}
                onMarcarDisputa={() => handleMarcarDisputa(l)}
              />
            ))}
          </div>

          {/* Desktop — tabla */}
          <div className="hidden md:block">
            <TablaLiquidaciones
              liquidaciones={filtrados}
              liquidacionDetalle={liquidacionDetalle}
              onSeleccionar={handleSeleccionar}
              onMarcarPagado={handleMarcarPagado}
              onMarcarDisputa={handleMarcarDisputa}
            />
          </div>
        </>
      )}
    </TablaPage>
  )
}
