import { useState, useEffect } from 'react'
import { UserCog, X } from 'lucide-react'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useAgenciasStore, type Agencia } from './agenciasStore'

interface Props {
  agencia:   Agencia
  onCerrar:  () => void
  cargando:  boolean
}

export function ModalAsignarEncargado({ agencia, onCerrar, cargando }: Props) {
  const {
    encargadosDisponibles,
    cargandoEncargados,
    cargarEncargadosDisponibles,
    asignarEncargado,
  } = useAgenciasStore()

  const [encargadoId, setEncargadoId] = useState('')
  const [error,       setError]       = useState('')

  const encargadoActual = (agencia as any).encargado?.nombre ?? null

  useEffect(() => {
    cargarEncargadosDisponibles(agencia.id)
  }, [])

  useEffect(() => {
    if (agencia.encargado_id && encargadosDisponibles.length > 0) {
      const actual = encargadosDisponibles.find(e => e.id === agencia.encargado_id)
      if (actual) setEncargadoId(actual.id)
    }
  }, [encargadosDisponibles])

  const handleGuardar = async () => {
    setError('')
    try {
      const ok = await asignarEncargado(agencia.id, encargadoId || null)
      if (ok) {
        onCerrar()
      } else {
        setError('Error al asignar el encargado')
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleDesasignar = async () => {
    setError('')
    try {
      const ok = await asignarEncargado(agencia.id, null)
      if (ok) {
        onCerrar()
      } else {
        setError('Error al quitar el encargado')
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  const encargadoSeleccionado = encargadosDisponibles.find(e => e.id === encargadoId)

  return (
    <Dialog open onOpenChange={onCerrar}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <UserCog className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Asignar encargado</DialogTitle>
              <DialogDescription>
                Agencia <span className="font-semibold">{agencia.nombre}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">

          {/* Encargado actual */}
          <div className="bg-secondary/50 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground mb-0.5">Encargado actual</p>
            <p className="text-sm font-semibold text-foreground">
              {encargadoActual ?? 'Sin encargado asignado'}
            </p>
          </div>

          {/* Select encargado */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Nuevo encargado</p>

            {cargandoEncargados ? (
              <div className="h-9 bg-secondary animate-pulse rounded-lg" />
            ) : encargadosDisponibles.length === 0 ? (
              <div className="bg-warning/10 border border-warning/20 rounded-xl px-3 py-2.5">
                <p className="text-xs text-warning font-medium">
                  No hay encargados disponibles. Crea un usuario con rol encargado_agencia primero.
                </p>
              </div>
            ) : (
              <Select value={encargadoId} onValueChange={setEncargadoId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un encargado" />
                </SelectTrigger>
                <SelectContent>
                  {encargadosDisponibles.map(e => (
                    <SelectItem key={e.id} value={e.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{e.nombre}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {e.email ?? 'Sin email'}
                          {e.agencia_actual && ' · Ya tiene agencia asignada'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Advertencia si ya tiene agencia */}
          {encargadoSeleccionado?.agencia_actual && (
            <div className="bg-warning/10 border border-warning/20 rounded-xl px-3 py-2">
              <p className="text-xs text-warning">
                Este encargado ya tiene una agencia asignada. Al continuar se reasignará a esta agencia.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2 pt-1">
            {encargadoActual && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDesasignar}
                disabled={cargando}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Quitar
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onCerrar}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleGuardar}
              disabled={cargando || !encargadoId || cargandoEncargados}
              className="flex-1"
            >
              {cargando ? 'Asignando...' : 'Asignar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}