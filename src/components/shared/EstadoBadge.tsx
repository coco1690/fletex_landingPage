import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const CONFIG = {
  activo:    { label: 'Activo',    cls: 'bg-success/10 text-success border-success/20 hover:bg-success/20' },
  inactivo:  { label: 'Inactivo',  cls: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20' },
  pendiente: { label: 'Pendiente', cls: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20' },
} as Record<string, { label: string; cls: string }>

interface Props {
  estado: string
  size?: 'sm' | 'md'
}

export function EstadoBadge({ estado, size = 'sm' }: Props) {
  const { label, cls } = CONFIG[estado] ?? {
    label: estado,
    cls: 'bg-secondary text-muted-foreground border-border',
  }
  return (
    <Badge
      variant="outline"
      className={cn(cls, size === 'md' && 'text-xs px-3 py-1')}
    >
      {label}
    </Badge>
  )
}

export function estadoConfig(estado: string) {
  return CONFIG[estado] ?? {
    label: estado,
    cls: 'bg-secondary text-muted-foreground border-border',
  }
}