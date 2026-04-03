import type { EstadoEncomienda } from '@/types'

const CONFIG: Record<EstadoEncomienda, { label: string; clase: string }> = {
  registrada:  { label: 'Registrada',  clase: 'bg-info/10 text-info border-info/20' },
  en_transito: { label: 'En tránsito', clase: 'bg-warning/10 text-warning border-warning/20' },
  entregada:   { label: 'Entregada',   clase: 'bg-success/10 text-success border-success/20' },
  devuelta:    { label: 'Devuelta',    clase: 'bg-muted text-muted-foreground border-border' },
  perdida:     { label: 'Perdida',     clase: 'bg-destructive/10 text-destructive border-destructive/20' },
}

export function EstadoEncomiendaBadge({ estado }: { estado: EstadoEncomienda }) {
  const c = CONFIG[estado] ?? CONFIG.registrada
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.clase}`}>
      {c.label}
    </span>
  )
}
