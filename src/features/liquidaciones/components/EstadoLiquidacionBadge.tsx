import { Badge } from '@/components/ui/badge'
import { cn }    from '@/lib/utils'
import type { Database } from '@/supabase/types'

type EstadoLiquidacion = Database['public']['Enums']['estado_liquidacion']

const CONFIG: Record<EstadoLiquidacion, { label: string; cls: string }> = {
  pendiente:  { label: 'Pendiente',  cls: 'bg-warning/10 text-warning border-warning/20' },
  pagado:     { label: 'Pagado',     cls: 'bg-success/10 text-success border-success/20' },
  en_disputa: { label: 'En disputa', cls: 'bg-destructive/10 text-destructive border-destructive/20' },
}

export function EstadoLiquidacionBadge({ estado }: { estado: EstadoLiquidacion }) {
  const { label, cls } = CONFIG[estado]
  return <Badge variant="outline" className={cn('whitespace-nowrap', cls)}>{label}</Badge>
}
