const CONTACTOS = [
  { icon: '💬', label: 'WhatsApp',           valor: '+57 3148632751',  href: 'https://wa.me/573148632751' },
  { icon: '📧', label: 'Correo electrónico', valor: 'contacto@fletex.com', href: 'mailto:contacto@fletex.com' },
  { icon: '📱', label: 'Teléfono',           valor: '+57 3148632751',  href: 'tel:+573148632751' },
]

export function Contact() {
  return (
    <section id="contacto" className="px-4 md:px-8 py-16 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/12 border border-primary/25 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Contacto
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
              ¿Tienes alguna pregunta?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Escríbenos por WhatsApp o al correo y te respondemos lo antes posible.
            </p>
            <div className="flex flex-col gap-3">
              {CONTACTOS.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-card border border-border hover:border-primary/50 rounded-xl p-4 transition-colors group"
                >
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:bg-primary/20 transition-colors">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">{c.label}</div>
                    <div className="text-sm font-semibold">{c.valor}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-base mb-4">Envíanos un mensaje</h3>
            <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); alert('¡Mensaje enviado!') }}>
              {[
                { label: 'Nombre',              type: 'text', placeholder: 'Tu nombre' },
                { label: 'Teléfono / WhatsApp', type: 'tel',  placeholder: '300 000 0000' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Mensaje</label>
                <textarea rows={4} placeholder="¿En qué podemos ayudarte?"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm py-3 rounded-xl transition-colors">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}