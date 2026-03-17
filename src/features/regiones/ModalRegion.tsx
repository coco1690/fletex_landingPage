import { useState, useEffect } from 'react'
import { MapPin, Hash, Globe } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Region } from './regionesStore'

interface Props {
  region?: Region | null
  onGuardar: (datos: { nombre: string; codigo: string; pais: string }) => Promise<boolean>
  onCerrar: () => void
  cargando: boolean
}

export function ModalRegion({ region, onGuardar, onCerrar, cargando }: Props) {
  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [pais, setPais]     = useState('Colombia')
  const [error, setError]   = useState('')
  const esEdicion = !!region

  useEffect(() => {
    if (region) {
      setNombre(region.nombre)
      setCodigo(region.codigo)
      setPais(region.pais)
    } else {
      setNombre(''); setCodigo(''); setPais('Colombia')
    }
    setError('')
  }, [region])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) return setError('El nombre es requerido')
    if (!codigo.trim()) return setError('El código es requerido')
    const ok = await onGuardar({
      nombre: nombre.trim(),
      codigo: codigo.trim().toUpperCase(),
      pais: pais.trim(),
    })
    if (ok) onCerrar()
  }

  return (
    <Dialog open onOpenChange={onCerrar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle>{esEdicion ? 'Editar región' : 'Nueva región'}</DialogTitle>
              <DialogDescription>
                {esEdicion ? `Editando: ${region.nombre}` : 'Completa los datos de la región'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1.5">
            <Label htmlFor="nombre">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                id="nombre"
                placeholder="Ej: Llanos Orientales"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="codigo">
              Código <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                id="codigo"
                placeholder="Ej: META"
                value={codigo}
                onChange={e => setCodigo(e.target.value.toUpperCase())}
                maxLength={10}
                className="pl-9 font-mono uppercase"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">Código único, máximo 10 caracteres</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pais">País</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                id="pais"
                placeholder="Colombia"
                value={pais}
                onChange={e => setPais(e.target.value)}
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
              {cargando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear región'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}