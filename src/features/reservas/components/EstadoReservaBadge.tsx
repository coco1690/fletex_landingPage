import { Badge } from '@/components/ui/badge'
import { cn }    from '@/lib/utils'
import type { Database } from '@/supabase/types'

type EstadoReserva = Database['public']['Enums']['estado_reserva']
type EstadoPago    = Database['public']['Enums']['estado_pago']

const RESERVA_CONFIG: Record<EstadoReserva, { label: string; cls: string }> = {
  reservada:  { label: 'Reservada',  cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  abordada:   { label: 'Abordada',   cls: 'bg-success/10 text-success border-success/20' },
  no_show:    { label: 'No show',    cls: 'bg-warning/10 text-warning border-warning/20' },
  cancelada:  { label: 'Cancelada',  cls: 'bg-destructive/10 text-destructive border-destructive/20' },
}

const PAGO_CONFIG: Record<EstadoPago, { label: string; cls: string }> = {
  pendiente: { label: 'Pago pendiente', cls: 'bg-warning/10 text-warning border-warning/20' },
  pagado:    { label: 'Pagado',         cls: 'bg-success/10 text-success border-success/20' },
  fallido:   { label: 'Pago fallido',   cls: 'bg-destructive/10 text-destructive border-destructive/20' },
  expirado:  { label: 'Expirado',       cls: 'bg-secondary text-muted-foreground border-border' },
}

export function EstadoReservaBadge({ estado }: { estado: EstadoReserva }) {
  const { label, cls } = RESERVA_CONFIG[estado]
  return <Badge variant="outline" className={cn('whitespace-nowrap', cls)}>{label}</Badge>
}

export function EstadoPagoBadge({ estado }: { estado: EstadoPago }) {
  const { label, cls } = PAGO_CONFIG[estado]
  return <Badge variant="outline" className={cn('whitespace-nowrap text-[10px]', cls)}>{label}</Badge>
}