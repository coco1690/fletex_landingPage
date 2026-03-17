import { Car, XCircle, CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Database } from '@/supabase/types'

type EstadoViaje = Database['public']['Enums']['estado_viaje']

export const ESTADO_CONFIG: Record<EstadoViaje, { label: string; cls: string; icon: React.ReactNode }> = {
  programado: {
    label: 'Programado',
    cls:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon:  <CalendarDays className="w-3 h-3" />,
  },
  abordando: {
    label: 'Abordando',
    cls:   'bg-warning/10 text-warning border-warning/20',
    icon:  <AlertCircle className="w-3 h-3" />,
  },
  en_curso: {
    label: 'En curso',
    cls:   'bg-primary/10 text-primary border-primary/20',
    icon:  <Car className="w-3 h-3" />,
  },
  completado: {
    label: 'Completado',
    cls:   'bg-success/10 text-success border-success/20',
    icon:  <CheckCircle2 className="w-3 h-3" />,
  },
  cancelado: {
    label: 'Cancelado',
    cls:   'bg-destructive/10 text-destructive border-destructive/20',
    icon:  <XCircle className="w-3 h-3" />,
  },
}

export function EstadoViajeBadge({ estado }: { estado: EstadoViaje }) {
  const { label, cls, icon } = ESTADO_CONFIG[estado]
  return (
    <Badge variant="outline" className={cn('flex items-center gap-1 whitespace-nowrap', cls)}>
      {icon}{label}
    </Badge>
  )
}