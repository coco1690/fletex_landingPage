import type { EstadoPlanilla } from '@/types'

const CONFIG: Record<EstadoPlanilla, { label: string; clase: string }> = {
  generada:   { label: 'Generada',   clase: 'bg-info/10 text-info border-info/20' },
  completada: { label: 'Completada', clase: 'bg-success/10 text-success border-success/20' },
  anulada:    { label: 'Anulada',    clase: 'bg-destructive/10 text-destructive border-destructive/20' },
}

export function EstadoPlanillaBadge({ estado }: { estado: EstadoPlanilla }) {
  const c = CONFIG[estado] ?? CONFIG.generada
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.clase}`}>
      {c.label}
    </span>
  )
}
