import { useState, useEffect } from 'react'
import { Building2, Hash, Phone, MapPin } from 'lucide-react'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Input }   from '@/components/ui/input'
import { Label }   from '@/components/ui/label'
import { Button }  from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useRegionesStore } from '@/features/regiones/regionesStore'
import type { Agencia } from './agenciasStore'

interface Props {
  agencia?: Agencia | null
  onGuardar: (datos: {
    nombre: string; codigo: string
    telefono: string; direccion: string; region_id: string
  }) => Promise<boolean>
  onCerrar: () => void
  cargando: boolean
}

export function ModalAgencia({ agencia, onGuardar, onCerrar, cargando }: Props) {
  const esEdicion = !!agencia

  const { regionesActivas, cargarRegionesActivas } = useRegionesStore()

  const [nombre,    setNombre]    = useState('')
  const [codigo,    setCodigo]    = useState('')
  const [telefono,  setTelefono]  = useState('')
  const [direccion, setDireccion] = useState('')
  const [regionId,  setRegionId]  = useState('')
  const [error,     setError]     = useState('')

  useEffect(() => {
    cargarRegionesActivas()
  }, [])

  useEffect(() => {
    if (agencia) {
      setNombre(agencia.nombre)
      setCodigo(agencia.codigo)
      setTelefono(agencia.telefono ?? '')
      setDireccion(agencia.direccion ?? '')
      setRegionId(agencia.region_id)
    } else {
      setNombre(''); setCodigo('')
      setTelefono(''); setDireccion(''); setRegionId('')
    }
    setError('')
  }, [agencia])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) return setError('El nombre es requerido')
    if (!codigo.trim()) return setError('El código es requerido')
    if (!regionId)      return setError('Selecciona una región')

    const ok = await onGuardar({
      nombre:    nombre.trim(),
      codigo:    codigo.trim().toUpperCase(),
      telefono:  telefono.trim(),
      direccion: direccion.trim(),
      region_id: regionId,
    })
    if (ok) onCerrar()
  }

  return (
    <Dialog open onOpenChange={onCerrar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {esEdicion ? 'Editar agencia' : 'Nueva agencia'}
              </DialogTitle>
              <DialogDescription>
                {esEdicion ? `Editando: ${agencia.nombre}` : 'Completa los datos de la agencia'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Región */}
          <div className="space-y-1.5">
            <Label>Región <span className="text-destructive">*</span></Label>
            <Select value={regionId} onValueChange={setRegionId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una región" />
              </SelectTrigger>
              <SelectContent>
                {regionesActivas.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.nombre} ({r.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nombre */}
          <div className="space-y-1.5">
            <Label>Nombre <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Ej: Agencia Puerto Gaitán"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>

          {/* Código */}
          <div className="space-y-1.5">
            <Label>Código <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Ej: AGP-01"
                value={codigo}
                onChange={e => setCodigo(e.target.value.toUpperCase())}
                className="pl-9 font-mono uppercase"
                maxLength={10}
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="300 000 0000"
                value={telefono}
                type="tel"
                onChange={e => setTelefono(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-1.5">
            <Label>Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Calle principal, Puerto Gaitán"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCerrar} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando} className="flex-1">
              {cargando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear agencia'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}