import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { Database } from '@/supabase/types'

type LiquidacionRow    = Database['public']['Tables']['liquidaciones']['Row']
type LiquidacionInsert = Database['public']['Tables']['liquidaciones']['Insert']
type LiquidacionUpdate = Database['public']['Tables']['liquidaciones']['Update']
type EstadoLiquidacion = Database['public']['Enums']['estado_liquidacion']

export type Liquidacion = LiquidacionRow & {
  agencia?: { nombre: string; codigo: string } | null
  registrado?: { nombre: string; email: string | null } | null
}

export interface FiltrosLiquidacion {
  estado?: string
  agencia_id?: string
  fecha_desde?: string
  fecha_hasta?: string
}

export const POR_PAGINA = 8

interface LiquidacionesState {
  liquidaciones:   Liquidacion[]
  cargando:        boolean
  error:           string | null

  // paginación
  paginaActual:    number
  totalRegistros:  number
  totalPaginas:    number
  filtrosActivos:  FiltrosLiquidacion

  // acciones
  cargarLiquidaciones:    (filtros?: FiltrosLiquidacion, pagina?: number) => Promise<void>
  cambiarPagina:          (pagina: number) => Promise<void>
  crearLiquidacion:       (datos: LiquidacionInsert) => Promise<boolean>
  actualizarLiquidacion:  (id: string, datos: LiquidacionUpdate) => Promise<boolean>
  cambiarEstado:          (id: string, estado: EstadoLiquidacion) => Promise<boolean>
  limpiarError:           () => void
}

export const useLiquidacionesStore = create<LiquidacionesState>((set, get) => ({
  liquidaciones:   [],
  cargando:        false,
  error:           null,
  paginaActual:    1,
  totalRegistros:  0,
  totalPaginas:    0,
  filtrosActivos:  {},

  // ── cargar con paginación server-side ────────────────
  cargarLiquidaciones: async (filtros = {}, pagina = 1) => {
    set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      let query = supabase
        .from('liquidaciones')
        .select(`
          *,
          agencia:agencia_id (
            nombre, codigo
          ),
          registrado:registrado_por (
            nombre, email
          )
        `, { count: 'exact' })
        .order('fecha_creacion', { ascending: false })
        .range(desde, hasta)

      // filtros
      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado as EstadoLiquidacion)
      }
      if (filtros.agencia_id) {
        query = query.eq('agencia_id', filtros.agencia_id)
      }
      if (filtros.fecha_desde) {
        query = query.gte('periodo_inicio', filtros.fecha_desde)
      }
      if (filtros.fecha_hasta) {
        query = query.lte('periodo_fin', filtros.fecha_hasta)
      }

      const { data, error, count } = await query
      if (error) throw error

      const total     = count ?? 0
      const totalPags = Math.ceil(total / POR_PAGINA)

      const liquidaciones = (data ?? []).map(l => ({
        ...l,
        agencia:    Array.isArray(l.agencia)    ? l.agencia[0]    ?? null : l.agencia,
        registrado: Array.isArray(l.registrado) ? l.registrado[0] ?? null : l.registrado,
      }))

      set({ liquidaciones, totalRegistros: total, totalPaginas: totalPags })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
    } finally {
      set({ cargando: false })
    }
  },

  // ── cambiar página ────────────────────────────────────
  cambiarPagina: async (pagina) => {
    await get().cargarLiquidaciones(get().filtrosActivos, pagina)
  },

  // ── crear liquidación ─────────────────────────────────
  crearLiquidacion: async (datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase
        .from('liquidaciones')
        .insert(datos)
      if (error) throw error
      await get().cargarLiquidaciones(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al crear liquidación' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  // ── actualizar liquidación ────────────────────────────
  actualizarLiquidacion: async (id, datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase
        .from('liquidaciones')
        .update(datos)
        .eq('id', id)
      if (error) throw error
      await get().cargarLiquidaciones(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al actualizar liquidación' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  // ── cambiar estado ────────────────────────────────────
  cambiarEstado: async (id, estado) => {
    set({ cargando: true, error: null })
    try {
      const updates: LiquidacionUpdate = { estado }
      if (estado === 'pagado') {
        updates.fecha_pago = new Date().toISOString()
      }
      const { error } = await supabase
        .from('liquidaciones')
        .update(updates)
        .eq('id', id)
      if (error) throw error
      await get().cargarLiquidaciones(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cambiar estado' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null }),
}))
