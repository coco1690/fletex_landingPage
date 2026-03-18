import { useEffect, useState } from 'react'
import {
  BookOpen, User, XCircle,
  CalendarDays, FileText,
} from 'lucide-react'
import { Button }  from '@/components/ui/button'
import { Input }   from '@/components/ui/input'
import { Label }   from '@/components/ui/label'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useReservasStore, type Reserva } from './reservasStore'
import { useAuthStore }                   from '@/store/authStore'
import { TablaPage }                      from '@/components/shared/TablaPage'
import { TablaVacia }                     from '@/components/shared/TablaVacia'
import { PanelDetalle }                   from '@/components/shared/PanelDetalle'
import { Paginacion }                     from '@/components/shared/Paginacion'
import { EstadoReservaBadge, EstadoPagoBadge } from './components/EstadoReservaBadge'
import { ReservaCard }                    from './components/ReservaCard'
import { TablaReservas }                  from './components/TablaReservas'

export function ReservasPage() {
  const {
    reservas, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarReservas, cambiarPagina,
    cancelarReserva, limpiarError,
  } = useReservasStore()

  const { usuario } = useAuthStore()

  const [busqueda, setBusqueda]               = useState('')
  const [filtroEstado, setFiltroEstado]       = useState('todos')
  const [filtroEstadoPago, setFiltroEstadoPago] = useState('todos')
  const [filtroFecha, setFiltroFecha]         = useState('')
  const [reservaDetalle, setReservaDetalle]   = useState<Reserva | null>(null)
  const [reservaCancelando, setReservaCancelando] = useState<Reserva | null>(null)
  const [motivo, setMotivo]                   = useState('')
  const [errorMotivo, setErrorMotivo]         = useState('')

  // ── carga inicial ─────────────────────────────────────
  useEffect(() => { cargarReservas() }, [])

  // ── recargar al cambiar filtros ───────────────────────
  useEffect(() => {
    cargarReservas({
      estado:      filtroEstado      !== 'todos' ? filtroEstado      : undefined,
      estado_pago: filtroEstadoPago  !== 'todos' ? filtroEstadoPago  : undefined,
      fecha:       filtroFecha || undefined,
    }, 1)
  }, [filtroEstado, filtroEstadoPago, filtroFecha])

  // ── filtro local búsqueda ─────────────────────────────
  const filtrados = reservas.filter(r => {
    const q         = busqueda.toLowerCase()
    const pasajero  = (r as any).pasajero?.nombre?.toLowerCase() ?? ''
    const ruta      = (r as any).viaje?.ruta?.nombre?.toLowerCase() ?? ''
    const telefono  = (r as any).pasajero?.telefono?.toLowerCase() ?? ''
    return pasajero.includes(q) || ruta.includes(q) || telefono.includes(q)
  })

  // ── reglas de negocio ─────────────────────────────────
  const puedeCancelar = (r: Reserva) =>
    r.estado !== 'cancelada' && r.estado !== 'abordada'

  // ── handlers ─────────────────────────────────────────
  const handleSeleccionar = (r: Reserva) =>
    setReservaDetalle(reservaDetalle?.id === r.id ? null : r)

  const handleCancelar = async () => {
    if (!reservaCancelando || !usuario?.id) return
    if (!motivo.trim()) { setErrorMotivo('El motivo es requerido'); return }
    setErrorMotivo('')
    const ok = await cancelarReserva(reservaCancelando.id, motivo.trim(), usuario.id)
    if (ok) {
      if (reservaDetalle?.id === reservaCancelando.id) setReservaDetalle(null)
      setReservaCancelando(null)
      setMotivo('')
    }
  }

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} reserva${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin reservas registradas'

  return (
    <>
      <TablaPage
        titulo="Reservas"
        subtitulo={subtitulo}
        labelBoton="Nueva reserva"
        placeholder="Buscar por pasajero, ruta o teléfono..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        filtrosEstado={[
          { valor: 'todos',     label: 'Todas' },
          { valor: 'reservada', label: 'Reservada' },
          { valor: 'abordada',  label: 'Abordada' },
          { valor: 'no_show',   label: 'No show' },
          { valor: 'cancelada', label: 'Cancelada' },
        ]}
        filtroExtra={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtro pago */}
            <Select value={filtroEstadoPago} onValueChange={setFiltroEstadoPago}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Estado pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los pagos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
                <SelectItem value="fallido">Fallido</SelectItem>
                <SelectItem value="expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro fecha */}
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                type="date"
                value={filtroFecha}
                onChange={e => setFiltroFecha(e.target.value)}
                className="pl-9 h-9 w-40"
              />
            </div>
          </div>
        }
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={() => cargarReservas(
          {
            estado:      filtroEstado     !== 'todos' ? filtroEstado      : undefined,
            estado_pago: filtroEstadoPago !== 'todos' ? filtroEstadoPago  : undefined,
            fecha:       filtroFecha || undefined,
          },
          paginaActual
        )}
        onCrear={() => {}} // las reservas las crea el pasajero desde la app
        paginacion={
          totalPaginas > 1 ? (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              totalRegistros={totalRegistros}
              porPagina={8}
              onCambiar={cambiarPagina}
              cargando={cargando}
            />
          ) : undefined
        }
        panelDetalle={reservaDetalle && (
          <PanelDetalle
            titulo="Detalle reserva"
            nombre={(reservaDetalle as any).pasajero?.nombre ?? '—'}
            subtitulo={(reservaDetalle as any).pasajero?.telefono ?? 'Sin teléfono'}
            badge={
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <EstadoReservaBadge estado={reservaDetalle.estado} />
                <EstadoPagoBadge   estado={reservaDetalle.estado_pago} />
              </div>
            }
            icono={<User className="w-7 h-7 text-primary" />}
            stats={[
              { valor: reservaDetalle.cupos_solicitados,                          label: 'Cupos' },
              { valor: `$${reservaDetalle.valor_total.toLocaleString('es-CO')}`,  label: 'Total' },
            ]}
            campos={[
              { label: 'Ruta',         valor: (reservaDetalle as any).viaje?.ruta?.nombre ?? '—' },
              { label: 'Origen',       valor: (reservaDetalle as any).viaje?.ruta?.agencia_origen?.nombre ?? '—' },
              { label: 'Destino',      valor: (reservaDetalle as any).viaje?.ruta?.agencia_destino?.nombre ?? '—' },
              { label: 'Salida',       valor: (reservaDetalle as any).viaje?.hora_salida_programada
                ? new Date((reservaDetalle as any).viaje.hora_salida_programada).toLocaleString('es-CO', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })
                : '—' },
              { label: 'Precio/cupo',  valor: `$${reservaDetalle.precio_pasaje.toLocaleString('es-CO')}` },
              { label: 'Comisión',     valor: `$${reservaDetalle.valor_comision.toLocaleString('es-CO')}` },
              { label: 'Abordaje',     valor: reservaDetalle.punto_abordaje
                ? (reservaDetalle as any).punto_abordaje?.nombre
                : 'No especificado' },
              { label: 'Fecha reserva', valor: new Date(reservaDetalle.fecha_reserva).toLocaleString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                }) },
              ...(reservaDetalle.wompi_transaction_id ? [{
                label: 'Trans. Wompi',
                valor: reservaDetalle.wompi_transaction_id,
              }] : []),
              ...(reservaDetalle.motivo_cancelacion ? [{
                label: 'Motivo cancelación',
                valor: reservaDetalle.motivo_cancelacion,
              }] : []),
            ]}
            onCerrar={() => setReservaDetalle(null)}
            onEditar={() => {
              if (puedeCancelar(reservaDetalle)) {
                setReservaCancelando(reservaDetalle)
                setReservaDetalle(null)
              }
            }}
            labelEditar={puedeCancelar(reservaDetalle) ? 'Cancelar reserva' : 'Sin acciones'}
          />
        )}
      >
        {filtrados.length === 0 ? (
          <TablaVacia
            cargando={cargando}
            hayDatos={reservas.length > 0}
            hayBusqueda={!!busqueda}
            icono={<BookOpen className="w-6 h-6" />}
            labelVacio="Sin reservas"
            labelCrear="Sin reservas"
            onCrear={() => {}}
          />
        ) : (
          <>
            {/* Móvil — cards */}
            <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
              {filtrados.map(r => (
                <ReservaCard
                  key={r.id}
                  reserva={r}
                  esSeleccionada={reservaDetalle?.id === r.id}
                  onSeleccionar={() => handleSeleccionar(r)}
                  onCancelar={() => setReservaCancelando(r)}
                  puedeCancelar={puedeCancelar(r)}
                />
              ))}
            </div>

            {/* Desktop — tabla */}
            <div className="hidden md:block">
              <TablaReservas
                reservas={filtrados}
                reservaDetalle={reservaDetalle}
                onSeleccionar={handleSeleccionar}
                onCancelar={setReservaCancelando}
                puedeCancelar={puedeCancelar}
              />
            </div>
          </>
        )}
      </TablaPage>

      {/* Modal cancelar reserva */}
      {reservaCancelando && (
        <Dialog open onOpenChange={() => { setReservaCancelando(null); setMotivo(''); setErrorMotivo('') }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-destructive/10 rounded-xl flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <DialogTitle>Cancelar reserva</DialogTitle>
                  <DialogDescription>
                    {(reservaCancelando as any).pasajero?.nombre ?? 'Pasajero'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Info reserva */}
              <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
                <p className="text-[10px] text-muted-foreground">Reserva a cancelar</p>
                <p className="text-sm font-semibold text-foreground">
                  {(reservaCancelando as any).viaje?.ruta?.nombre ?? '—'}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {reservaCancelando.cupos_solicitados} cupo{reservaCancelando.cupos_solicitados !== 1 ? 's' : ''}{' '}
                  · ${reservaCancelando.valor_total.toLocaleString('es-CO')}
                </p>
              </div>

              {/* Motivo */}
              <div className="space-y-1.5">
                <Label>Motivo de cancelación <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
                  <textarea
                    value={motivo}
                    onChange={e => { setMotivo(e.target.value); setErrorMotivo('') }}
                    placeholder="Explica el motivo de la cancelación..."
                    rows={3}
                    autoFocus
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none pl-9"
                  />
                </div>
                {errorMotivo && (
                  <p className="text-xs text-destructive">{errorMotivo}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setReservaCancelando(null); setMotivo(''); setErrorMotivo('') }}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  onClick={handleCancelar}
                  disabled={cargando || !motivo.trim()}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
                >
                  {cargando ? 'Cancelando...' : 'Cancelar reserva'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}