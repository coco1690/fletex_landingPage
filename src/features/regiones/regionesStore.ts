import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { Database } from '@/supabase/types'

type RegionRow = Database['public']['Tables']['regiones']['Row']
type RegionInsert = Database['public']['Tables']['regiones']['Insert']
type RegionUpdate = Database['public']['Tables']['regiones']['Update']
type EstadoGeneral = Database['public']['Enums']['estado_general']

export type Region = RegionRow & {
  admin?: { nombre: string; email: string | null } | null
  _count?: { agencias: number; conductores: number }
}

interface RegionesState {
  regiones: Region[]
  cargando: boolean
  error: string | null

  cargarRegiones: () => Promise<void>
  crearRegion: (datos: RegionInsert) => Promise<boolean>
  actualizarRegion: (id: string, datos: RegionUpdate) => Promise<boolean>
  toggleEstado: (id: string, estadoActual: EstadoGeneral) => Promise<boolean>
  asignarAdmin: (regionId: string, adminId: string) => Promise<boolean>
  limpiarError: () => void
  regionesActivas: { id: string; nombre: string; codigo: string }[]
  cargarRegionesActivas: () => Promise<void>
}

export const useRegionesStore = create<RegionesState>((set, get) => ({
  regiones: [],
  cargando: false,
  error: null,
  regionesActivas: [],

  cargarRegionesActivas: async () => {
    try {
      const { data, error } = await supabase
        .from('regiones')
        .select('id, nombre, codigo')
        .eq('estado', 'activo')
        .order('nombre')
      if (error) throw error
      set({ regionesActivas: data ?? [] })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
    }
  },

  cargarRegiones: async () => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('regiones')
        .select(`
          *,
          admin:admin_id (
            nombre,
            email
          )
        `)
        .order('fecha_creacion', { ascending: false })

      if (error) throw error

      // contar agencias y conductores por región
      const regiones = await Promise.all(
        (data ?? []).map(async (r) => {
          const [{ count: agencias }, { count: conductores }] = await Promise.all([
            supabase.from('agencias').select('id', { count: 'exact', head: true }).eq('region_id', r.id),
            supabase.from('conductores').select('id', { count: 'exact', head: true })
              .in('agencia_id',
                (await supabase.from('agencias').select('id').eq('region_id', r.id)).data?.map(a => a.id) ?? []
              ),
          ])
          return {
            ...r,
            admin: Array.isArray(r.admin) ? r.admin[0] ?? null : r.admin,
            _count: { agencias: agencias ?? 0, conductores: conductores ?? 0 },
          }
        })
      )

      set({ regiones })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
    } finally {
      set({ cargando: false })
    }
  },

  crearRegion: async (datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.from('regiones').insert(datos)
      if (error) throw error
      await get().cargarRegiones()
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  actualizarRegion: async (id, datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.from('regiones').update(datos).eq('id', id)
      if (error) throw error
      await get().cargarRegiones()
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  toggleEstado: async (id, estadoActual) => {
    const nuevoEstado: EstadoGeneral = estadoActual === 'activo' ? 'inactivo' : 'activo'
    try {
      const { error } = await supabase
        .from('regiones')
        .update({ estado: nuevoEstado })
        .eq('id', id)
      if (error) throw error
      set(state => ({
        regiones: state.regiones.map(r =>
          r.id === id ? { ...r, estado: nuevoEstado } : r
        )
      }))
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
      return false
    }
  },

  asignarAdmin: async (regionId, adminId) => {
    try {
      const { error } = await supabase
        .from('regiones')
        .update({ admin_id: adminId })
        .eq('id', regionId)
      if (error) throw error
      await get().cargarRegiones()
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
      return false
    }
  },

  limpiarError: () => set({ error: null }),
}))





