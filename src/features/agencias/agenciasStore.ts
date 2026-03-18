// import { create } from 'zustand'
// import { supabase } from '@/supabase/client'
// import type { Database } from '@/supabase/types'

// type AgenciaRow = Database['public']['Tables']['agencias']['Row']
// type AgenciaInsert = Database['public']['Tables']['agencias']['Insert']
// type AgenciaUpdate = Database['public']['Tables']['agencias']['Update']
// type EstadoGeneral = Database['public']['Enums']['estado_general']

// export type Agencia = AgenciaRow & {
//   region?: { nombre: string; codigo: string } | null
//   encargado?: { nombre: string; email: string | null } | null
//   _count?: { conductores: number; vehiculos: number }
// }

// export interface EncargadoOpcion {
//   id: string
//   nombre: string
//   email: string | null
//   agencia_actual: string | null
// }

// interface AgenciasState {
//   agencias: Agencia[]
//   cargando: boolean
//   error: string | null

//   cargarAgencias: (regionId?: string) => Promise<void>
//   crearAgencia: (datos: AgenciaInsert) => Promise<boolean>
//   actualizarAgencia: (id: string, datos: AgenciaUpdate) => Promise<boolean>
//   toggleEstado: (id: string, estadoActual: EstadoGeneral) => Promise<boolean>
//   limpiarError: () => void
//   agenciasActivas: { id: string; nombre: string; codigo: string }[]
//   cargarAgenciasActivas: () => Promise<void>
//   encargadosDisponibles: EncargadoOpcion[]
//   cargandoEncargados: boolean
//   cargarEncargadosDisponibles: (agenciaId: string) => Promise<void>
//   asignarEncargado: (agenciaId: string, encargadoId: string | null) => Promise<boolean>
// }

// export const useAgenciasStore = create<AgenciasState>((set, get) => ({
//   agencias: [],
//   cargando: false,
//   error: null,
//   agenciasActivas: [],
//   encargadosDisponibles: [],
//   cargandoEncargados: false,

//   cargarEncargadosDisponibles: async (agenciaId) => {
//     set({ cargandoEncargados: true })
//     try {
//       const { data, error } = await supabase
//         .from('usuarios')
//         .select('id, nombre, email, agencia_id')
//         .eq('rol', 'encargado_agencia')
//         .eq('estado', 'activo')
//         .order('nombre')

//       if (error) throw error

//       const encargadosDisponibles: EncargadoOpcion[] = (data ?? []).map(u => ({
//         id: u.id,
//         nombre: u.nombre,
//         email: u.email,
//         agencia_actual: u.agencia_id && u.agencia_id !== agenciaId ? u.agencia_id : null,
//       }))

//       set({ encargadosDisponibles })
//     } catch (e: any) {
//       set({ error: e.message })
//     } finally {
//       set({ cargandoEncargados: false })
//     }
//   },

//   asignarEncargado: async (agenciaId, encargadoId) => {
//     try {
//       // 1. Si había encargado anterior, limpiar su agencia_id
//       const { data: agenciaActual } = await supabase
//         .from('agencias')
//         .select('encargado_id')
//         .eq('id', agenciaId)
//         .single()

//       if (agenciaActual?.encargado_id) {
//         await supabase
//           .from('usuarios')
//           .update({ agencia_id: null })
//           .eq('id', agenciaActual.encargado_id)
//       }

//       // 2. Actualizar encargado_id en agencia
//       const { error } = await supabase
//         .from('agencias')
//         .update({ encargado_id: encargadoId })
//         .eq('id', agenciaId)

//       if (error) throw error

//       // 3. Asignar agencia_id al nuevo encargado
//       if (encargadoId) {
//         await supabase
//           .from('usuarios')
//           .update({ agencia_id: agenciaId })
//           .eq('id', encargadoId)
//       }

//       await get().cargarAgencias()
//       return true
//     } catch (e: any) {
//       set({ error: e.message })
//       return false
//     }
//   },

//   cargarAgenciasActivas: async () => {
//     try {
//       const { data, error } = await supabase
//         .from('agencias')
//         .select('id, nombre, codigo')
//         .eq('estado', 'activo')
//         .order('nombre')
//       if (error) throw error
//       set({ agenciasActivas: data ?? [] })
//     } catch (e: any) {
//       set({ error: e.message })
//     }
//   },

//   cargarAgencias: async (regionId?: string) => {
//     set({ cargando: true, error: null })
//     try {
//       let query = supabase
//         .from('agencias')
//         .select(`
//           *,
//           region:region_id ( nombre, codigo ),
//           encargado:encargado_id ( nombre, email )
//         `)
//         .order('fecha_creacion', { ascending: false })

//       if (regionId) query = query.eq('region_id', regionId)

//       const { data, error } = await query
//       if (error) throw error

//       const agencias = await Promise.all(
//         (data ?? []).map(async (a) => {
//           const [{ count: conductores }, { count: vehiculos }] = await Promise.all([
//             supabase.from('conductores')
//               .select('id', { count: 'exact', head: true })
//               .eq('agencia_id', a.id),
//             supabase.from('vehiculos')
//               .select('id', { count: 'exact', head: true })
//               .eq('agencia_id', a.id),
//           ])
//           return {
//             ...a,
//             region: Array.isArray(a.region) ? a.region[0] ?? null : a.region,
//             encargado: Array.isArray(a.encargado) ? a.encargado[0] ?? null : a.encargado,
//             _count: { conductores: conductores ?? 0, vehiculos: vehiculos ?? 0 },
//           }
//         })
//       )

//       set({ agencias })
//     } catch (e: any) {
//       set({ error: e.message })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   crearAgencia: async (datos) => {
//     set({ cargando: true, error: null })
//     try {
//       const { error } = await supabase.from('agencias').insert(datos)
//       if (error) throw error
//       await get().cargarAgencias()
//       return true
//     } catch (e: any) {
//       set({ error: e.message })
//       return false
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   actualizarAgencia: async (id, datos) => {
//     set({ cargando: true, error: null })
//     try {
//       const { error } = await supabase.from('agencias').update(datos).eq('id', id)
//       if (error) throw error
//       await get().cargarAgencias()
//       return true
//     } catch (e: any) {
//       set({ error: e.message })
//       return false
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   toggleEstado: async (id, estadoActual) => {
//     const nuevoEstado: EstadoGeneral = estadoActual === 'activo' ? 'inactivo' : 'activo'
//     try {
//       const { error } = await supabase
//         .from('agencias')
//         .update({ estado: nuevoEstado })
//         .eq('id', id)
//       if (error) throw error
//       set(state => ({
//         agencias: state.agencias.map(a =>
//           a.id === id ? { ...a, estado: nuevoEstado } : a
//         )
//       }))
//       return true
//     } catch (e: any) {
//       set({ error: e.message })
//       return false
//     }
//   },

//   limpiarError: () => set({ error: null }),
// }))


import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { Database } from '@/supabase/types'

type AgenciaRow = Database['public']['Tables']['agencias']['Row']
type AgenciaInsert = Database['public']['Tables']['agencias']['Insert']
type AgenciaUpdate = Database['public']['Tables']['agencias']['Update']
type EstadoGeneral = Database['public']['Enums']['estado_general']

export type Agencia = AgenciaRow & {
  region?: { nombre: string; codigo: string } | null
  encargado?: { nombre: string; email: string | null } | null
  _count?: { conductores: number; vehiculos: number }
}

export interface EncargadoOpcion {
  id: string
  nombre: string
  email: string | null
  agencia_actual: string | null
}

export interface RegionOpcion { id: string; nombre: string; codigo: string }

export interface FiltrosAgencia {
  estado?: string
  region_id?: string
}

export const POR_PAGINA = 8

interface AgenciasState {
  agencias: Agencia[]
  cargando: boolean
  error: string | null

  // paginación
  paginaActual: number
  totalRegistros: number
  totalPaginas: number
  filtrosActivos: FiltrosAgencia

  // selects
  regionesOpciones: RegionOpcion[]

  // acciones
  cargarAgencias: (filtros?: FiltrosAgencia, pagina?: number) => Promise<void>
  cambiarPagina: (pagina: number) => Promise<void>
  cargarSelects: () => Promise<void>
  crearAgencia: (datos: AgenciaInsert) => Promise<boolean>
  actualizarAgencia: (id: string, datos: AgenciaUpdate) => Promise<boolean>
  toggleEstado: (id: string, estadoActual: EstadoGeneral) => Promise<boolean>
  limpiarError: () => void

  agenciasActivas: { id: string; nombre: string; codigo: string }[]
  cargarAgenciasActivas: () => Promise<void>

  encargadosDisponibles: EncargadoOpcion[]
  cargandoEncargados: boolean
  cargarEncargadosDisponibles: (agenciaId: string) => Promise<void>
  asignarEncargado: (agenciaId: string, encargadoId: string | null) => Promise<boolean>
}

export const useAgenciasStore = create<AgenciasState>((set, get) => ({
  agencias: [],
  cargando: false,
  error: null,

  paginaActual: 1,
  totalRegistros: 0,
  totalPaginas: 0,
  filtrosActivos: {},

  regionesOpciones: [],
  agenciasActivas: [],
  encargadosDisponibles: [],
  cargandoEncargados: false,

  // ── cargar selects (regiones para filtro) ───────────────
  cargarSelects: async () => {
    try {
      const { data, error } = await supabase
        .from('regiones')
        .select('id, nombre, codigo')
        .eq('estado', 'activo')
        .order('nombre')
      if (error) throw error
      set({ regionesOpciones: data ?? [] })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  // ── cargar agencias con paginación server-side ──────────
  cargarAgencias: async (filtros = {}, pagina = 1) => {
    set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      let query = supabase
        .from('agencias')
        .select(`
          *,
          region:region_id ( nombre, codigo ),
          encargado:encargado_id ( nombre, email )
        `, { count: 'exact' })
        .order('fecha_creacion', { ascending: false })
        .range(desde, hasta)

      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado as EstadoGeneral)
      }

      if (filtros.region_id && filtros.region_id !== 'todas') {
        query = query.eq('region_id', filtros.region_id)
      }

      const { data, error, count } = await query
      if (error) throw error

      const total = count ?? 0
      const totalPaginas = Math.ceil(total / POR_PAGINA)

      const agencias = await Promise.all(
        (data ?? []).map(async (a) => {
          const [{ count: conductores }, { count: vehiculos }] = await Promise.all([
            supabase.from('conductores')
              .select('id', { count: 'exact', head: true })
              .eq('agencia_id', a.id),
            supabase.from('vehiculos')
              .select('id', { count: 'exact', head: true })
              .eq('agencia_id', a.id),
          ])
          return {
            ...a,
            region: Array.isArray(a.region) ? a.region[0] ?? null : a.region,
            encargado: Array.isArray(a.encargado) ? a.encargado[0] ?? null : a.encargado,
            _count: { conductores: conductores ?? 0, vehiculos: vehiculos ?? 0 },
          }
        })
      )

      set({ agencias, totalRegistros: total, totalPaginas })
    } catch (e: any) {
      set({ error: e.message })
    } finally {
      set({ cargando: false })
    }
  },

  cambiarPagina: async (pagina) => {
    const { filtrosActivos } = get()
    await get().cargarAgencias(filtrosActivos, pagina)
  },

  cargarAgenciasActivas: async () => {
    try {
      const { data, error } = await supabase
        .from('agencias')
        .select('id, nombre, codigo')
        .eq('estado', 'activo')
        .order('nombre')
      if (error) throw error
      set({ agenciasActivas: data ?? [] })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  cargarEncargadosDisponibles: async (agenciaId) => {
    set({ cargandoEncargados: true })
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, agencia_id')
        .eq('rol', 'encargado_agencia')
        .eq('estado', 'activo')
        .order('nombre')

      if (error) throw error

      const encargadosDisponibles: EncargadoOpcion[] = (data ?? []).map(u => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        agencia_actual: u.agencia_id && u.agencia_id !== agenciaId ? u.agencia_id : null,
      }))

      set({ encargadosDisponibles })
    } catch (e: any) {
      set({ error: e.message })
    } finally {
      set({ cargandoEncargados: false })
    }
  },

  asignarEncargado: async (agenciaId, encargadoId) => {
    try {
      const { data: agenciaActual } = await supabase
        .from('agencias')
        .select('encargado_id')
        .eq('id', agenciaId)
        .single()

      if (agenciaActual?.encargado_id) {
        await supabase
          .from('usuarios')
          .update({ agencia_id: null })
          .eq('id', agenciaActual.encargado_id)
      }

      const { error } = await supabase
        .from('agencias')
        .update({ encargado_id: encargadoId })
        .eq('id', agenciaId)

      if (error) throw error

      if (encargadoId) {
        await supabase
          .from('usuarios')
          .update({ agencia_id: agenciaId })
          .eq('id', encargadoId)
      }

      await get().cargarAgencias(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: any) {
      set({ error: e.message })
      return false
    }
  },

  crearAgencia: async (datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.from('agencias').insert(datos)
      if (error) throw error
      await get().cargarAgencias(get().filtrosActivos, 1)
      return true
    } catch (e: any) {
      set({ error: e.message })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  actualizarAgencia: async (id, datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.from('agencias').update(datos).eq('id', id)
      if (error) throw error
      await get().cargarAgencias(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: any) {
      set({ error: e.message })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  toggleEstado: async (id, estadoActual) => {
    const nuevoEstado: EstadoGeneral = estadoActual === 'activo' ? 'inactivo' : 'activo'
    try {
      const { error } = await supabase
        .from('agencias')
        .update({ estado: nuevoEstado })
        .eq('id', id)
      if (error) throw error
      await get().cargarAgencias(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: any) {
      set({ error: e.message })
      return false
    }
  },

  limpiarError: () => set({ error: null }),
}))

