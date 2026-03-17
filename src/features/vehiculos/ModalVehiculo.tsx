import { useState, useEffect } from 'react'
import {
  Truck, Hash, Car, Users,
  Weight, Calendar,
} from 'lucide-react'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Input }     from '@/components/ui/input'
import { Label }     from '@/components/ui/label'
import { Button }    from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAgenciasStore } from '@/features/agencias/agenciasStore'
import { TIPO_LABELS, type Vehiculo } from './vehiculosStore'
import type { Database } from '@/supabase/types'

type TipoVehiculo   = Database['public']['Enums']['tipo_vehiculo']
type EstadoVehiculo = Database['public']['Enums']['estado_vehiculo']

interface DatosVehiculo {
  placa:               string
  marca:               string
  modelo:              string
  anio:                string
  tipo:                TipoVehiculo
  capacidad_pasajeros: string
  capacidad_carga_kg:  string
  agencia_id:          string
  estado:              EstadoVehiculo
}

interface Props {
  vehiculo?: Vehiculo | null
  onGuardar: (datos: DatosVehiculo) => Promise<boolean>
  onCerrar:  () => void
  cargando:  boolean
}

export function ModalVehiculo({ vehiculo, onGuardar, onCerrar, cargando }: Props) {
  const esEdicion = !!vehiculo

  const { agenciasActivas, cargarAgenciasActivas } = useAgenciasStore()

  const [error,     setError]     = useState('')
  const [placa,     setPlaca]     = useState('')
  const [marca,     setMarca]     = useState('')
  const [modelo,    setModelo]    = useState('')
  const [anio,      setAnio]      = useState('')
  const [tipo,      setTipo]      = useState<TipoVehiculo>('duster')
  const [capacidad, setCapacidad] = useState('6')
  const [carga,     setCarga]     = useState('')
  const [agenciaId, setAgenciaId] = useState('')
  const [estado,    setEstado]    = useState<EstadoVehiculo>('activo')

  useEffect(() => {
    cargarAgenciasActivas()
  }, [])

  useEffect(() => {
    if (vehiculo) {
      setPlaca(vehiculo.placa)
      setMarca(vehiculo.marca ?? '')
      setModelo(vehiculo.modelo ?? '')
      setAnio(vehiculo.anio?.toString() ?? '')
      setTipo(vehiculo.tipo)
      setCapacidad(vehiculo.capacidad_pasajeros.toString())
      setCarga(vehiculo.capacidad_carga_kg?.toString() ?? '')
      setAgenciaId(vehiculo.agencia_id)
      setEstado(vehiculo.estado)
    } else {
      setPlaca(''); setMarca(''); setModelo(''); setAnio('')
      setTipo('duster'); setCapacidad('6'); setCarga('')
      setAgenciaId(''); setEstado('activo')
    }
    setError('')
  }, [vehiculo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!placa.trim()) return setError('La placa es requerida')
    if (!agenciaId)    return setError('Selecciona una agencia')
    if (!capacidad)    return setError('La capacidad es requerida')

    const ok = await onGuardar({
      placa:               placa.trim().toUpperCase(),
      marca:               marca.trim(),
      modelo:              modelo.trim(),
      anio,
      tipo,
      capacidad_pasajeros: capacidad,
      capacidad_carga_kg:  carga,
      agencia_id:          agenciaId,
      estado,
    })
    if (ok) onCerrar()
  }

  return (
    <Dialog open onOpenChange={onCerrar}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {esEdicion ? 'Editar vehículo' : 'Nuevo vehículo'}
              </DialogTitle>
              <DialogDescription>
                {esEdicion ? `Editando: ${vehiculo.placa}` : 'Registra un nuevo vehículo'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Agencia ── */}
          <div className="space-y-1.5">
            <Label>Agencia <span className="text-destructive">*</span></Label>
            <Select value={agenciaId} onValueChange={setAgenciaId}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Selecciona una agencia" />
              </SelectTrigger>
              <SelectContent>
                {agenciasActivas.map(a => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.nombre} ({a.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* ── Identificación ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Identificación
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Placa <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="ABC123"
                    value={placa}
                    onChange={e => setPlaca(e.target.value.toUpperCase())}
                    className="pl-9 font-mono uppercase"
                    maxLength={6}
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Tipo <span className="text-destructive">*</span></Label>
                <Select value={tipo} onValueChange={v => setTipo(v as TipoVehiculo)}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(TIPO_LABELS) as [TipoVehiculo, string][]).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Marca</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="Renault" value={marca}
                    onChange={e => setMarca(e.target.value)} className="pl-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Modelo</Label>
                <Input placeholder="Duster" value={modelo}
                  onChange={e => setModelo(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label>Año</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="2022" value={anio} type="number"
                    onChange={e => setAnio(e.target.value)} className="pl-9"
                    min="2000" max="2030" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Capacidad ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Capacidad
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Pasajeros <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="6" value={capacidad} type="number"
                    onChange={e => setCapacidad(e.target.value)}
                    className="pl-9" min="1" max="20" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Carga (kg)</Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="500" value={carga} type="number"
                    onChange={e => setCarga(e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Estado ── */}
          <div className="space-y-1.5">
            <Label>Estado</Label>
            <Select value={estado} onValueChange={v => setEstado(v as EstadoVehiculo)}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="mantenimiento">En mantenimiento</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCerrar} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando} className="flex-1">
              {cargando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear vehículo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}