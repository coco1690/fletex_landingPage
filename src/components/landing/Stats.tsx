const DATA = [
  { n: '2',    l: 'Rutas activas' },
  { n: '100%', l: 'Digital' },
  { n: '24/7', l: 'Disponible' },
  { n: '0',    l: 'Filas' },
]

export function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-y border-border">
      {DATA.map((s, i) => (
        <div
          key={s.l}
          className={[
            'py-6 text-center',
            i % 2 === 0 ? 'border-r border-border' : '',
            i < 2 ? 'border-b md:border-b-0 border-border' : '',
            'md:border-r md:last:border-r-0',
          ].join(' ')}
        >
          <div className="text-2xl md:text-3xl font-black text-primary tracking-tight">{s.n}</div>
          <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</div>
        </div>
      ))}
    </div>
  )
}