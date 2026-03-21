import { useState, useEffect } from 'react'
import { DollarSign, Hash, Calendar, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useConductoresStore } from './conductoresStore'
import type { Conductor, RegistrarPagoParams } from './conductoresStore'

interface Props {
  conductor: Conductor
  onGuardar: (datos: RegistrarPagoParams) => Promise<boolean>
  onCerrar: () => void
  cargando: boolean
}

export function ModalPago({ conductor, onGuardar, onCerrar, cargando }: Props) {
  const { planes, cargarPlanes } = useConductoresStore()
  const [planId, setPlanId]         = useState('')
  const [valor, setValor]           = useState('')
  const [referencia, setReferencia] = useState('')
  const [fechaPago, setFechaPago]   = useState(new Date().toISOString().split('T')[0])
  const [observaciones, setObs]     = useState('')
  const [error, setError]           = useState('')

  useEffect(() => {
    cargarPlanes()
  }, [cargarPlanes])

  useEffect(() => {
    if (planes.length > 0 && !planId) {
      setPlanId(planes[0].id)
      setValor(String(planes[0].precio))
    }
  }, [planes, planId])

  const handlePlanChange = (id: string) => {
    setPlanId(id)
    const plan = planes.find(p => p.id === id)
    if (plan) setValor(String(plan.precio))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!planId)            return setError('Selecciona un plan')
    if (!valor)             return setError('El valor es requerido')
    if (!referencia.trim()) return setError('La referencia Nequi es requerida')
    if (!fechaPago)         return setError('La fecha de pago es requerida')

    const ok = await onGuardar({
      conductor_id:     conductor.id,
      plan_id:          planId,
      valor_pagado:     Number(valor),
      referencia_nequi: referencia.trim(),
      fecha_pago:       fechaPago,
      observaciones:    observaciones.trim() || undefined,
    })
    if (ok) onCerrar()
  }

  return (
    <Dialog open onOpenChange={onCerrar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 text-success" />
            </div>
            <div>
              <DialogTitle>Registrar pago</DialogTitle>
              <DialogDescription>{conductor.usuario?.nombre}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Info conductor */}
          <div className="bg-secondary/50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">
                {conductor.usuario?.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{conductor.usuario?.nombre}</p>
              <p className="text-[10px] text-muted-foreground">
                {conductor.agencia?.nombre} · {conductor.numero_licencia}
              </p>
            </div>
          </div>

          <Separator />

          {/* Planes */}
          <div className="space-y-2">
            <Label>Plan <span className="text-destructive">*</span></Label>
            <div className="grid gap-2">
              {planes.map(plan => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handlePlanChange(plan.id)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all',
                    planId === plan.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 bg-background'
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{plan.nombre}</p>
                    <p className="text-[10px] text-muted-foreground">{plan.duracion_dias} días</p>
                  </div>
                  <p className="text-sm font-black text-primary">
                    ${plan.precio.toLocaleString('es-CO')}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Valor */}
          <div className="space-y-1.5">
            <Label>Valor pagado <span className="text-destructive">*</span></Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input type="number" value={valor}
                onChange={e => setValor(e.target.value)} className="pl-9" />
            </div>
          </div>

          {/* Referencia */}
          <div className="space-y-1.5">
            <Label>Referencia Nequi <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Ej: TRX-123456" value={referencia}
                onChange={e => setReferencia(e.target.value)} className="pl-9" />
            </div>
          </div>

          {/* Fecha */}
          <div className="space-y-1.5">
            <Label>Fecha de pago <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input type="date" value={fechaPago}
                onChange={e => setFechaPago(e.target.value)} className="pl-9" />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-1.5">
            <Label>Observaciones</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
              <textarea
                value={observaciones}
                onChange={e => setObs(e.target.value)}
                rows={2}
                placeholder="Notas adicionales..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none pl-9"
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
            <Button type="submit" disabled={cargando}
              className="flex-1 bg-success hover:bg-success/90 text-white">
              {cargando ? 'Registrando...' : 'Registrar pago'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}