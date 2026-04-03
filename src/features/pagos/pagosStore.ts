import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { SuscripcionConductorRow } from '@/types'

export type Pago = SuscripcionConductorRow & {
  conductor?: { nombre: string; telefono: string | null } | null
  plan?: { nombre: string; precio: number; duracion_dias: number } | null
}

export interface ConductorOpcion {
  id: string
  nombre: string
  rol: string
}

export interface PlanOpcion {
  id: string
  nombre: string
  precio: number
  duracion_dias: number
}

export interface RegistrarPagoParams {
  p_conductor_id: string
  p_plan_id: string
  p_fecha_pago: string
  p_valor_pagado: number
  p_referencia_nequi: string
  p_registrado_por: string
  p_observaciones?: string
}

export interface FiltrosPago {
  estado?: string
}

export const POR_PAGINA = 10

interface PagosState {
  pagos: Pago[]
  cargando: boolean
  error: string | null
  paginaActual: number
  totalRegistros: number
  totalPaginas: number
  filtrosActivos: FiltrosPago

  conductoresDisponibles: ConductorOpcion[]
  planesActivos: PlanOpcion[]

  cargarPagos: (filtros?: FiltrosPago, pagina?: number) => Promise<void>
  cambiarPagina: (pagina: number) => Promise<void>
  registrarPago: (params: RegistrarPagoParams) => Promise<boolean>
  cargarConductores: () => Promise<void>
  cargarPlanes: () => Promise<void>
  limpiarError: () => void
}

export const usePagosStore = create<PagosState>((set, get) => ({
  pagos: [],
  cargando: false,
  error: null,
  paginaActual: 1,
  totalRegistros: 0,
  totalPaginas: 0,
  filtrosActivos: {},
  conductoresDisponibles: [],
  planesActivos: [],

  cargarPagos: async (filtros = {}, pagina = 1) => {
    set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      let query = supabase
        .from('suscripciones_conductor')
        .select(`
          *,
          conductor:conductor_id (
            usuario:usuario_id ( nombre, telefono )
          ),
          plan:plan_id ( nombre, precio, duracion_dias )
        `, { count: 'exact' })
        .order('fecha_creacion', { ascending: false })
        .range(desde, hasta)

      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado as 'activo' | 'vencido')
      }

      const { data, error, count } = await query
      if (error) throw error

      const total = count ?? 0
      const totalPags = Math.ceil(total / POR_PAGINA)

      const pagos = (data ?? []).map(s => {
        const conductorRaw = Array.isArray(s.conductor) ? s.conductor[0] ?? null : s.conductor
        const usuarioRaw = conductorRaw
          ? (Array.isArray(conductorRaw.usuario) ? conductorRaw.usuario[0] ?? null : conductorRaw.usuario)
          : null
        return {
          ...s,
          conductor: usuarioRaw
            ? { nombre: usuarioRaw.nombre, telefono: usuarioRaw.telefono }
            : null,
          plan: Array.isArray(s.plan) ? s.plan[0] ?? null : s.plan,
        }
      })

      set({ pagos, totalRegistros: total, totalPaginas: totalPags })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cargar pagos' })
    } finally {
      set({ cargando: false })
    }
  },

  cambiarPagina: async (pagina) => {
    await get().cargarPagos(get().filtrosActivos, pagina)
  },

  cargarConductores: async () => {
    try {
      const { data, error } = await supabase
        .from('conductores')
        .select('id, usuario:usuario_id ( nombre, rol )')

      if (error) throw error

      const conductoresDisponibles: ConductorOpcion[] = (data ?? []).map(c => {
        const usuario = Array.isArray(c.usuario) ? c.usuario[0] ?? null : c.usuario
        return {
          id: c.id,
          nombre: (usuario as { nombre: string; rol: string } | null)?.nombre ?? '—',
          rol: (usuario as { nombre: string; rol: string } | null)?.rol ?? 'conductor',
        }
      })

      set({ conductoresDisponibles })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cargar conductores' })
    }
  },

  cargarPlanes: async () => {
    try {
      const { data, error } = await supabase
        .from('planes_suscripcion')
        .select('id, nombre, precio, duracion_dias')
        .eq('activo', true)
        .order('precio')

      if (error) throw error
      set({ planesActivos: (data ?? []) as PlanOpcion[] })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cargar planes' })
    }
  },

  registrarPago: async (params) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.rpc('registrar_pago_suscripcion', params)
      if (error) throw error
      await get().cargarPagos(get().filtrosActivos, 1)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al registrar pago' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null }),
}))
