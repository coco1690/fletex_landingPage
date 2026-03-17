export function AboutUs() {
  return (
    <section id="nosotros" className="px-4 md:px-8 py-16 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/12 border border-primary/25 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Quiénes somos
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">
              Conectamos viajeros con conductores de confianza
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Fletex nació en los llanos colombianos para resolver un problema real: la falta de acceso a transporte organizado entre Puerto Gaitán y Campo Rubiales.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Somos un equipo local comprometido con hacer más fácil y seguro el transporte en la región.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { n: '2+',   l: 'Años operando' },
                { n: '500+', l: 'Viajes completados' },
                { n: '100%', l: 'Conductores verificados' },
                { n: '4.8★', l: 'Calificación promedio' },
              ].map(s => (
                <div key={s.l} className="bg-card border border-border rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-primary">{s.n}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
            {[
              { icon: '🛡️', title: 'Conductores verificados', desc: 'Licencias y documentos al día' },
              { icon: '📍', title: 'Rutas establecidas',       desc: 'Puerto Gaitán ↔ Campo Rubiales' },
              { icon: '💬', title: 'Soporte directo',          desc: 'Te ayudamos por WhatsApp' },
              { icon: '⚡', title: 'Tecnología local',         desc: 'Construido para los llanos' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 p-3 bg-primary/8 border border-primary/15 rounded-xl">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-bold">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}