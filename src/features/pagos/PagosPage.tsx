import { useEffect, useState } from 'react'
import { DollarSign, User, Calendar } from 'lucide-react'
import { usePagosStore, type Pago } from './pagosStore'
import { parsearFechaLocal } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { Paginacion } from '@/components/shared/Paginacion'
import { ModalPago } from './ModalPago'
import { POR_PAGINA } from './pagosStore'

function EstadoPagoBadge({ estado }: { estado: string }) {
  const config: Record<string, { label: string; clase: string }> = {
    activo:  { label: 'Activo',  clase: 'bg-success/10 text-success border-success/20' },
    vencido: { label: 'Vencido', clase: 'bg-destructive/10 text-destructive border-destructive/20' },
  }
  const c = config[estado] ?? { label: estado, clase: 'bg-muted text-muted-foreground border-border' }
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.clase}`}>
      {c.label}
    </span>
  )
}

export function PagosPage() {
  const {
    pagos, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    conductoresDisponibles, planesActivos,
    cargarPagos, cambiarPagina,
    cargarConductores, cargarPlanes,
    registrarPago, limpiarError,
  } = usePagosStore()

  const { usuario } = useAuthStore()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [pagoDetalle, setPagoDetalle] = useState<Pago | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  useEffect(() => { cargarPagos() }, [])

  useEffect(() => {
    cargarPagos({ estado: filtroEstado !== 'todos' ? filtroEstado : undefined }, 1)
  }, [filtroEstado])

  const handleAbrirModal = () => {
    cargarConductores()
    cargarPlanes()
    setModalAbierto(true)
  }

  const filtrados = pagos.filter(p => {
    const q = busqueda.toLowerCase()
    return (
      (p.conductor?.nombre?.toLowerCase().includes(q) ?? false) ||
      (p.plan?.nombre?.toLowerCase().includes(q) ?? false) ||
      (p.referencia_nequi?.toLowerCase().includes(q) ?? false) ||
      p.id.toLowerCase().includes(q)
    )
  })

  const handleSeleccionar = (p: Pago) =>
    setPagoDetalle(pagoDetalle?.id === p.id ? null : p)

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} pago${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin pagos registrados'

  return (
    <>
      <TablaPage
        titulo="Pagos de suscripción"
        subtitulo={subtitulo}
        labelBoton="Registrar pago"
        placeholder="Buscar por conductor, plan o referencia..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        filtrosEstado={[
          { valor: 'todos',   label: 'Todos' },
          { valor: 'activo',  label: 'Activos' },
          { valor: 'vencido', label: 'Vencidos' },
        ]}
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={() => cargarPagos({
          estado: filtroEstado !== 'todos' ? filtroEstado : undefined,
        }, paginaActual)}
        onCrear={handleAbrirModal}
        paginacion={
          totalPaginas > 1 ? (
            <Paginacion paginaActual={paginaActual} totalPaginas={totalPaginas}
              totalRegistros={totalRegistros} porPagina={POR_PAGINA}
              onCambiar={cambiarPagina} cargando={cargando} />
          ) : undefined
        }
        panelDetalle={pagoDetalle && (
          <PanelDetalle
            titulo="Detalle del pago"
            nombre={pagoDetalle.conductor?.nombre ?? '—'}
            subtitulo={pagoDetalle.plan?.nombre ?? '—'}
            badge={<EstadoPagoBadge estado={pagoDetalle.estado} />}
            icono={<DollarSign className="w-7 h-7 text-success" />}
            stats={[
              { valor: `$${pagoDetalle.valor_pagado.toLocaleString('es-CO')}`, label: 'Pagado' },
              { valor: `${pagoDetalle.plan?.duracion_dias ?? 0}d`, label: 'Duración' },
            ]}
            campos={[
              { label: 'ID', valor: pagoDetalle.id.slice(0, 8) },
              { label: 'Conductor', valor: pagoDetalle.conductor?.nombre ?? '—' },
              { label: 'Plan', valor: pagoDetalle.plan?.nombre ?? '—' },
              { label: 'Ref. Nequi', valor: pagoDetalle.referencia_nequi ?? '—' },
              { label: 'Inicio', valor: parsearFechaLocal(pagoDetalle.fecha_inicio).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric',
                }) },
              { label: 'Corte', valor: parsearFechaLocal(pagoDetalle.fecha_corte).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric',
                }) },
              { label: 'Fecha pago', valor: parsearFechaLocal(pagoDetalle.fecha_pago).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric',
                }) },
              { label: 'Registrado', valor: parsearFechaLocal(pagoDetalle.fecha_creacion).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                }) },
              ...(pagoDetalle.observaciones ? [{
                label: 'Observaciones', valor: pagoDetalle.observaciones,
              }] : []),
            ]}
            onCerrar={() => setPagoDetalle(null)}
          />
        )}
      >
        {filtrados.length === 0 ? (
          <TablaVacia cargando={cargando} hayDatos={pagos.length > 0}
            hayBusqueda={!!busqueda || filtroEstado !== 'todos'}
            icono={<DollarSign className="w-6 h-6" />}
            labelVacio="Sin pagos registrados" labelCrear="Registrar pago"
            onCrear={handleAbrirModal} />
        ) : (
          <>
            {/* Móvil */}
            <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
              {filtrados.map(p => (
                <button key={p.id} onClick={() => handleSeleccionar(p)}
                  className={`w-full text-left p-4 transition-colors ${
                    pagoDetalle?.id === p.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{p.conductor?.nombre ?? '—'}</span>
                    <EstadoPagoBadge estado={p.estado} />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mb-1">{p.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{p.plan?.nombre ?? '—'}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {parsearFechaLocal(p.fecha_corte).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="font-medium text-foreground">${p.valor_pagado.toLocaleString('es-CO')}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="text-left py-3 px-4 pl-5 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Conductor</th>
                    <th className="text-left py-3 px-4 font-semibold">Plan</th>
                    <th className="text-right py-3 px-4 font-semibold">Valor</th>
                    <th className="text-left py-3 px-4 font-semibold">Inicio</th>
                    <th className="text-left py-3 px-4 font-semibold">Corte</th>
                    <th className="text-left py-3 px-4 font-semibold">Ref. Nequi</th>
                    <th className="text-left py-3 px-4 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtrados.map(p => (
                    <tr key={p.id} onClick={() => handleSeleccionar(p)}
                      className={`cursor-pointer transition-colors ${
                        pagoDetalle?.id === p.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                      }`}>
                      <td className="px-4 py-3 pl-5">
                        <span className="text-[10px] font-mono text-muted-foreground">{p.id.slice(0, 8)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{p.conductor?.nombre ?? '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{p.plan?.nombre ?? '—'}</td>
                      <td className="py-3 px-4 text-right font-medium text-foreground">
                        ${p.valor_pagado.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {parsearFechaLocal(p.fecha_inicio).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {parsearFechaLocal(p.fecha_corte).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{p.referencia_nequi ?? '—'}</td>
                      <td className="py-3 px-4">
                        <EstadoPagoBadge estado={p.estado} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </TablaPage>

      {modalAbierto && (
        <ModalPago
          conductores={conductoresDisponibles}
          planes={planesActivos}
          onGuardar={registrarPago}
          onCerrar={() => setModalAbierto(false)}
          cargando={cargando}
          registradoPor={usuario?.id ?? ''}
        />
      )}
    </>
  )
}
