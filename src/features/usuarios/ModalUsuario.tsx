import { useState, useEffect } from 'react'
import { User, Phone, Mail, Lock } from 'lucide-react'
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
import { useRegionesStore }  from '@/features/regiones/regionesStore'
import { useAgenciasStore }  from '@/features/agencias/agenciasStore'
import type { Usuario, CrearUsuarioParams } from './usuariosStore'
import type { Database } from '@/supabase/types'

type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update']

interface Props {
  usuario?:     Usuario | null
  onGuardar:    (datos: CrearUsuarioParams) => Promise<boolean>
  onActualizar: (id: string, datos: UsuarioUpdate) => Promise<boolean>
  onCerrar:     () => void
  cargando:     boolean
}

export function ModalUsuario({ usuario, onGuardar, onActualizar, onCerrar, cargando }: Props) {
  const esEdicion = !!usuario

  const { regionesActivas, cargarRegionesActivas } = useRegionesStore()
  const { agenciasActivas, cargarAgenciasActivas } = useAgenciasStore()

  const [nombre,    setNombre]    = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [telefono,  setTelefono]  = useState('')
  const [rol,       setRol]       = useState('')
  const [regionId,  setRegionId]  = useState('')
  const [agenciaId, setAgenciaId] = useState('')
  const [error,     setError]     = useState('')

  useEffect(() => {
    cargarRegionesActivas()
    cargarAgenciasActivas()
  }, [])

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre)
      setEmail(usuario.email ?? '')
      setTelefono(usuario.telefono ?? '')
      setRol(usuario.rol)
      setRegionId(usuario.region_id ?? '')
      setAgenciaId(usuario.agencia_id ?? '')
      setPassword('')
    } else {
      setNombre(''); setEmail(''); setPassword('')
      setTelefono(''); setRol(''); setRegionId(''); setAgenciaId('')
    }
    setError('')
  }, [usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nombre.trim())              return setError('El nombre es requerido')
    if (!email.trim())               return setError('El email es requerido')
    if (!esEdicion && !password)     return setError('La contraseña es requerida')
    if (!esEdicion && password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')
    if (!rol)                        return setError('Selecciona un rol')

    let ok: boolean
    if (esEdicion) {
      ok = await onActualizar(usuario.id, {
        nombre:     nombre.trim(),
        email:      email.trim(),
        telefono:   telefono.trim() || null,
        rol:        rol as Database['public']['Enums']['rol_usuario'],
        region_id:  regionId || null,
        agencia_id: agenciaId || null,
      })
    } else {
      ok = await onGuardar({
        nombre:     nombre.trim(),
        email:      email.trim(),
        password,
        telefono:   telefono.trim() || undefined,
        rol:        rol as Database['public']['Enums']['rol_usuario'],
        region_id:  regionId || undefined,
        agencia_id: agenciaId || undefined,
      })
    }
    if (ok) onCerrar()
  }

  // roles que necesitan región/agencia
  const necesitaRegion  = ['admin_regional', 'encargado_agencia', 'conductor', 'moto_taxi'].includes(rol)
  const necesitaAgencia = ['encargado_agencia', 'conductor', 'moto_taxi'].includes(rol)

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
                {esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
              </DialogTitle>
              <DialogDescription>
                {esEdicion ? usuario.nombre : 'Completa los datos del usuario'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Datos personales ── */}
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
              <Label>Email <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="usuario@email.com" value={email} type="email"
                  onChange={e => setEmail(e.target.value)} className="pl-9" />
              </div>
            </div>

            {!esEdicion && (
              <div className="space-y-1.5">
                <Label>Contraseña <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="Mínimo 6 caracteres" value={password} type="password"
                    onChange={e => setPassword(e.target.value)} className="pl-9" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="3001234567" value={telefono} type="tel"
                  onChange={e => setTelefono(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Rol y asignación ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rol y asignación
            </p>

            <div className="space-y-1.5">
              <Label>Rol <span className="text-destructive">*</span></Label>
              <Select value={rol} onValueChange={(v) => { setRol(v); setRegionId(''); setAgenciaId('') }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin_regional">Admin Regional</SelectItem>
                  <SelectItem value="encargado_agencia">Encargado de Agencia</SelectItem>
                  <SelectItem value="conductor">Conductor</SelectItem>
                  <SelectItem value="moto_taxi">Moto Taxi</SelectItem>
                  <SelectItem value="pasajero">Pasajero</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {necesitaRegion && (
              <div className="space-y-1.5">
                <Label>Región {necesitaRegion && <span className="text-destructive">*</span>}</Label>
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
            )}

            {necesitaAgencia && (
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
            )}
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
              {cargando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
