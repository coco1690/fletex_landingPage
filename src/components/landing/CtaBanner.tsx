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
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="active:scale-95 transition-transform"
        >
          <img
            src="/badges/appStore.svg"
            alt="Descargar en App Store"
            className="h-11 md:h-13 w-auto hover:scale-105 transition-transform"
          />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="active:scale-95 transition-transform"
        >
          <img
            src="/badges/GooglePlay.png"
            alt="Descargar en Google Play"
            className="h-11 md:h-13 w-auto hover:scale-105 transition-transform"
          />
        </a>
      </div>
    </section>
  )
}