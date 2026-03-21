import { useState } from 'react'
import { XCircle, FileText } from 'lucide-react'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Label }   from '@/components/ui/label'
import { Button }  from '@/components/ui/button'
import type { Viaje } from './viajesStore'

interface Props {
  viaje:     Viaje
  onConfirmar: (motivo: string) => Promise<boolean>
  onCerrar:  () => void
  cargando:  boolean
}

export function ModalCancelarViaje({ viaje, onConfirmar, onCerrar, cargando }: Props) {
  const [motivo, setMotivo] = useState('')
  const [error,  setError]  = useState('')

  const handleConfirmar = async () => {
    setError('')
    if (!motivo.trim()) return setError('El motivo es requerido')
    const ok = await onConfirmar(motivo.trim())
    if (ok) onCerrar()
    else setError('Error al cancelar el viaje')
  }

  return (
    <Dialog open onOpenChange={onCerrar}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-destructive/10 rounded-xl flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <DialogTitle>Cancelar viaje</DialogTitle>
              <DialogDescription>Esta acción notificará a los pasajeros</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">

          {/* Info viaje */}
          <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
            <p className="text-[10px] text-muted-foreground">Viaje a cancelar</p>
            <p className="text-sm font-semibold text-foreground">
              {viaje.ruta?.nombre ?? '—'}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {new Date(viaje.hora_salida_programada).toLocaleString('es-CO', {
                weekday: 'short', day: 'numeric', month: 'short',
                hour: '2-digit', minute: '2-digit',
              })}
              {' · '}{viaje.cupos_reservados} reservas activas
            </p>
          </div>

          {/* Motivo */}
          <div className="space-y-1.5">
            <Label>Motivo de cancelación <span className="text-destructive">*</span></Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
              <textarea
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Explica el motivo de la cancelación..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none pl-9"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCerrar} className="flex-1">
              Volver
            </Button>
            <Button
              onClick={handleConfirmar}
              disabled={cargando || !motivo.trim()}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
            >
              {cargando ? 'Cancelando...' : 'Cancelar viaje'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}