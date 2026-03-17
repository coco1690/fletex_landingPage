// import Lottie from 'lottie-react'
// import heroAnimation from '../../../public/animations/hero.json'

// function StoreBadge({ icon, label, name }: { icon: React.ReactNode; label: string; name: string }) {
//   return (
//     <button className="flex items-center gap-3 bg-card border border-border hover:border-primary active:scale-95 rounded-xl px-4 py-2.5 transition-all min-w-36.25">
//       <div className="w-7 h-7 shrink-0">{icon}</div>
//       <div className="text-left">
//         <div className="text-[9px] text-muted-foreground">{label}</div>
//         <div className="text-sm font-bold mt-0.5">{name}</div>
//       </div>
//     </button>
//   )
// }

// function AppleIcon() {
//   return (
//     <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
//       <path d="M14 4C14 4 8 10 8 16C8 19.3 10.7 22 14 22C17.3 22 20 19.3 20 16C20 10 14 4 14 4Z" className="fill-primary" />
//       <path d="M10 12L14 8L18 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//       <circle cx="14" cy="17" r="1.8" fill="white" />
//     </svg>
//   )
// }

// function PlayIcon() {
//   return (
//     <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
//       <path d="M6 9L16 14L6 19V9Z" className="fill-primary" />
//       <path d="M16 14L21 10.5L17.5 8.5L16 14Z" className="fill-primary/60" />
//       <path d="M16 14L21 17.5L17.5 19.5L16 14Z" className="fill-primary/60" />
//     </svg>
//   )
// }

// export function Hero() {
//   return (
//     <section id="inicio" className="relative overflow-hidden">

//       {/* Fondo glow */}
//       <div className="absolute top-0 left-0 w-125 h-125 bg-primary/8 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
//       <div className="absolute bottom-0 right-0 w-100 h-100 bg-primary/6 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />

//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
//         <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

//           {/* ── IZQUIERDA: texto ── */}
//           <div className="flex-1 text-center md:text-left">

//             {/* Chip */}
//             <div className="inline-flex items-center gap-2 bg-primary/12 border border-primary/25 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
//               <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
//               Puerto Gaitán · Campo Rubiales
//             </div>

//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-4">
//               Viaja fácil,{' '}
//               <span className="text-primary">reserva<br className="hidden md:block" /> en segundos</span>
//             </h1>

//             <p className="text-base text-muted-foreground max-w-md mx-auto md:mx-0 mb-8 leading-relaxed">
//               Reserva tu cupo en la ruta Puerto Gaitán – Campo Rubiales
//               desde tu celular. Sin filas, sin llamadas, sin complicaciones.
//             </p>

//             {/* Badges */}
//             <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap mb-8">
//               <StoreBadge icon={<AppleIcon />} label="Disponible en" name="App Store" />
//               <StoreBadge icon={<PlayIcon />}  label="Disponible en" name="Google Play" />
//             </div>

//             {/* Trust pills */}
//             <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
//               {[
//                 { icon: '✓', text: 'Cupo asegurado' },
//                 { icon: '💵', text: 'Pago al abordar' },
//                 { icon: '⚡', text: 'Confirmación inmediata' },
//               ].map(p => (
//                 <div
//                   key={p.text}
//                   className="flex items-center gap-1.5 bg-secondary border border-border rounded-full px-3 py-1.5"
//                 >
//                   <span className="text-xs">{p.icon}</span>
//                   <span className="text-xs font-medium text-foreground">{p.text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── DERECHA: Lottie ── */}
//           <div className="flex-1 flex items-center justify-center relative w-full max-w-sm md:max-w-none">

//             {/* Círculo de fondo decorativo */}
//             <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-75 pointer-events-none" />

//             <Lottie
//               animationData={heroAnimation}
//               loop
//               className="w-full max-w-[320px] md:max-w-105 lg:max-w-120 relative z-10 drop-shadow-2xl"
//             />

//             {/* Card flotante — viaje */}
//             <div className="absolute top-4 -left-2 md:top-8 md:-left-6 bg-card border border-border rounded-2xl px-3.5 py-3 shadow-xl z-20">
//               <div className="flex items-center gap-2.5">
//                 <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-base">🚗</div>
//                 <div>
//                   <p className="text-[10px] text-muted-foreground">Próximo viaje</p>
//                   <p className="text-xs font-bold">6:00 AM · 3 cupos</p>
//                 </div>
//               </div>
//             </div>

//             {/* Card flotante — reserva */}
//             <div className="absolute bottom-4 -right-2 md:bottom-10 md:-right-4 bg-card border border-border rounded-2xl px-3.5 py-3 shadow-xl z-20">
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
//                   <span className="text-[10px] text-primary-foreground font-bold">✓</span>
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold text-foreground">Reserva confirmada</p>
//                   <p className="text-[10px] text-primary font-semibold">Puerto Gaitán → CR</p>
//                 </div>
//               </div>
//             </div>

//           </div>

//         </div>
//       </div>
//     </section>
//   )
// }


import Lottie from 'lottie-react'
import heroAnimation from '../../animations/hero.json'

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">

      {/* Fondo glow */}
      <div className="absolute top-0 left-0 w-125 h-125 bg-primary/8 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-primary/6 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* ── IZQUIERDA: texto ── */}
          <div className="flex-1 text-center md:text-left">

            {/* Chip */}
            <div className="inline-flex items-center gap-2 bg-primary/12 border border-primary/25 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              Puerto Gaitán · Campo Rubiales
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-4">
              Viaja fácil,{' '}
              <span className="text-primary">reserva<br className="hidden md:block" /> en segundos</span>
            </h1>

            <p className="text-base text-muted-foreground max-w-md mx-auto md:mx-0 mb-8 leading-relaxed">
              Reserva tu cupo en la ruta Puerto Gaitán – Campo Rubiales
              desde tu celular. Sin filas, sin llamadas, sin complicaciones.
            </p>

            {/* Badges */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap mb-8">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="active:scale-95 transition-transform"
              >
                <img
                  src="/badges/appStore.svg"
                  alt="Descargar en App Store"
                  className="h-12 md:h-14 w-auto hover:scale-105 transition-transform"
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
                  className="h-12 md:h-14 w-auto hover:scale-105 transition-transform"
                />
              </a>
            </div>

            {/* Trust pills */}
            {/* <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              {[
                { icon: '✓', text: 'Cupo asegurado' },
                { icon: '💵', text: 'Pago al abordar' },
                { icon: '⚡', text: 'Confirmación inmediata' },
              ].map(p => (
                <div
                  key={p.text}
                  className="flex items-center gap-1.5 bg-secondary border border-border rounded-full px-3 py-1.5"
                >
                  <span className="text-xs">{p.icon}</span>
                  <span className="text-xs font-medium text-foreground">{p.text}</span>
                </div>
              ))}
            </div> */}
          </div>

          {/* ── DERECHA: Lottie ── */}
          <div className="flex-1 flex items-center justify-center relative w-full max-w-sm md:max-w-none">

            {/* Círculo de fondo decorativo */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-75 pointer-events-none" />

            <Lottie
              animationData={heroAnimation}
              loop
              className="w-full max-w-[320px] md:max-w-105 lg:max-w-120 relative z-10 drop-shadow-2xl"
            />

            {/* Card flotante — viaje */}
            <div className="absolute top-4 -left-2 md:top-8 md:-left-6 bg-card border border-border rounded-2xl px-3.5 py-3 shadow-xl z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-base">🚗</div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Próximo viaje</p>
                  <p className="text-xs font-bold">6:00 AM · 3 cupos</p>
                </div>
              </div>
            </div>

            {/* Card flotante — reserva */}
            <div className="absolute bottom-4 -right-2 md:bottom-10 md:-right-4 bg-card border border-border rounded-2xl px-3.5 py-3 shadow-xl z-20">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-primary-foreground font-bold">✓</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Reserva confirmada</p>
                  <p className="text-[10px] text-primary font-semibold">Puerto Gaitán → CR</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}