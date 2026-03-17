import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const { iniciarSesion, cargando, error, limpiarError } = useAuthStore()
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [verPassword, setVerPassword] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) return
    await iniciarSesion(email, password)
    if (!useAuthStore.getState().error) navigate('/dashboard/inicio')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-5">
      <div className="flex w-full max-w-5xl h-auto md:h-155 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">

        {/* ── COLUMNA IZQUIERDA ── */}
        <div className="flex w-full flex-col justify-center px-5 py-8 md:w-[46%] md:px-10 lg:px-12">
          <div className="w-full max-w-sm mx-auto">

            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="mb-6 flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Car className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-base font-black tracking-tight text-foreground leading-none">Fletex</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Panel de administración</p>
              </div>
            </button>

            {/* Encabezado */}
            <div className="mb-5">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                Inicia sesión
              </h1>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Accede al panel administrativo con tu correo y contraseña.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Correo electrónico
                </label>
                <div className={cn(
                  'flex h-11 items-center gap-2.5 rounded-xl border bg-background px-3.5 transition-all',
                  error
                    ? 'border-destructive'
                    : 'border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10'
                )}>
                  <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="micorreo@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); limpiarError() }}
                    autoFocus
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Contraseña
                  </label>
                  <button type="button" className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className={cn(
                  'flex h-11 items-center gap-2.5 rounded-xl border bg-background px-3.5 transition-all',
                  error
                    ? 'border-destructive'
                    : 'border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10'
                )}>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <input
                    type={verPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); limpiarError() }}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button type="button" onClick={() => setVerPassword(!verPassword)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                    {verPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5">
                  <p className="text-xs text-destructive">
                    {error === 'Invalid login credentials'
                      ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
                      : error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={cargando || !email || !password}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              >
                {cargando ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                    </svg>
                    Ingresando...
                  </span>
                ) : 'Iniciar sesión'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-5 space-y-1.5">
              <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                Al iniciar sesión aceptas nuestros{' '}
                <span className="text-primary hover:underline cursor-pointer">términos</span>
                {' '}y{' '}
                <span className="text-primary hover:underline cursor-pointer">privacidad</span>.
              </p>
              <p className="text-center text-[10px] text-muted-foreground/60">
                Solo personal autorizado · Fletex
              </p>
            </div>

          </div>
        </div>

        {/* ── COLUMNA DERECHA — solo desktop ── */}
        <div className="relative hidden md:flex md:w-[54%]">
          <div className="relative m-3 flex w-full overflow-hidden rounded-2xl bg-[#081226]">

            {/* Fondo */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            {/* Líneas */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
              {[10, 25, 40, 55, 70, 85].map(top => (
                <div key={top} className="absolute left-[-10%] h-px w-[140%] bg-white"
                  style={{ top: `${top}%`, transform: 'rotate(20deg)' }} />
              ))}
            </div>

            {/* Contenido */}
            <div className="relative z-10 flex w-full items-center justify-center p-8 lg:p-10">
              <div className="relative w-full max-w-xs">

                {/* Card principal */}
                <div className="-rotate-6 rounded-2xl border border-white/10 bg-[#101828]/90 p-5 shadow-2xl backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/50">Bienvenido</p>
                      <h3 className="text-sm font-bold text-white">Dashboard Fletex</h3>
                    </div>
                    <span className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                      Activo
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-primary p-3.5 text-primary-foreground">
                      <p className="text-[9px] opacity-70">Viajes del día</p>
                      <p className="mt-1 text-xl font-black">128</p>
                    </div>
                    <div className="rounded-xl bg-white/8 p-3.5 text-white">
                      <p className="text-[9px] text-white/50">Conductores</p>
                      <p className="mt-1 text-xl font-black">64</p>
                    </div>
                    <div className="rounded-xl bg-white/8 p-3.5 text-white">
                      <p className="text-[9px] text-white/50">Ingresos</p>
                      <p className="mt-1 text-lg font-black">$12.4M</p>
                    </div>
                    <div className="rounded-xl bg-white/8 p-3.5 text-white">
                      <p className="text-[9px] text-white/50">Reservas</p>
                      <p className="mt-1 text-lg font-black">356</p>
                    </div>
                  </div>
                </div>

                {/* Cards flotantes */}
                <div className="absolute -left-8 top-12 rounded-xl border border-border bg-card px-3.5 py-3 shadow-2xl">
                  <p className="text-[9px] text-muted-foreground">Ventas</p>
                  <p className="mt-0.5 text-lg font-black text-foreground">$35.6K</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <p className="text-[9px] text-primary font-semibold">+18% esta semana</p>
                  </div>
                </div>

                <div className="absolute -bottom-3 left-6 rounded-xl border border-border bg-card px-3.5 py-3 shadow-2xl">
                  <p className="text-[9px] text-muted-foreground">Usuarios activos</p>
                  <p className="mt-0.5 text-lg font-black text-foreground">12.9K</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <p className="text-[9px] text-primary font-semibold">+24% vs semana pasada</p>
                  </div>
                </div>

                {/* Círculos */}
                <div className="absolute -right-3 -top-4 h-11 w-11 flex items-center justify-center rounded-full border-[3px] border-white/15 bg-card shadow-xl">
                  <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                </div>
                <div className="absolute bottom-14 right-0 h-9 w-9 flex items-center justify-center rounded-full border-[3px] border-white/15 bg-card shadow-xl">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>

              </div>
            </div>

            {/* Badge */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm whitespace-nowrap">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-medium text-white/70">Sistema operando con normalidad</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}