import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { ConfiguracionComisionRow } from '@/types'
import type { Database } from '@/supabase/types'

export type Comision = ConfiguracionComisionRow & {
  region?: { nombre: string } | null
}

type TipoServicio = Database['public']['Enums']['tipo_servicio_comision']

export interface ActualizarComisionParams {
  p_region_id: string
  p_tipo_servicio: TipoServicio
  p_porcentaje: number
  p_modificado_por: string
}

export const POR_PAGINA = 10

interface ComisionesState {
  comisiones: Comision[]
  cargando: boolean
  error: string | null
  paginaActual: number
  totalRegistros: number
  totalPaginas: number

  cargarComisiones: (pagina?: number) => Promise<void>
  cambiarPagina: (pagina: number) => Promise<void>
  actualizarComision: (params: ActualizarComisionParams) => Promise<boolean>
  toggleEstado: (id: string, estadoActual: boolean) => Promise<boolean>
  limpiarError: () => void
}

export const useComisionesStore = create<ComisionesState>((set, get) => ({
  comisiones: [],
  cargando: false,
  error: null,
  paginaActual: 1,
  totalRegistros: 0,
  totalPaginas: 0,

  cargarComisiones: async (pagina = 1) => {
    set({ cargando: true, error: null, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      const { data, error, count } = await supabase
        .from('configuracion_comisiones')
        .select(`
          *,
          region:region_id ( nombre )
        `, { count: 'exact' })
        .order('fecha_modificacion', { ascending: false })
        .range(desde, hasta)

      if (error) throw error

      const total = count ?? 0
      const totalPags = Math.ceil(total / POR_PAGINA)

      const comisiones = (data ?? []).map(c => ({
        ...c,
        region: Array.isArray(c.region) ? c.region[0] ?? null : c.region,
      }))

      set({ comisiones, totalRegistros: total, totalPaginas: totalPags })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cargar comisiones' })
    } finally {
      set({ cargando: false })
    }
  },

  cambiarPagina: async (pagina) => {
    await get().cargarComisiones(pagina)
  },

  actualizarComision: async (params) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.rpc('actualizar_comision', params)
      if (error) throw error
      await get().cargarComisiones(get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al guardar comisión' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  toggleEstado: async (id, estadoActual) => {
    try {
      const { error } = await supabase
        .from('configuracion_comisiones')
        .update({ activo: !estadoActual })
        .eq('id', id)
      if (error) throw error
      await get().cargarComisiones(get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cambiar estado' })
      return false
    }
  },

  limpiarError: () => set({ error: null }),
}))
