import { Badge } from '@/components/ui/badge'
import { cn }    from '@/lib/utils'
import type { Database } from '@/supabase/types'

type RolUsuario = Database['public']['Enums']['rol_usuario']

const CONFIG: Record<RolUsuario, { label: string; cls: string }> = {
  super_admin:      { label: 'Super Admin',      cls: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  admin_regional:   { label: 'Admin Regional',   cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  encargado_agencia:{ label: 'Encargado',         cls: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
  conductor:        { label: 'Conductor',         cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  pasajero:         { label: 'Pasajero',          cls: 'bg-secondary text-muted-foreground border-border' },
}

export function RolBadge({ rol }: { rol: RolUsuario }) {
  const { label, cls } = CONFIG[rol]
  return <Badge variant="outline" className={cn('whitespace-nowrap', cls)}>{label}</Badge>
}
