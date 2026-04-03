import { useState, useEffect } from 'react'
import { Percent } from 'lucide-react'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useRegionesStore } from '@/features/regiones/regionesStore'
import type { Comision, ActualizarComisionParams } from './comisionesStore'

interface Props {
  comision?: Comision | null
  onGuardar: (params: ActualizarComisionParams) => Promise<boolean>
  onCerrar: () => void
  cargando: boolean
  usuarioId: string
}

export function ModalComision({ comision, onGuardar, onCerrar, cargando, usuarioId }: Props) {
  const esEdicion = !!comision

  const { regionesActivas, cargarRegionesActivas } = useRegionesStore()

  const [tipoServicio, setTipoServicio] = useState<'pasajero' | 'encomienda'>('pasajero')
  const [porcentaje, setPorcentaje]     = useState('')
  const [regionId, setRegionId]         = useState('')
  const [error, setError]               = useState('')

  useEffect(() => {
    cargarRegionesActivas()
  }, [])

  useEffect(() => {
    if (comision) {
      setTipoServicio(comision.tipo_servicio)
      setPorcentaje(String(comision.porcentaje))
      setRegionId(comision.region_id ?? '')
    } else {
      setTipoServicio('pasajero')
      setPorcentaje('')
      setRegionId('')
    }
    setError('')
  }, [comision])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!regionId) return setError('Selecciona una región')
    if (!porcentaje || Number(porcentaje) < 0 || Number(porcentaje) > 100) {
      return setError('El porcentaje debe estar entre 0 y 100')
    }

    const ok = await onGuardar({
      p_region_id: regionId,
      p_tipo_servicio: tipoServicio,
      p_porcentaje: Number(porcentaje),
      p_modificado_por: usuarioId,
    })
    if (ok) onCerrar()
  }

  return (
    <Dialog open onOpenChange={onCerrar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {esEdicion ? 'Editar comisión' : 'Nueva comisión'}
              </DialogTitle>
              <DialogDescription>
                {esEdicion
                  ? `${comision.tipo_servicio === 'encomienda' ? 'Encomienda' : 'Pasajero'} — ${comision.region?.nombre ?? 'Global'}`
                  : 'Configura el porcentaje de comisión'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Configuración
            </p>

            <div className="space-y-1.5">
              <Label>Tipo de servicio <span className="text-destructive">*</span></Label>
              <Select
                value={tipoServicio}
                onValueChange={(v) => setTipoServicio(v as 'pasajero' | 'encomienda')}
                disabled={esEdicion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pasajero">Pasajero</SelectItem>
                  <SelectItem value="encomienda">Encomienda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Región <span className="text-destructive">*</span></Label>
              <Select
                value={regionId}
                onValueChange={setRegionId}
                disabled={esEdicion}
              >
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
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Porcentaje
            </p>

            <div className="space-y-1.5">
              <Label>Porcentaje de comisión <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="10"
                  value={porcentaje}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  onChange={e => setPorcentaje(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Porcentaje que se cobra como comisión por cada {tipoServicio === 'encomienda' ? 'encomienda' : 'pasajero'}
              </p>
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
              {cargando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear comisión'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
