import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { CarreraRow, EstadoCarrera } from '@/types'

export type Carrera = CarreraRow & {
  conductor?: {
    usuario: { nombre: string; telefono: string | null } | null
  } | null
  agencia?: { nombre: string } | null
}

export interface FiltrosCarrera {
  estado?: string
}

export const POR_PAGINA = 10

interface CarrerasState {
  carreras: Carrera[]
  cargando: boolean
  error: string | null
  paginaActual: number
  totalRegistros: number
  totalPaginas: number
  filtrosActivos: FiltrosCarrera

  cargarCarreras: (filtros?: FiltrosCarrera, pagina?: number) => Promise<void>
  cambiarPagina: (pagina: number) => Promise<void>
  limpiarError: () => void
}

export const useCarrerasStore = create<CarrerasState>((set, get) => ({
  carreras: [],
  cargando: false,
  error: null,
  paginaActual: 1,
  totalRegistros: 0,
  totalPaginas: 0,
  filtrosActivos: {},

  cargarCarreras: async (filtros = {}, pagina = 1) => {
    set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      let query = supabase
        .from('carreras')
        .select(`
          *,
          conductor:conductor_id (
            usuario:usuario_id ( nombre, telefono )
          ),
          agencia:agencia_id ( nombre )
        `, { count: 'exact' })
        .order('fecha_solicitud', { ascending: false })
        .range(desde, hasta)

      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado as EstadoCarrera)
      }

      const { data, error, count } = await query
      if (error) throw error

      const total = count ?? 0
      const totalPags = Math.ceil(total / POR_PAGINA)

      const carreras = (data ?? []).map(c => {
        const conductorRaw = Array.isArray(c.conductor) ? c.conductor[0] ?? null : c.conductor
        const usuario = conductorRaw
          ? (Array.isArray(conductorRaw.usuario) ? conductorRaw.usuario[0] ?? null : conductorRaw.usuario)
          : null
        return {
          ...c,
          conductor: conductorRaw ? { usuario } : null,
          agencia: Array.isArray(c.agencia) ? c.agencia[0] ?? null : c.agencia,
        }
      })

      set({ carreras, totalRegistros: total, totalPaginas: totalPags })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cargar carreras' })
    } finally {
      set({ cargando: false })
    }
  },

  cambiarPagina: async (pagina) => {
    await get().cargarCarreras(get().filtrosActivos, pagina)
  },

  limpiarError: () => set({ error: null }),
}))
