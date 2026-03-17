const DATA = [
  { nombre: 'Carlos Mendoza',    origen: 'Puerto Gaitán',  estrellas: 5, texto: 'Antes tenía que madrugar a la agencia a reservar. Ahora lo hago desde la cama. Excelente app.' },
  { nombre: 'Luisa Fernanda R.', origen: 'Campo Rubiales', estrellas: 5, texto: 'Me llegó la notificación cuando el conductor estaba listo. Nunca más perdí un viaje.' },
  { nombre: 'Jhon Arbeláez',     origen: 'Puerto Gaitán',  estrellas: 5, texto: 'Lo mejor es que el cupo queda asegurado. Ya no me pasa que llego y no hay puesto.' },
  { nombre: 'Sandra Milena P.',  origen: 'Meta, Colombia', estrellas: 4, texto: 'Súper cómodo reservar desde el celular. El conductor siempre llega puntual.' },
  { nombre: 'Mauricio Torres',   origen: 'Campo Rubiales', estrellas: 5, texto: 'La app es muy intuitiva. En menos de 2 minutos tenía mi cupo reservado.' },
  { nombre: 'Diana Cortés',      origen: 'Puerto Gaitán',  estrellas: 5, texto: 'Finalmente una solución tecnológica para el transporte en los llanos.' },
]

export function Reviews() {
  return (
    <section id="reseñas" className="px-4 md:px-8 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-center mb-2">
        Lo que dicen nuestros viajeros
      </h2>
      <p className="text-center text-muted-foreground mb-10 text-sm">
        Personas reales, experiencias reales
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {DATA.map(r => (
          <div key={r.nombre} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < r.estrellas ? 'text-warning' : 'text-muted-foreground'}>★</span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{r.texto}"</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                {r.nombre.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold">{r.nombre}</div>
                <div className="text-[10px] text-muted-foreground">{r.origen}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}