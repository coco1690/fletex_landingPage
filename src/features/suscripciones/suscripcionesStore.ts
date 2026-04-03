import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { PlanSuscripcionRow } from '@/types'
import type { Database } from '@/supabase/types'

export type PlanSuscripcion = PlanSuscripcionRow

type PlanInsert = Database['public']['Tables']['planes_suscripcion']['Insert']
type PlanUpdate = Database['public']['Tables']['planes_suscripcion']['Update']

export const POR_PAGINA = 10

interface SuscripcionesState {
  planes: PlanSuscripcion[]
  cargando: boolean
  error: string | null
  paginaActual: number
  totalRegistros: number
  totalPaginas: number

  cargarPlanes: (pagina?: number) => Promise<void>
  cambiarPagina: (pagina: number) => Promise<void>
  crearPlan: (datos: PlanInsert) => Promise<boolean>
  actualizarPlan: (id: string, datos: PlanUpdate) => Promise<boolean>
  toggleEstado: (id: string, estadoActual: boolean) => Promise<boolean>
  limpiarError: () => void
}

export const useSuscripcionesStore = create<SuscripcionesState>((set, get) => ({
  planes: [],
  cargando: false,
  error: null,
  paginaActual: 1,
  totalRegistros: 0,
  totalPaginas: 0,

  cargarPlanes: async (pagina = 1) => {
    set({ cargando: true, error: null, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      const { data, error, count } = await supabase
        .from('planes_suscripcion')
        .select('*', { count: 'exact' })
        .order('precio', { ascending: true })
        .range(desde, hasta)

      if (error) throw error

      const total = count ?? 0
      const totalPags = Math.ceil(total / POR_PAGINA)

      set({ planes: data ?? [], totalRegistros: total, totalPaginas: totalPags })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cargar planes' })
    } finally {
      set({ cargando: false })
    }
  },

  cambiarPagina: async (pagina) => {
    await get().cargarPlanes(pagina)
  },

  crearPlan: async (datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.from('planes_suscripcion').insert(datos)
      if (error) throw error
      await get().cargarPlanes(1)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al crear plan' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  actualizarPlan: async (id, datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase
        .from('planes_suscripcion')
        .update(datos)
        .eq('id', id)
      if (error) throw error
      await get().cargarPlanes(get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al actualizar plan' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  toggleEstado: async (id, estadoActual) => {
    try {
      const { error } = await supabase
        .from('planes_suscripcion')
        .update({ activo: !estadoActual })
        .eq('id', id)
      if (error) throw error
      await get().cargarPlanes(get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cambiar estado' })
      return false
    }
  },

  limpiarError: () => set({ error: null }),
}))
