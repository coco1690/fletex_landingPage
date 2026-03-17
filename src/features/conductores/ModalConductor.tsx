import { useState, useEffect } from 'react'
import { User, Phone, Mail, Hash, Calendar } from 'lucide-react'
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
import type { Conductor, CrearConductorParams } from './conductoresStore'

interface Props {
  conductor?: Conductor | null
  onGuardar:    (datos: CrearConductorParams) => Promise<boolean>
  onActualizar: (datos: Partial<Conductor>)   => Promise<boolean>
  onCerrar:  () => void
  cargando:  boolean
}

export function ModalConductor({ conductor, onGuardar, onActualizar, onCerrar, cargando }: Props) {
  const esEdicion = !!conductor

  const { agenciasActivas, cargarAgenciasActivas } = useAgenciasStore()

  const [nombre,    setNombre]    = useState('')
  const [telefono,  setTelefono]  = useState('')
  const [email,     setEmail]     = useState('')
  const [agenciaId, setAgenciaId] = useState('')
  const [licencia,  setLicencia]  = useState('')
  const [categoria, setCategoria] = useState('C2')
  const [venceLic,  setVenceLic]  = useState('')
  const [nequi,     setNequi]     = useState('')
  const [error,     setError]     = useState('')

  useEffect(() => {
    cargarAgenciasActivas()
  }, [])

  useEffect(() => {
    if (conductor) {
      setNombre(conductor.usuario?.nombre ?? '')
      setTelefono(conductor.usuario?.telefono ?? '')
      setEmail(conductor.usuario?.email ?? '')
      setAgenciaId(conductor.agencia_id)
      setLicencia(conductor.numero_licencia)
      setCategoria(conductor.categoria_licencia)
      setVenceLic(conductor.fecha_vencimiento_licencia.split('T')[0])
      setNequi(conductor.numero_nequi ?? '')
    } else {
      setNombre(''); setTelefono(''); setEmail('')
      setAgenciaId(''); setLicencia('')
      setCategoria('C2'); setVenceLic(''); setNequi('')
    }
    setError('')
  }, [conductor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!nombre.trim()   && !esEdicion) return setError('El nombre es requerido')
    if (!telefono.trim() && !esEdicion) return setError('El teléfono es requerido')
    if (!agenciaId)                     return setError('Selecciona una agencia')
    if (!licencia.trim())               return setError('El número de licencia es requerido')
    if (!venceLic)                      return setError('La fecha de vencimiento es requerida')

    let ok: boolean
    if (esEdicion) {
      ok = await onActualizar({
        agencia_id:                 agenciaId,
        numero_licencia:            licencia.trim(),
        categoria_licencia:         categoria,
        fecha_vencimiento_licencia: venceLic,
        numero_nequi:               nequi.trim() || null,
      })
    } else {
      ok = await onGuardar({
        nombre:                     nombre.trim(),
        telefono:                   telefono.trim(),
        email:                      email.trim() || undefined,
        agencia_id:                 agenciaId,
        numero_licencia:            licencia.trim(),
        categoria_licencia:         categoria,
        fecha_vencimiento_licencia: venceLic,
        numero_nequi:               nequi.trim() || undefined,
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
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {esEdicion ? 'Editar conductor' : 'Nuevo conductor'}
              </DialogTitle>
              <DialogDescription>
                {esEdicion ? conductor.usuario?.nombre : 'Completa los datos del conductor'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Datos personales — solo creación ── */}
          {!esEdicion && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Datos personales
              </p>

              <div className="space-y-1.5">
                <Label>Nombre completo <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="Juan Pérez" value={nombre}
                    onChange={e => setNombre(e.target.value)} className="pl-9" autoFocus />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Teléfono <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="3001234567" value={telefono} type="tel"
                    onChange={e => setTelefono(e.target.value)} className="pl-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="conductor@email.com" value={email} type="email"
                    onChange={e => setEmail(e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>
          )}

          {!esEdicion && <Separator />}

          {/* ── Agencia ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Agencia
            </p>
            <div className="space-y-1.5">
              <Label>Agencia <span className="text-destructive">*</span></Label>
              <Select value={agenciaId} onValueChange={setAgenciaId}>
                <SelectTrigger>
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
          </div>

          <Separator />

          {/* ── Licencia ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Licencia de conducción
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Número <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="123456789" value={licencia}
                    onChange={e => setLicencia(e.target.value)} className="pl-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Categoría <span className="text-destructive">*</span></Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['B1', 'B2', 'B3', 'C1', 'C2', 'C3'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Fecha de vencimiento <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input type="date" value={venceLic}
                  onChange={e => setVenceLic(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Nequi ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pago
            </p>
            <div className="space-y-1.5">
              <Label>Número Nequi</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="3001234567" value={nequi} type="tel"
                  onChange={e => setNequi(e.target.value)} className="pl-9" />
              </div>
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
              {cargando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear conductor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}