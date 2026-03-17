import { cn } from '@/lib/utils'

interface Props {
  confirmados: number
  totales:     number
}

export function CuposBarra({ confirmados, totales }: Props) {
  const pct = totales > 0 ? Math.round((confirmados / totales) * 100) : 0
  return (
    <div className="space-y-1 min-w-20">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">{confirmados}/{totales}</span>
        <span className="font-semibold text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            pct >= 100 ? 'bg-success' : pct >= 60 ? 'bg-primary' : 'bg-warning'
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  )
}