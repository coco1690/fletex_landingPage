const STEPS = [
  { title: 'Descarga la app',  desc: 'Disponible para iOS y Android. Regístrate con tu número de celular en menos de un minuto.' },
  { title: 'Elige tu viaje',   desc: 'Busca la ruta, selecciona el horario y reserva los cupos que necesitas.' },
  { title: 'Aborda y listo',   desc: 'Muestra tu reserva en el punto de abordaje, paga en efectivo y viaja sin estrés.' },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="max-w-lg mx-auto px-4 md:px-8 pb-16">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-center mb-2">
        ¿Cómo funciona?
      </h2>
      <p className="text-center text-muted-foreground mb-10 text-sm">Tres pasos y listo</p>
      <div className="flex flex-col">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-4 pb-7 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {i + 1}
              </div>
              {i < STEPS.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
            </div>
            <div className="pt-1">
              <h3 className="font-bold text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}