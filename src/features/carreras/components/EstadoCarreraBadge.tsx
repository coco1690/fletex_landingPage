import type { EstadoCarrera } from '@/types'

const CONFIG: Record<EstadoCarrera, { label: string; clase: string }> = {
  pendiente:  { label: 'Pendiente',  clase: 'bg-warning/10 text-warning border-warning/20' },
  aceptada:   { label: 'Aceptada',   clase: 'bg-info/10 text-info border-info/20' },
  en_curso:   { label: 'En curso',   clase: 'bg-primary/10 text-primary border-primary/20' },
  completada: { label: 'Completada', clase: 'bg-success/10 text-success border-success/20' },
  cancelada:  { label: 'Cancelada',  clase: 'bg-destructive/10 text-destructive border-destructive/20' },
}

export function EstadoCarreraBadge({ estado }: { estado: EstadoCarrera }) {
  const c = CONFIG[estado] ?? CONFIG.pendiente
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.clase}`}>
      {c.label}
    </span>
  )
}
