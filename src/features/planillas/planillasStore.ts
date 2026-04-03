import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { PlanillaRow, EstadoPlanilla } from '@/types'

export type Planilla = PlanillaRow

export interface FiltrosPlanilla {
  estado?: string
}

export const POR_PAGINA = 10

interface PlanillasState {
  planillas: Planilla[]
  cargando: boolean
  error: string | null
  paginaActual: number
  totalRegistros: number
  totalPaginas: number
  filtrosActivos: FiltrosPlanilla

  cargarPlanillas: (filtros?: FiltrosPlanilla, pagina?: number) => Promise<void>
  cambiarPagina: (pagina: number) => Promise<void>
  limpiarError: () => void
}

export const usePlanillasStore = create<PlanillasState>((set, get) => ({
  planillas: [],
  cargando: false,
  error: null,
  paginaActual: 1,
  totalRegistros: 0,
  totalPaginas: 0,
  filtrosActivos: {},

  cargarPlanillas: async (filtros = {}, pagina = 1) => {
    set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      let query = supabase
        .from('planillas')
        .select('*', { count: 'exact' })
        .order('fecha_generacion', { ascending: false })
        .range(desde, hasta)

      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado as EstadoPlanilla)
      }

      const { data, error, count } = await query
      if (error) throw error

      const total = count ?? 0
      const totalPags = Math.ceil(total / POR_PAGINA)

      set({ planillas: data ?? [], totalRegistros: total, totalPaginas: totalPags })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cargar planillas' })
    } finally {
      set({ cargando: false })
    }
  },

  cambiarPagina: async (pagina) => {
    await get().cargarPlanillas(get().filtrosActivos, pagina)
  },

  limpiarError: () => set({ error: null }),
}))
