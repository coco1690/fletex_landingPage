import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { EncomiendaRow, EstadoEncomienda } from '@/types'

export type Encomienda = EncomiendaRow & {
  agencia_origen?: { nombre: string } | null
  agencia_destino?: { nombre: string } | null
  remitente?: { nombre: string; telefono: string | null } | null
}

export interface FiltrosEncomienda {
  estado?: string
}

export const POR_PAGINA = 10

interface EncomiendasState {
  encomiendas: Encomienda[]
  cargando: boolean
  error: string | null
  paginaActual: number
  totalRegistros: number
  totalPaginas: number
  filtrosActivos: FiltrosEncomienda

  cargarEncomiendas: (filtros?: FiltrosEncomienda, pagina?: number) => Promise<void>
  cambiarPagina: (pagina: number) => Promise<void>
  limpiarError: () => void
}

export const useEncomiendasStore = create<EncomiendasState>((set, get) => ({
  encomiendas: [],
  cargando: false,
  error: null,
  paginaActual: 1,
  totalRegistros: 0,
  totalPaginas: 0,
  filtrosActivos: {},

  cargarEncomiendas: async (filtros = {}, pagina = 1) => {
    set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      let query = supabase
        .from('encomiendas')
        .select(`
          *,
          agencia_origen:agencia_origen_id ( nombre ),
          agencia_destino:agencia_destino_id ( nombre ),
          remitente:remitente_id ( nombre, telefono )
        `, { count: 'exact' })
        .order('fecha_registro', { ascending: false })
        .range(desde, hasta)

      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado as EstadoEncomienda)
      }

      const { data, error, count } = await query
      if (error) throw error

      const total = count ?? 0
      const totalPags = Math.ceil(total / POR_PAGINA)

      const encomiendas = (data ?? []).map(e => ({
        ...e,
        agencia_origen: Array.isArray(e.agencia_origen) ? e.agencia_origen[0] ?? null : e.agencia_origen,
        agencia_destino: Array.isArray(e.agencia_destino) ? e.agencia_destino[0] ?? null : e.agencia_destino,
        remitente: Array.isArray(e.remitente) ? e.remitente[0] ?? null : e.remitente,
      }))

      set({ encomiendas, totalRegistros: total, totalPaginas: totalPags })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cargar encomiendas' })
    } finally {
      set({ cargando: false })
    }
  },

  cambiarPagina: async (pagina) => {
    await get().cargarEncomiendas(get().filtrosActivos, pagina)
  },

  limpiarError: () => set({ error: null }),
}))
