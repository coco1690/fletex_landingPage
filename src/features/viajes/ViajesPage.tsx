import { useEffect, useState } from 'react'
import { Car, Trash2, CalendarDays } from 'lucide-react'
import { Button }  from '@/components/ui/button'
import { Input }   from '@/components/ui/input'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { useViajesStore, type Viaje } from './viajesStore'
import { useAuthStore }               from '@/store/authStore'
import { ModalViaje }                 from './ModalViaje'
import { ModalCancelarViaje }         from './ModalCancelarViaje'
import { PanelDetalle }               from '@/components/shared/PanelDetalle'
import { TablaPage }                  from '@/components/shared/TablaPage'
import { TablaVacia }                 from '@/components/shared/TablaVacia'
import { Paginacion }                 from '@/components/shared/Paginacion'
import { EstadoViajeBadge }           from './components/EstadoViajeBadge'
import { ViajeCard }                  from './components/ViajeCard'
import { TablaViajes }                from './components/TablaViajes'

export function ViajesPage() {
  const {
    viajes, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarViajes, cargarSelects, cambiarPagina,
    crearViaje, actualizarViaje,
    cancelarViaje, eliminarViaje,
    limpiarError,
  } = useViajesStore()

  const { usuario } = useAuthStore()

  const [busqueda, setBusqueda]               = useState('')
  const [filtroEstado, setFiltroEstado]       = useState('todos')
  const [filtroFecha, setFiltroFecha]         = useState('')
  const [modalAbierto, setModalAbierto]       = useState(false)
  const [viajeEditando, setViajeEditando]     = useState<Viaje | null>(null)
  const [viajeDetalle, setViajeDetalle]       = useState<Viaje | null>(null)
  const [viajeCancelando, setViajeCancelando] = useState<Viaje | null>(null)
  const [viajeEliminando, setViajeEliminando] = useState<Viaje | null>(null)

  useEffect(() => { cargarViajes(); cargarSelects() }, [])

  useEffect(() => {
    cargarViajes({ fecha: filtroFecha || undefined, estado: filtroEstado }, 1)
  }, [filtroFecha, filtroEstado])

  const filtrados = viajes.filter(v => {
    const q = busqueda.toLowerCase()
    return (
      ((v as any).ruta?.nombre ?? '').toLowerCase().includes(q) ||
      ((v as any).conductor?.usuario?.nombre ?? '').toLowerCase().includes(q) ||
      ((v as any).vehiculo?.placa ?? '').toLowerCase().includes(q)
    )
  })

  const puedeEditar   = (v: Viaje) => v.estado === 'programado' || v.estado === 'abordando'
  const puedeCancelar = (v: Viaje) => v.estado !== 'completado' && v.estado !== 'cancelado'

  const abrirCrear  = () => { setViajeEditando(null); setModalAbierto(true) }
  const abrirEditar = (v: Viaje) => { setViajeEditando(v); setModalAbierto(true) }

  const handleGuardar = async (datos: any) =>
    viajeEditando ? actualizarViaje(viajeEditando.id, datos) : crearViaje(datos)

  const handleCancelar = async (motivo: string) => {
    if (!viajeCancelando || !usuario?.id) return false
    return cancelarViaje(viajeCancelando.id, motivo, usuario.id)
  }

  const handleEliminar = async () => {
    if (!viajeEliminando) return
    const ok = await eliminarViaje(viajeEliminando.id)
    if (ok && viajeDetalle?.id === viajeEliminando.id) setViajeDetalle(null)
    setViajeEliminando(null)
  }

  const handleSeleccionar = (v: Viaje) =>
    setViajeDetalle(viajeDetalle?.id === v.id ? null : v)

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} viaje${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin viajes registrados'

  return (
    <>
      <TablaPage
        titulo="Viajes"
        subtitulo={subtitulo}
        labelBoton="Nuevo viaje"
        placeholder="Buscar por ruta, conductor o placa..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        filtrosEstado={[
          { valor: 'todos',      label: 'Todos' },
          { valor: 'programado', label: 'Programado' },
          { valor: 'abordando',  label: 'Abordando' },
          { valor: 'en_curso',   label: 'En curso' },
          { valor: 'completado', label: 'Completado' },
          { valor: 'cancelado',  label: 'Cancelado' },
        ]}
        filtroExtra={
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="date"
              value={filtroFecha}
              onChange={e => setFiltroFecha(e.target.value)}
              className="pl-9 h-9 w-44"
            />
          </div>
        }
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={() => cargarViajes(
          { fecha: filtroFecha || undefined, estado: filtroEstado },
          paginaActual
        )}
        onCrear={abrirCrear}
        panelDetalle={viajeDetalle && (
          <PanelDetalle
            titulo="Detalle viaje"
            nombre={(viajeDetalle as any).ruta?.nombre ?? '—'}
            subtitulo={new Date(viajeDetalle.hora_salida_programada).toLocaleString('es-CO', {
              weekday: 'short', day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit',
            })}
            badge={<EstadoViajeBadge estado={viajeDetalle.estado} />}
            icono={<Car className="w-7 h-7 text-primary" />}
            stats={[
              { valor: `${viajeDetalle.cupos_confirmados}/${viajeDetalle.cupos_totales}`, label: 'Cupos' },
              { valor: `$${viajeDetalle.precio_pasaje.toLocaleString('es-CO')}`, label: 'Precio' },
            ]}
            campos={[
              { label: 'Conductor',   valor: (viajeDetalle as any).conductor?.usuario?.nombre ?? '—' },
              { label: 'Vehículo',    valor: (viajeDetalle as any).vehiculo?.placa ?? '—' },
              { label: 'Origen',      valor: (viajeDetalle as any).ruta?.agencia_origen?.nombre ?? '—' },
              { label: 'Destino',     valor: (viajeDetalle as any).ruta?.agencia_destino?.nombre ?? '—' },
              { label: 'Reservados',  valor: `${viajeDetalle.cupos_reservados} cupos` },
              { label: 'Encomiendas', valor: viajeDetalle.acepta_encomiendas ? 'Sí' : 'No' },
              ...(viajeDetalle.observaciones      ? [{ label: 'Observaciones',      valor: viajeDetalle.observaciones }]      : []),
              ...(viajeDetalle.motivo_cancelacion ? [{ label: 'Motivo cancelación', valor: viajeDetalle.motivo_cancelacion }] : []),
            ]}
            onCerrar={() => setViajeDetalle(null)}
            onEditar={() => { abrirEditar(viajeDetalle); setViajeDetalle(null) }}
            labelEditar="Editar viaje"
          />
        )}
      >
        {filtrados.length === 0 ? (
          <TablaVacia
            cargando={cargando}
            hayDatos={viajes.length > 0}
            hayBusqueda={!!busqueda}
            icono={<Car className="w-6 h-6" />}
            labelVacio="Sin viajes"
            labelCrear="Nuevo viaje"
            onCrear={abrirCrear}
          />
        ) : (
          <>
            {/* Móvil — cards con scroll */}
            <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
              {filtrados.map(viaje => (
                <ViajeCard
                  key={viaje.id}
                  viaje={viaje}
                  esSeleccionado={viajeDetalle?.id === viaje.id}
                  onSeleccionar={() => handleSeleccionar(viaje)}
                  onEditar={() => abrirEditar(viaje)}
                  onCancelar={() => setViajeCancelando(viaje)}
                  onEliminar={() => setViajeEliminando(viaje)}
                  puedeEditar={puedeEditar(viaje)}
                  puedeCancelar={puedeCancelar(viaje)}
                />
              ))}
            </div>

            {/* Desktop — tabla con scroll */}
            <div className="hidden md:block">
              <TablaViajes
                viajes={filtrados}
                viajeDetalle={viajeDetalle}
                onSeleccionar={handleSeleccionar}
                onEditar={abrirEditar}
                onCancelar={setViajeCancelando}
                onEliminar={setViajeEliminando}
                puedeEditar={puedeEditar}
                puedeCancelar={puedeCancelar}
              />
            </div>
          </>
        )}
        {totalPaginas > 1 && (
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            totalRegistros={totalRegistros}
            porPagina={8}
            onCambiar={cambiarPagina}
            cargando={cargando}
          />
        )}
      </TablaPage>

      {/* Modales */}
      {modalAbierto && (
        <ModalViaje
          viaje={viajeEditando}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setViajeEditando(null) }}
          cargando={cargando}
        />
      )}

      {viajeCancelando && (
        <ModalCancelarViaje
          viaje={viajeCancelando}
          onConfirmar={handleCancelar}
          onCerrar={() => setViajeCancelando(null)}
          cargando={cargando}
        />
      )}

      {viajeEliminando && (
        <Dialog open onOpenChange={() => setViajeEliminando(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-destructive/10 rounded-xl flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <DialogTitle>Eliminar viaje</DialogTitle>
                  <DialogDescription>Esta acción no se puede deshacer</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Viaje a eliminar</p>
                <p className="text-sm font-semibold text-foreground">
                  {(viajeEliminando as any).ruta?.nombre ?? '—'}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(viajeEliminando.hora_salida_programada).toLocaleString('es-CO', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5">
                <p className="text-xs text-destructive">
                  Solo elimina viajes sin reservas activas.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setViajeEliminando(null)} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handleEliminar}
                  disabled={cargando}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
                >
                  {cargando ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}