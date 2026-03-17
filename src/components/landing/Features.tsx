const DATA = [
  { icon: '🗓️', title: 'Reserva en segundos',   desc: 'Elige tu fecha, hora y cupos. Confirmación inmediata en tu celular.' },
  { icon: '📍', title: 'Punto de abordaje',      desc: 'Selecciona el punto más cercano a ti. El conductor sabe dónde recogerte.' },
  { icon: '🎟️', title: 'Tu cupo asegurado',     desc: 'Una vez reservado, nadie te puede quitar tu puesto.' },
  { icon: '📦', title: 'Envía encomiendas',      desc: 'Rastrea el estado de tus paquetes en tiempo real.' },
  { icon: '🔔', title: 'Alertas en tiempo real', desc: 'Recibe notificaciones cuando el viaje esté listo para salir.' },
  { icon: '💵', title: 'Pago al abordar',        desc: 'Reserva gratis. Paga en efectivo al subir. Sin tarjetas.' },
]

export function Features() {
  return (
    <section id="caracteristicas" className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-center mb-2">
        Todo desde tu celular
      </h2>
      <p className="text-center text-muted-foreground mb-10 text-sm md:text-base">
        Sin llamadas, sin intermediarios. Tú decides cuándo y cómo viajas.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {DATA.map(f => (
          <div key={f.title} className="bg-card border border-border hover:border-primary/40 rounded-2xl p-5 transition-colors">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center mb-3 text-lg">
              {f.icon}
            </div>
            <h3 className="font-bold mb-1.5 text-sm">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}