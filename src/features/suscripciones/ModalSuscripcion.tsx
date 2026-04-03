import { useState, useEffect } from 'react'
import { CreditCard, DollarSign, Calendar, FileText, Hash } from 'lucide-react'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Input }     from '@/components/ui/input'
import { Label }     from '@/components/ui/label'
import { Button }    from '@/components/ui/button'
import { Switch }    from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import type { PlanSuscripcion } from './suscripcionesStore'
import type { Database } from '@/supabase/types'

type PlanInsert = Database['public']['Tables']['planes_suscripcion']['Insert']
type PlanUpdate = Database['public']['Tables']['planes_suscripcion']['Update']

interface Props {
  plan?: PlanSuscripcion | null
  onGuardar: (datos: PlanInsert) => Promise<boolean>
  onActualizar: (id: string, datos: PlanUpdate) => Promise<boolean>
  onCerrar: () => void
  cargando: boolean
  usuarioId: string
}

export function ModalSuscripcion({
  plan, onGuardar, onActualizar, onCerrar, cargando, usuarioId,
}: Props) {
  const esEdicion = !!plan

  const [nombre, setNombre]             = useState('')
  const [precio, setPrecio]             = useState('')
  const [duracionDias, setDuracionDias] = useState('30')
  const [moneda, setMoneda]             = useState('COP')
  const [descripcion, setDescripcion]   = useState('')
  const [incluyePlanilla, setIncluyePlanilla] = useState(false)
  const [activo, setActivo]             = useState(true)
  const [error, setError]               = useState('')

  useEffect(() => {
    if (plan) {
      setNombre(plan.nombre)
      setPrecio(String(plan.precio))
      setDuracionDias(String(plan.duracion_dias))
      setMoneda(plan.moneda)
      setDescripcion(plan.descripcion ?? '')
      setIncluyePlanilla(plan.incluye_planilla)
      setActivo(plan.activo)
    } else {
      setNombre(''); setPrecio(''); setDuracionDias('30')
      setMoneda('COP'); setDescripcion(''); setIncluyePlanilla(false); setActivo(true)
    }
    setError('')
  }, [plan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) return setError('El nombre es requerido')
    if (!precio || Number(precio) <= 0) return setError('El precio debe ser mayor a 0')
    if (!duracionDias || Number(duracionDias) <= 0) return setError('La duración debe ser mayor a 0')

    let ok: boolean
    if (esEdicion) {
      ok = await onActualizar(plan.id, {
        nombre: nombre.trim(),
        precio: Number(precio),
        duracion_dias: Number(duracionDias),
        moneda: moneda.trim(),
        descripcion: descripcion.trim() || null,
        incluye_planilla: incluyePlanilla,
        activo,
      })
    } else {
      ok = await onGuardar({
        nombre: nombre.trim(),
        precio: Number(precio),
        duracion_dias: Number(duracionDias),
        moneda: moneda.trim(),
        descripcion: descripcion.trim() || null,
        incluye_planilla: incluyePlanilla,
        activo,
        creado_por: usuarioId,
      })
    }
    if (ok) onCerrar()
  }

  return (
    <Dialog open onOpenChange={onCerrar}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {esEdicion ? 'Editar plan' : 'Nuevo plan de suscripción'}
              </DialogTitle>
              <DialogDescription>
                {esEdicion ? plan.nombre : 'Configura los detalles del plan'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Información del plan ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Información del plan
            </p>

            <div className="space-y-1.5">
              <Label>Nombre <span className="text-destructive">*</span></Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Plan Mensual"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="Descripción del plan..."
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none pl-9"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Precio y duración ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Precio y duración
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Precio <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="50000"
                    value={precio}
                    type="number"
                    min="0"
                    onChange={e => setPrecio(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Moneda</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="COP"
                    value={moneda}
                    onChange={e => setMoneda(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Duración (días) <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="30"
                  value={duracionDias}
                  type="number"
                  min="1"
                  onChange={e => setDuracionDias(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Opciones ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Opciones
            </p>

            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-foreground">Incluye planilla</p>
                <p className="text-xs text-muted-foreground">El conductor puede generar planillas</p>
              </div>
              <Switch checked={incluyePlanilla} onCheckedChange={setIncluyePlanilla} />
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-foreground">Activo</p>
                <p className="text-xs text-muted-foreground">Disponible para nuevas suscripciones</p>
              </div>
              <Switch checked={activo} onCheckedChange={setActivo} />
            </div>
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
              {cargando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear plan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
