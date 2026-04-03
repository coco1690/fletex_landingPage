import { useState, useEffect } from 'react'
import { DollarSign, Hash, Calendar, FileText } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { ConductorOpcion, PlanOpcion, RegistrarPagoParams } from './pagosStore'

interface Props {
  conductores: ConductorOpcion[]
  planes: PlanOpcion[]
  onGuardar: (params: RegistrarPagoParams) => Promise<boolean>
  onCerrar: () => void
  cargando: boolean
  registradoPor: string
}

export function ModalPago({ conductores, planes, onGuardar, onCerrar, cargando, registradoPor }: Props) {
  const [conductorId, setConductorId]         = useState('')
  const [planId, setPlanId]                   = useState('')
  const [valorPagado, setValorPagado]         = useState('')
  const [referenciaNequi, setReferenciaNequi] = useState('')
  const [fechaPago, setFechaPago]             = useState(() => new Date().toISOString().slice(0, 10))
  const [observaciones, setObservaciones]     = useState('')
  const [error, setError]                     = useState('')

  const conductorSeleccionado = conductores.find(c => c.id === conductorId)
  const esMotoTaxi = conductorSeleccionado?.rol === 'moto_taxi'
  const rolLabel = esMotoTaxi ? 'Moto Taxi' : 'Conductor'

  // filtrar planes según el rol del conductor seleccionado
  const planesFiltrados = conductorId
    ? planes.filter(p => {
        const nombreLower = p.nombre.toLowerCase()
        if (esMotoTaxi) return nombreLower.includes('moto')
        return !nombreLower.includes('moto')
      })
    : planes

  // reset plan al cambiar conductor
  useEffect(() => {
    setPlanId('')
    setValorPagado('')
  }, [conductorId])

  useEffect(() => {
    const plan = planesFiltrados.find(p => p.id === planId)
    if (plan) setValorPagado(String(plan.precio))
  }, [planId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!conductorId) return setError('Selecciona un conductor')
    if (!planId) return setError('Selecciona un plan')
    if (!valorPagado || Number(valorPagado) <= 0) return setError('El valor pagado es requerido')
    if (!referenciaNequi.trim()) return setError('La referencia Nequi es requerida')
    if (!fechaPago) return setError('La fecha de pago es requerida')

    const ok = await onGuardar({
      p_conductor_id: conductorId,
      p_plan_id: planId,
      p_valor_pagado: Number(valorPagado),
      p_referencia_nequi: referenciaNequi.trim(),
      p_fecha_pago: fechaPago,
      p_registrado_por: registradoPor,
      p_observaciones: observaciones.trim() || undefined,
    })
    if (ok) onCerrar()
  }

  return (
    <Dialog open onOpenChange={onCerrar}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 text-success" />
            </div>
            <div>
              <DialogTitle>Registrar pago</DialogTitle>
              <DialogDescription>Registra el pago de suscripción de un conductor</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conductor y plan</p>

            <div className="space-y-1.5">
              <Label>Conductor <span className="text-destructive">*</span></Label>
              <Select value={conductorId} onValueChange={setConductorId}>
                <SelectTrigger><SelectValue placeholder="Selecciona un conductor" /></SelectTrigger>
                <SelectContent>
                  {conductores.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                      <span className="ml-2 text-[10px] text-muted-foreground">
                        ({c.rol === 'moto_taxi' ? 'Moto Taxi' : 'Conductor'})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Badge del rol seleccionado */}
            {conductorSeleccionado && (
              <div className="bg-secondary/50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {conductorSeleccionado.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{conductorSeleccionado.nombre}</p>
                </div>
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0',
                  esMotoTaxi
                    ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                )}>
                  {rolLabel}
                </span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Plan para {conductorId ? rolLabel : 'conductor'} <span className="text-destructive">*</span></Label>
              {conductorId && planesFiltrados.length === 0 ? (
                <div className="bg-warning/10 border border-warning/20 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-warning">
                    No hay planes disponibles para el rol {rolLabel}
                  </p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {planesFiltrados.map(plan => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setPlanId(plan.id)}
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
                      <p className="text-sm font-black text-primary">${plan.precio.toLocaleString('es-CO')}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Datos del pago</p>

            <div className="space-y-1.5">
              <Label>Valor pagado <span className="text-destructive">*</span></Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="50000" value={valorPagado} type="number" min="0"
                  onChange={e => setValorPagado(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Referencia Nequi <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="Ej: TRX-123456" value={referenciaNequi}
                  onChange={e => setReferenciaNequi(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Fecha de pago <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input type="date" value={fechaPago}
                  onChange={e => setFechaPago(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Observaciones</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
                <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)}
                  placeholder="Observaciones opcionales..." rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none pl-9" />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCerrar} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={cargando || (!!conductorId && planesFiltrados.length === 0)}
              className="flex-1 bg-success hover:bg-success/90 text-white">
              {cargando ? 'Registrando...' : 'Registrar pago'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
