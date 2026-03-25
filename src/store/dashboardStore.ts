import { create } from 'zustand'
import { supabase } from '@/supabase/client'

// ── Interfaces del dashboard ──────────────────────────────

export interface StatsHoy {
  viajes_hoy:              number
  conductores_activos:     number
  reservas_hoy:            number
  ingresos_hoy:            number
  ingresos_mes:            number
  viajes_en_curso:         number
  conductores_por_vencer:  number
}

export interface ViajeSemana {
  dia:      string
  fecha:    string
  viajes:   number
  reservas: number
}

export interface ViajeEnCurso {
  id:         string
  ruta:       string
  conductor:  string
  hora:       string
  pasajeros:  number
  cupos:      number
  estado:     string
}

export interface UltimaReserva {
  id:        string
  pasajero:  string
  ruta:      string
  hora:      string
  cupos:     number
  estado:    string
}

export interface ConductorPorVencer {
  nombre:              string
  licencia:            string
  vence:               string
  dias_restantes:      number
  estado_suscripcion:  string
}

// ── Forma del JSON que devuelve el RPC ────────────────────

interface DashboardRpcResponse {
  stats:                     Record<string, unknown>
  viajes_semana:             Record<string, unknown>[] | null
  viajes_en_curso:           Record<string, unknown>[] | null
  ultimas_reservas:          Record<string, unknown>[] | null
  conductores_por_vencer:    Record<string, unknown>[] | null
}

// ── State ─────────────────────────────────────────────────

interface DashboardState {
  stats:                StatsHoy | null
  viajesSemana:         ViajeSemana[]
  viajesEnCurso:        ViajeEnCurso[]
  ultimasReservas:      UltimaReserva[]
  conductoresPorVencer: ConductorPorVencer[]
  cargando:             boolean
  error:                string | null

  cargarDashboard: () => Promise<void>
  limpiarError:    () => void
}

// ── Helpers de mapeo (null-safe) ──────────────────────────

function toNumber(val: unknown): number {
  return typeof val === 'number' ? val : 0
}

function toString(val: unknown, fallback = '—'): string {
  return typeof val === 'string' && val ? val : fallback
}

function mapStats(raw: Record<string, unknown>): StatsHoy {
  return {
    viajes_hoy:             toNumber(raw.viajes_hoy),
    conductores_activos:    toNumber(raw.conductores_activos),
    reservas_hoy:           toNumber(raw.reservas_hoy),
    ingresos_hoy:           toNumber(raw.ingresos_hoy),
    ingresos_mes:           toNumber(raw.ingresos_mes),
    viajes_en_curso:        toNumber(raw.viajes_en_curso),
    conductores_por_vencer: toNumber(raw.conductores_por_vencer),
  }
}

function mapViajesSemana(raw: Record<string, unknown>[]): ViajeSemana[] {
  return raw.map(r => ({
    dia:      toString(r.dia, ''),
    fecha:    toString(r.fecha, ''),
    viajes:   toNumber(r.viajes),
    reservas: toNumber(r.reservas),
  }))
}

function mapViajesEnCurso(raw: Record<string, unknown>[]): ViajeEnCurso[] {
  return raw.map(r => ({
    id:        toString(r.id, ''),
    ruta:      toString(r.ruta),
    conductor: toString(r.conductor),
    hora:      toString(r.hora, ''),
    pasajeros: toNumber(r.pasajeros),
    cupos:     toNumber(r.cupos),
    estado:    toString(r.estado, ''),
  }))
}

function mapUltimasReservas(raw: Record<string, unknown>[]): UltimaReserva[] {
  return raw.map(r => ({
    id:       toString(r.id, ''),
    pasajero: toString(r.pasajero),
    ruta:     toString(r.ruta),
    hora:     toString(r.hora, ''),
    cupos:    toNumber(r.cupos),
    estado:   toString(r.estado, ''),
  }))
}

function mapConductoresPorVencer(raw: Record<string, unknown>[]): ConductorPorVencer[] {
  return raw.map(r => ({
    nombre:             toString(r.nombre),
    licencia:           toString(r.licencia),
    vence:              toString(r.vence, ''),
    dias_restantes:     toNumber(r.dias),
    estado_suscripcion: '',
  }))
}

// ── Store ─────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>((set) => ({
  stats:                null,
  viajesSemana:         [],
  viajesEnCurso:        [],
  ultimasReservas:      [],
  conductoresPorVencer: [],
  cargando:             false,
  error:                null,

  cargarDashboard: async () => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase.rpc('get_dashboard_data')
      if (error) throw error

      const rpc = data as unknown as DashboardRpcResponse

      set({
        stats:                mapStats(rpc.stats ?? {}),
        viajesSemana:         mapViajesSemana(rpc.viajes_semana ?? []),
        viajesEnCurso:        mapViajesEnCurso(rpc.viajes_en_curso ?? []),
        ultimasReservas:      mapUltimasReservas(rpc.ultimas_reservas ?? []),
        conductoresPorVencer: mapConductoresPorVencer(rpc.conductores_por_vencer ?? []),
      })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cargar el dashboard' })
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null }),
}))
