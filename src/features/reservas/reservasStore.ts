import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { Database } from '@/supabase/types'

type ReservaRow   = Database['public']['Tables']['reservas']['Row']
type EstadoReserva = Database['public']['Enums']['estado_reserva']
type EstadoPago   = Database['public']['Enums']['estado_pago']

export type Reserva = ReservaRow & {
  pasajero?: { nombre: string; telefono: string | null; email: string | null } | null
  viaje?: {
    hora_salida_programada: string
    estado: string
    ruta: {
      nombre: string
      agencia_origen:  { nombre: string } | null
      agencia_destino: { nombre: string } | null
    } | null
  } | null
  punto_abordaje?: { nombre: string } | null
}

export interface FiltrosReserva {
  estado?:      string
  estado_pago?: string
  fecha?:       string
  viaje_id?:    string
}

export const POR_PAGINA = 8

interface ReservasState {
  reservas:       Reserva[]
  cargando:       boolean
  error:          string | null

  // paginación
  paginaActual:   number
  totalRegistros: number
  totalPaginas:   number
  filtrosActivos: FiltrosReserva

  // acciones
  cargarReservas:   (filtros?: FiltrosReserva, pagina?: number) => Promise<void>
  cambiarPagina:    (pagina: number) => Promise<void>
  cancelarReserva:  (id: string, motivo: string, canceladoPor: string) => Promise<boolean>
  limpiarError:     () => void
}

export const useReservasStore = create<ReservasState>((set, get) => ({
  reservas:       [],
  cargando:       false,
  error:          null,
  paginaActual:   1,
  totalRegistros: 0,
  totalPaginas:   0,
  filtrosActivos: {},

  // ── cargar con paginación server-side ────────────────
  cargarReservas: async (filtros = {}, pagina = 1) => {
    set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      let query = supabase
        .from('reservas')
        .select(`
          *,
          pasajero:pasajero_id (
            nombre, telefono, email
          ),
          viaje:viaje_id (
            hora_salida_programada,
            estado,
            ruta:ruta_id (
              nombre,
              agencia_origen:agencia_origen_id   ( nombre ),
              agencia_destino:agencia_destino_id ( nombre )
            )
          ),
          punto_abordaje:punto_abordaje_id ( nombre )
        `, { count: 'exact' })
        .order('fecha_reserva', { ascending: false })
        .range(desde, hasta)

      // filtros
      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado as EstadoReserva)
      }
      if (filtros.estado_pago && filtros.estado_pago !== 'todos') {
        query = query.eq('estado_pago', filtros.estado_pago as EstadoPago)
      }
      if (filtros.fecha) {
        const inicio = `${filtros.fecha}T00:00:00`
        const fin    = `${filtros.fecha}T23:59:59`
        query = query.gte('fecha_reserva', inicio).lte('fecha_reserva', fin)
      }
      if (filtros.viaje_id) {
        query = query.eq('viaje_id', filtros.viaje_id)
      }

      const { data, error, count } = await query
      if (error) throw error

      const total      = count ?? 0
      const totalPags  = Math.ceil(total / POR_PAGINA)

      const reservas = (data ?? []).map(r => ({
        ...r,
        pasajero:       Array.isArray(r.pasajero)       ? r.pasajero[0]       ?? null : r.pasajero,
        viaje:          Array.isArray(r.viaje)          ? r.viaje[0]          ?? null : r.viaje,
        punto_abordaje: Array.isArray(r.punto_abordaje) ? r.punto_abordaje[0] ?? null : r.punto_abordaje,
      }))

      set({ reservas, totalRegistros: total, totalPaginas: totalPags })
    } catch (e: any) {
      set({ error: e.message })
    } finally {
      set({ cargando: false })
    }
  },

  // ── cambiar página ────────────────────────────────────
  cambiarPagina: async (pagina) => {
    await get().cargarReservas(get().filtrosActivos, pagina)
  },

  // ── cancelar reserva (usa RPC) ────────────────────────
  cancelarReserva: async (id, motivo, canceladoPor) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.rpc('cancelar_reserva', {
        p_reserva_id:   id,
        p_cancelado_por: canceladoPor,
        p_motivo:        motivo,
      })
      if (error) throw error
      await get().cargarReservas(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: any) {
      set({ error: e.message })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null }),
}))