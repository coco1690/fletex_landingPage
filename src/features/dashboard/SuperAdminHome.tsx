import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import {
  Car, Users, BookOpen, DollarSign,
  TrendingUp, AlertTriangle, Activity
} from 'lucide-react'

// ── Data de ejemplo ───────────────────────────────────────

const STATS = [
  {
    label: 'Viajes hoy',
    valor: '24',
    cambio: '+3 vs ayer',
    positivo: true,
    icono: <Car className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Conductores activos',
    valor: '18',
    cambio: '2 por vencer',
    positivo: false,
    icono: <Users className="w-5 h-5" />,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    label: 'Reservas hoy',
    valor: '87',
    cambio: '+12 vs ayer',
    positivo: true,
    icono: <BookOpen className="w-5 h-5" />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    label: 'Ingresos del día',
    valor: '$3.04M',
    cambio: '+8% vs ayer',
    positivo: true,
    icono: <DollarSign className="w-5 h-5" />,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    label: 'Ventas hoy',
    valor: '$1.75M',
    cambio: '+5% vs ayer',
    positivo: true,
    icono: <TrendingUp className="w-5 h-5" />,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    label: 'Total ventas',
    valor: '$48.2M',
    cambio: 'Este mes',
    positivo: true,
    icono: <Activity className="w-5 h-5" />,
    color: 'text-info',
    bg: 'bg-info/10',
  },
]

const VIAJES_SEMANA = [
  { dia: 'Lun', viajes: 18, reservas: 62 },
  { dia: 'Mar', viajes: 22, reservas: 78 },
  { dia: 'Mié', viajes: 19, reservas: 71 },
  { dia: 'Jue', viajes: 25, reservas: 91 },
  { dia: 'Vie', viajes: 30, reservas: 108 },
  { dia: 'Sáb', viajes: 28, reservas: 95 },
  { dia: 'Hoy', viajes: 24, reservas: 87 },
]

const VIAJES_EN_CURSO = [
  { id: 'V-001', ruta: 'Puerto Gaitán → Campo Rubiales', conductor: 'Carlos M.',    hora: '06:00 AM', pasajeros: 4, cupos: 6 },
  { id: 'V-002', ruta: 'Campo Rubiales → Puerto Gaitán', conductor: 'Jhon A.',      hora: '07:30 AM', pasajeros: 6, cupos: 6 },
  { id: 'V-003', ruta: 'Puerto Gaitán → Campo Rubiales', conductor: 'Luis R.',      hora: '08:00 AM', pasajeros: 3, cupos: 6 },
]

const ULTIMAS_RESERVAS = [
  { id: 'R-0891', pasajero: 'María González',  ruta: 'PG → CR', hora: '10:42 AM', cupos: 2, estado: 'reservada' },
  { id: 'R-0890', pasajero: 'Pedro Jiménez',   ruta: 'CR → PG', hora: '10:38 AM', cupos: 1, estado: 'abordada' },
  { id: 'R-0889', pasajero: 'Ana Rodríguez',   ruta: 'PG → CR', hora: '10:21 AM', cupos: 3, estado: 'reservada' },
  { id: 'R-0888', pasajero: 'Luis Martínez',   ruta: 'CR → PG', hora: '10:15 AM', cupos: 1, estado: 'cancelada' },
  { id: 'R-0887', pasajero: 'Sandra López',    ruta: 'PG → CR', hora: '09:58 AM', cupos: 2, estado: 'abordada' },
]

const CONDUCTORES_POR_VENCER = [
  { nombre: 'Carlos Mendoza',  licencia: 'C2-4821', vence: '20/03/2026', dias: 5 },
  { nombre: 'Jhon Arbeláez',   licencia: 'C2-3319', vence: '25/03/2026', dias: 10 },
  { nombre: 'Luis Ramírez',    licencia: 'C2-7734', vence: '01/04/2026', dias: 17 },
]

// ── Helpers ───────────────────────────────────────────────

function estadoConfig(estado: string) {
  return {
    reservada:  { label: 'Reservada',  cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    abordada:   { label: 'Abordada',   cls: 'bg-success/10 text-success border-success/20' },
    cancelada:  { label: 'Cancelada',  cls: 'bg-destructive/10 text-destructive border-destructive/20' },
    no_show:    { label: 'No Show',    cls: 'bg-warning/10 text-warning border-warning/20' },
  }[estado] ?? { label: estado, cls: 'bg-secondary text-muted-foreground border-border' }
}

// ── Componentes ───────────────────────────────────────────

function StatCard({ stat }: { stat: typeof STATS[0] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
        {stat.icono}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
        <p className="text-2xl font-black text-foreground tracking-tight">{stat.valor}</p>
        <p className={`text-[11px] font-medium mt-0.5 ${stat.positivo ? 'text-success' : 'text-warning'}`}>
          {stat.cambio}
        </p>
      </div>
    </div>
  )
}

// ── Tooltip personalizado ─────────────────────────────────

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2.5 shadow-xl text-xs">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === 'viajes' ? 'Viajes' : 'Reservas'}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

// ── Vista principal ───────────────────────────────────────

export function SuperAdminHome() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Bienvenida */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Resumen del día
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-success/10 border border-success/20 rounded-xl px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-semibold text-success">Sistema activo</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {STATS.map(s => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Gráfica + Viajes en curso */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Gráfica de área — viajes por semana */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-foreground">Viajes y reservas</h3>
              <p className="text-xs text-muted-foreground">Últimos 7 días</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-primary inline-block" />
                <span className="text-muted-foreground">Viajes</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-blue-400 inline-block" />
                <span className="text-muted-foreground">Reservas</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={VIAJES_SEMANA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gViajes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gReservas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="viajes"   stroke="var(--color-primary)" strokeWidth={2} fill="url(#gViajes)" />
              <Area type="monotone" dataKey="reservas" stroke="#60a5fa"               strokeWidth={2} fill="url(#gReservas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Barras — distribución diaria */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="mb-5">
            <h3 className="text-sm font-bold text-foreground">Viajes por día</h3>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={VIAJES_SEMANA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="viajes" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Viajes en curso */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Viajes en curso</h3>
              <p className="text-xs text-muted-foreground">{VIAJES_EN_CURSO.length} activos ahora</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
          <div className="space-y-3">
            {VIAJES_EN_CURSO.map(v => (
              <div key={v.id} className="p-3 bg-secondary/50 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground">{v.id}</span>
                  <span className="text-[10px] font-semibold text-foreground">{v.hora}</span>
                </div>
                <p className="text-xs font-semibold text-foreground mb-1 truncate">{v.ruta}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{v.conductor}</span>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: v.cupos }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-sm ${i < v.pasajeros ? 'bg-primary' : 'bg-secondary border border-border'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-1">{v.pasajeros}/{v.cupos}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas reservas */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Últimas reservas</h3>
              <p className="text-xs text-muted-foreground">Actualizadas en tiempo real</p>
            </div>
            <button className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
              Ver todas →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['ID', 'Pasajero', 'Ruta', 'Hora', 'Cupos', 'Estado'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground pb-2.5 pr-3 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ULTIMAS_RESERVAS.map(r => {
                  const { label, cls } = estadoConfig(r.estado)
                  return (
                    <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-2.5 pr-3 text-[11px] font-mono text-muted-foreground">{r.id}</td>
                      <td className="py-2.5 pr-3 text-xs font-semibold text-foreground whitespace-nowrap">{r.pasajero}</td>
                      <td className="py-2.5 pr-3 text-xs text-muted-foreground">{r.ruta}</td>
                      <td className="py-2.5 pr-3 text-xs text-muted-foreground whitespace-nowrap">{r.hora}</td>
                      <td className="py-2.5 pr-3 text-xs text-center font-bold text-foreground">{r.cupos}</td>
                      <td className="py-2.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
                          {label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Conductores por vencer */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <div>
            <h3 className="text-sm font-bold text-foreground">Suscripciones por vencer</h3>
            <p className="text-xs text-muted-foreground">Conductores que requieren renovación pronto</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CONDUCTORES_POR_VENCER.map(c => (
            <div key={c.nombre} className="flex items-center gap-3 p-3 bg-warning/5 border border-warning/15 rounded-xl">
              <div className="w-9 h-9 bg-warning/10 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-warning">{c.nombre.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{c.nombre}</p>
                <p className="text-[10px] text-muted-foreground">{c.licencia}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-semibold text-warning">
                    Vence en {c.dias} días
                  </span>
                  <span className="text-[10px] text-muted-foreground">· {c.vence}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}