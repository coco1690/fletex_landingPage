import { useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import {
  Car, Users, BookOpen, DollarSign,
  TrendingUp, AlertTriangle, Activity, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/store/dashboardStore'
import type { StatsHoy } from '@/store/dashboardStore'

// ── Helpers ───────────────────────────────────────────────

function formatearDinero(valor: number): string {
  if (valor >= 1_000_000) return `$${(valor / 1_000_000).toFixed(1)}M`
  if (valor >= 1_000)     return `$${(valor / 1_000).toFixed(0)}K`
  return `$${valor.toLocaleString('es-CO')}`
}

function estadoConfig(estado: string) {
  return {
    reservada:  { label: 'Reservada',  cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    abordada:   { label: 'Abordada',   cls: 'bg-success/10 text-success border-success/20' },
    cancelada:  { label: 'Cancelada',  cls: 'bg-destructive/10 text-destructive border-destructive/20' },
    no_show:    { label: 'No Show',    cls: 'bg-warning/10 text-warning border-warning/20' },
  }[estado] ?? { label: estado, cls: 'bg-secondary text-muted-foreground border-border' }
}

function buildStats(stats: StatsHoy) {
  return [
    {
      label: 'Viajes hoy',
      valor: String(stats.viajes_hoy),
      cambio: `${stats.viajes_en_curso} en curso`,
      positivo: true,
      icono: <Car className="w-5 h-5" />,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Conductores activos',
      valor: String(stats.conductores_activos),
      cambio: `${stats.conductores_por_vencer} por vencer`,
      positivo: stats.conductores_por_vencer === 0,
      icono: <Users className="w-5 h-5" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Reservas hoy',
      valor: String(stats.reservas_hoy),
      cambio: 'Hoy',
      positivo: true,
      icono: <BookOpen className="w-5 h-5" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Ingresos del día',
      valor: formatearDinero(stats.ingresos_hoy),
      cambio: 'Hoy',
      positivo: true,
      icono: <DollarSign className="w-5 h-5" />,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Viajes en curso',
      valor: String(stats.viajes_en_curso),
      cambio: 'Ahora mismo',
      positivo: true,
      icono: <TrendingUp className="w-5 h-5" />,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Ingresos del mes',
      valor: formatearDinero(stats.ingresos_mes),
      cambio: 'Este mes',
      positivo: true,
      icono: <Activity className="w-5 h-5" />,
      color: 'text-info',
      bg: 'bg-info/10',
    },
  ]
}

// ── Componentes ───────────────────────────────────────────

interface StatItem {
  label: string
  valor: string
  cambio: string
  positivo: boolean
  icono: React.ReactNode
  color: string
  bg: string
}

function StatCard({ stat }: { stat: StatItem }) {
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
  const {
    stats, viajesSemana, viajesEnCurso,
    ultimasReservas, conductoresPorVencer,
    cargando, error, cargarDashboard, limpiarError,
  } = useDashboardStore()

  useEffect(() => { cargarDashboard() }, [])

  const statsCards = stats ? buildStats(stats) : []

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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={cargarDashboard}
            disabled={cargando}
            className="w-8 h-8"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
          </Button>
          <div className="flex items-center gap-2 bg-success/10 border border-success/20 rounded-xl px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-success">Sistema activo</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs text-destructive">{error}</p>
          <Button variant="ghost" size="sm" onClick={limpiarError} className="text-destructive hover:text-destructive text-xs">
            Cerrar
          </Button>
        </div>
      )}

      {/* Cargando */}
      {cargando && !stats && (
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center gap-3 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando dashboard...</span>
          </div>
        </div>
      )}

      {/* Stats grid */}
      {statsCards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {statsCards.map(s => <StatCard key={s.label} stat={s} />)}
        </div>
      )}

      {/* Gráfica + Barras */}
      {viajesSemana.length > 0 && (
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
              <AreaChart data={viajesSemana} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
              <BarChart data={viajesSemana} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="viajes" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tablas */}
      {(viajesEnCurso.length > 0 || ultimasReservas.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Viajes en curso */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Viajes en curso</h3>
                <p className="text-xs text-muted-foreground">{viajesEnCurso.length} activos ahora</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            {viajesEnCurso.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No hay viajes en curso</p>
            ) : (
              <div className="space-y-3">
                {viajesEnCurso.map(v => (
                  <div key={v.id} className="p-3 bg-secondary/50 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-muted-foreground">{v.id.slice(0, 8)}</span>
                      <span className="text-[10px] font-semibold text-foreground">
                        {v.hora ? new Date(v.hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </span>
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
            )}
          </div>

          {/* Últimas reservas */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Últimas reservas</h3>
                <p className="text-xs text-muted-foreground">Más recientes</p>
              </div>
            </div>
            {ultimasReservas.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No hay reservas recientes</p>
            ) : (
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
                    {ultimasReservas.map(r => {
                      const { label, cls } = estadoConfig(r.estado)
                      return (
                        <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="py-2.5 pr-3 text-[11px] font-mono text-muted-foreground">{r.id.slice(0, 8)}</td>
                          <td className="py-2.5 pr-3 text-xs font-semibold text-foreground whitespace-nowrap">{r.pasajero}</td>
                          <td className="py-2.5 pr-3 text-xs text-muted-foreground">{r.ruta}</td>
                          <td className="py-2.5 pr-3 text-xs text-muted-foreground whitespace-nowrap">
                            {r.hora ? new Date(r.hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
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
            )}
          </div>
        </div>
      )}

      {/* Conductores por vencer */}
      {conductoresPorVencer.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Suscripciones por vencer</h3>
              <p className="text-xs text-muted-foreground">Conductores que requieren renovación pronto</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {conductoresPorVencer.map(c => (
              <div key={c.licencia} className="flex items-center gap-3 p-3 bg-warning/5 border border-warning/15 rounded-xl">
                <div className="w-9 h-9 bg-warning/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-warning">{c.nombre.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{c.nombre}</p>
                  <p className="text-[10px] text-muted-foreground">{c.licencia}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] font-semibold text-warning">
                      Vence en {c.dias_restantes} días
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      · {c.vence ? new Date(c.vence).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
