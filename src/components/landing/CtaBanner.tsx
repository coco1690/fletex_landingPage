function StoreBadge({ icon, label, name }: { icon: React.ReactNode; label: string; name: string }) {
  return (
    <button className="flex items-center gap-3 bg-card border border-border hover:border-primary active:scale-95 rounded-xl px-4 py-2.5 transition-all min-w-36.25">
      <div className="w-7 h-7 shrink-0">{icon}</div>
      <div className="text-left">
        <div className="text-[9px] text-muted-foreground">{label}</div>
        <div className="text-sm font-bold mt-0.5">{name}</div>
      </div>
    </button>
  )
}

export function CtaBanner() {
  return (
    <section className="mx-4 md:mx-8 mb-16 bg-primary/8 border border-primary/20 rounded-2xl px-6 py-12 text-center">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
        ¿Listo para viajar mejor?
      </h2>
      <p className="text-muted-foreground mb-7 text-sm">
        Descarga Fletex y reserva tu próximo viaje en segundos.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <StoreBadge icon={
          <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
            <path d="M14 4C14 4 8 10 8 16C8 19.3 10.7 22 14 22C17.3 22 20 19.3 20 16C20 10 14 4 14 4Z" className="fill-primary"/>
            <path d="M10 12L14 8L18 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="14" cy="17" r="1.8" fill="white"/>
          </svg>
        } label="Disponible en" name="App Store" />
        <StoreBadge icon={
          <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
            <path d="M6 9L16 14L6 19V9Z" className="fill-primary"/>
            <path d="M16 14L21 10.5L17.5 8.5L16 14Z" className="fill-primary/60"/>
            <path d="M16 14L21 17.5L17.5 19.5L16 14Z" className="fill-primary/60"/>
          </svg>
        } label="Disponible en" name="Google Play" />
      </div>
    </section>
  )
}