const AGENCIAS = [
  { nombre: 'Agencia Puerto Gaitán',  direccion: 'Calle principal, Puerto Gaitán, Meta', horario: 'Lun–Sab 5:00 AM – 8:00 PM', telefono: '3001234567' },
  { nombre: 'Agencia Campo Rubiales', direccion: 'Entrada principal CR, Meta',            horario: 'Lun–Sab 5:00 AM – 6:00 PM', telefono: '3007654321' },
]

export function Location() {
  return (
    <section id="ubicacion" className="px-4 md:px-8 py-16 border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/12 border border-primary/25 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          Dónde nos encontramos
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Puntos de atención</h2>
        <p className="text-muted-foreground text-sm mb-8">Visítanos en cualquiera de nuestras agencias</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {AGENCIAS.map(a => (
            <div key={a.nombre} className="bg-card border border-border hover:border-primary/40 rounded-2xl p-5 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-lg">📍</div>
                <div className="flex-1">
                  <div className="font-bold text-sm mb-0.5">{a.nombre}</div>
                  <div className="text-xs text-muted-foreground mb-2">{a.direccion}</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                      {a.horario}
                    </span>
                    <a href={`tel:${a.telefono}`} className="text-[10px] bg-secondary text-muted-foreground border border-border px-2 py-0.5 rounded-full hover:border-primary/40 transition-colors">
                      📞 {a.telefono}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden h-48 md:h-64 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="text-center z-10">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="text-sm font-semibold">Meta, Colombia</p>
            <p className="text-xs text-muted-foreground">Puerto Gaitán · Campo Rubiales</p>
            <a
              href="https://maps.google.com/?q=Puerto+Gaitan+Meta+Colombia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver en Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}