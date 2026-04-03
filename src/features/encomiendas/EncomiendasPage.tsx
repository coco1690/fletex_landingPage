import { useEffect, useState } from 'react'
import { Package, Building2, DollarSign } from 'lucide-react'
import { useEncomiendasStore, type Encomienda } from './encomiendasStore'
import { TablaPage } from '@/components/shared/TablaPage'
import { TablaVacia } from '@/components/shared/TablaVacia'
import { PanelDetalle } from '@/components/shared/PanelDetalle'
import { Paginacion } from '@/components/shared/Paginacion'
import { EstadoEncomiendaBadge } from './components/EstadoEncomiendaBadge'
import { POR_PAGINA } from './encomiendasStore'

export function EncomiendasPage() {
  const {
    encomiendas, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarEncomiendas, cambiarPagina, limpiarError,
  } = useEncomiendasStore()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [encomiendaDetalle, setEncomiendaDetalle] = useState<Encomienda | null>(null)

  useEffect(() => { cargarEncomiendas() }, [])

  useEffect(() => {
    cargarEncomiendas({
      estado: filtroEstado !== 'todos' ? filtroEstado : undefined,
    }, 1)
  }, [filtroEstado])

  const filtrados = encomiendas.filter(e => {
    const q = busqueda.toLowerCase()
    return (
      e.codigo_rastreo.toLowerCase().includes(q) ||
      e.descripcion.toLowerCase().includes(q) ||
      e.destinatario_nombre.toLowerCase().includes(q) ||
      (e.agencia_origen?.nombre?.toLowerCase().includes(q) ?? false) ||
      (e.agencia_destino?.nombre?.toLowerCase().includes(q) ?? false)
    )
  })

  const handleSeleccionar = (e: Encomienda) =>
    setEncomiendaDetalle(encomiendaDetalle?.id === e.id ? null : e)

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} encomienda${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin encomiendas registradas'

  const tipoCobro = (t: string) => t === 'prepago' ? 'Prepago' : 'Contraentrega'

  return (
    <TablaPage
      titulo="Encomiendas"
      subtitulo={subtitulo}
      placeholder="Buscar por código, descripción, destinatario o agencia..."
      busqueda={busqueda}
      onBusqueda={setBusqueda}
      filtroEstado={filtroEstado}
      onFiltroEstado={setFiltroEstado}
      filtrosEstado={[
        { valor: 'todos',       label: 'Todas' },
        { valor: 'registrada',  label: 'Registrada' },
        { valor: 'en_transito', label: 'En tránsito' },
        { valor: 'entregada',   label: 'Entregada' },
        { valor: 'devuelta',    label: 'Devuelta' },
        { valor: 'perdida',     label: 'Perdida' },
      ]}
      cargando={cargando}
      error={error}
      onLimpiarError={limpiarError}
      onRefresh={() => cargarEncomiendas({
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
      panelDetalle={encomiendaDetalle && (
        <PanelDetalle
          titulo="Detalle encomienda"
          nombre={encomiendaDetalle.codigo_rastreo}
          subtitulo={encomiendaDetalle.descripcion}
          badge={<EstadoEncomiendaBadge estado={encomiendaDetalle.estado} />}
          icono={<Package className="w-7 h-7 text-primary" />}
          stats={[
            { valor: `$${encomiendaDetalle.valor_cobro.toLocaleString('es-CO')}`, label: 'Cobro' },
            { valor: `${encomiendaDetalle.peso_kg ?? 0} kg`, label: 'Peso' },
          ]}
          campos={[
            { label: 'Origen', valor: encomiendaDetalle.agencia_origen?.nombre ?? '—' },
            { label: 'Destino', valor: encomiendaDetalle.agencia_destino?.nombre ?? '—' },
            { label: 'Destinatario', valor: encomiendaDetalle.destinatario_nombre },
            { label: 'Tel. destinatario', valor: encomiendaDetalle.destinatario_telefono },
            { label: 'Remitente', valor: encomiendaDetalle.remitente?.nombre ?? '—' },
            { label: 'Tipo cobro', valor: tipoCobro(encomiendaDetalle.tipo_cobro) },
            { label: 'Comisión', valor: `$${encomiendaDetalle.valor_comision.toLocaleString('es-CO')}` },
            { label: 'Valor declarado', valor: encomiendaDetalle.valor_declarado
              ? `$${encomiendaDetalle.valor_declarado.toLocaleString('es-CO')}`
              : '—' },
            { label: 'Fecha registro', valor: new Date(encomiendaDetalle.fecha_registro).toLocaleString('es-CO', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              }) },
            ...(encomiendaDetalle.observaciones ? [{
              label: 'Observaciones', valor: encomiendaDetalle.observaciones,
            }] : []),
          ]}
          onCerrar={() => setEncomiendaDetalle(null)}
        />
      )}
    >
      {filtrados.length === 0 ? (
        <TablaVacia
          cargando={cargando}
          hayDatos={encomiendas.length > 0}
          hayBusqueda={!!busqueda}
          icono={<Package className="w-6 h-6" />}
          labelVacio="Sin encomiendas"
          labelCrear="Sin encomiendas"
          onCrear={() => {}}
        />
      ) : (
        <>
          {/* Móvil — cards */}
          <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
            {filtrados.map(e => (
              <button
                key={e.id}
                onClick={() => handleSeleccionar(e)}
                className={`w-full text-left p-4 transition-colors ${
                  encomiendaDetalle?.id === e.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground font-mono">{e.codigo_rastreo}</span>
                  <EstadoEncomiendaBadge estado={e.estado} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{e.descripcion}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {e.agencia_origen?.nombre ?? '—'} → {e.agencia_destino?.nombre ?? '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${e.valor_cobro.toLocaleString('es-CO')}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Desktop — tabla */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left py-3 px-4 font-semibold">Código</th>
                  <th className="text-left py-3 px-4 font-semibold">Descripción</th>
                  <th className="text-left py-3 px-4 font-semibold">Origen</th>
                  <th className="text-left py-3 px-4 font-semibold">Destino</th>
                  <th className="text-left py-3 px-4 font-semibold">Destinatario</th>
                  <th className="text-right py-3 px-4 font-semibold">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtrados.map(e => (
                  <tr
                    key={e.id}
                    onClick={() => handleSeleccionar(e)}
                    className={`cursor-pointer transition-colors ${
                      encomiendaDetalle?.id === e.id ? 'bg-primary/5' : 'hover:bg-secondary/50'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-xs font-medium text-foreground">{e.codigo_rastreo}</td>
                    <td className="py-3 px-4 text-muted-foreground max-w-[180px] truncate">{e.descripcion}</td>
                    <td className="py-3 px-4 text-muted-foreground">{e.agencia_origen?.nombre ?? '—'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{e.agencia_destino?.nombre ?? '—'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{e.destinatario_nombre}</td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">
                      ${e.valor_cobro.toLocaleString('es-CO')}
                    </td>
                    <td className="py-3 px-4">
                      <EstadoEncomiendaBadge estado={e.estado} />
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
