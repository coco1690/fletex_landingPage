// import { create } from 'zustand'
// import { supabase } from '@/supabase/client'
// import type { Database } from '@/supabase/types'

// type RutaRow = Database['public']['Tables']['rutas']['Row']


// export type Ruta = RutaRow & {
//     region?: { nombre: string; codigo: string } | null
//     agencia_origen?: { nombre: string; codigo: string } | null
//     agencia_destino?: { nombre: string; codigo: string } | null
// }

// export interface DatosRuta {
//     nombre: string
//     region_id: string
//     agencia_origen_id: string
//     agencia_destino_id: string
//     precio_pasaje: number
//     distancia_km: number | null
//     duracion_estimada_min: number | null
// }

// // ── opciones para selects ──────────────────────────────
// export interface RegionOpcion { id: string; nombre: string; codigo: string }
// export interface AgenciaOpcion { id: string; nombre: string; codigo: string; region_id: string }

// interface RutasState {
//     rutas: Ruta[]
//     cargando: boolean
//     error: string | null

//     // selects
//     regionesActivas: RegionOpcion[]
//     agenciasActivas: AgenciaOpcion[]

//     // acciones
//     cargarRutas: () => Promise<void>
//     cargarSelects: () => Promise<void>
//     crearRuta: (datos: DatosRuta) => Promise<boolean>
//     actualizarRuta: (id: string, datos: DatosRuta) => Promise<boolean>
//     toggleActiva: (id: string, activa: boolean) => Promise<boolean>
//     limpiarError: () => void
//     eliminarRuta: (id: string) => Promise<boolean>
// }

// export const useRutasStore = create<RutasState>((set, get) => ({
//     rutas: [],
//     cargando: false,
//     error: null,
//     regionesActivas: [],
//     agenciasActivas: [],

//     // ── cargar tabla ──────────────────────────────────────
//     cargarRutas: async () => {
//         set({ cargando: true, error: null })
//         try {
//             const { data, error } = await supabase
//                 .from('rutas')
//                 .select(`
//           *,
//           region:region_id           ( nombre, codigo ),
//           agencia_origen:agencia_origen_id   ( nombre, codigo ),
//           agencia_destino:agencia_destino_id ( nombre, codigo )
//         `)
//                 .order('fecha_creacion', { ascending: false })

//             if (error) throw error

//             const rutas = (data ?? []).map(r => ({
//                 ...r,
//                 region: Array.isArray(r.region) ? r.region[0] ?? null : r.region,
//                 agencia_origen: Array.isArray(r.agencia_origen) ? r.agencia_origen[0] ?? null : r.agencia_origen,
//                 agencia_destino: Array.isArray(r.agencia_destino) ? r.agencia_destino[0] ?? null : r.agencia_destino,
//             }))

//             set({ rutas })
//         } catch (e: any) {
//             set({ error: e.message })
//         } finally {
//             set({ cargando: false })
//         }
//     },

//     // ── cargar selects (regiones + agencias) ──────────────
//     cargarSelects: async () => {
//         try {
//             const [{ data: regiones }, { data: agencias }] = await Promise.all([
//                 supabase
//                     .from('regiones')
//                     .select('id, nombre, codigo')
//                     .eq('estado', 'activo')
//                     .order('nombre'),
//                 supabase
//                     .from('agencias')
//                     .select('id, nombre, codigo, region_id')
//                     .eq('estado', 'activo')
//                     .order('nombre'),
//             ])

//             set({
//                 regionesActivas: regiones ?? [],
//                 agenciasActivas: agencias ?? [],
//             })
//         } catch (e: any) {
//             set({ error: e.message })
//         }
//     },

//     // ── CRUD ──────────────────────────────────────────────
//     crearRuta: async (datos) => {
//         set({ cargando: true, error: null })
//         try {
//             const { error } = await supabase.from('rutas').insert({
//                 ...datos,
//                 activa: true,
//             })
//             if (error) throw error
//             await get().cargarRutas()
//             return true
//         } catch (e: any) {
//             set({ error: e.message })
//             return false
//         } finally {
//             set({ cargando: false })
//         }
//     },

//     actualizarRuta: async (id, datos) => {
//         set({ cargando: true, error: null })
//         try {
//             const { error } = await supabase
//                 .from('rutas')
//                 .update(datos)
//                 .eq('id', id)
//             if (error) throw error
//             await get().cargarRutas()
//             return true
//         } catch (e: any) {
//             set({ error: e.message })
//             return false
//         } finally {
//             set({ cargando: false })
//         }
//     },

//     toggleActiva: async (id, activa) => {
//         try {
//             const { error } = await supabase
//                 .from('rutas')
//                 .update({ activa: !activa })
//                 .eq('id', id)
//             if (error) throw error
//             set(state => ({
//                 rutas: state.rutas.map(r =>
//                     r.id === id ? { ...r, activa: !activa } : r
//                 )
//             }))
//             return true
//         } catch (e: any) {
//             set({ error: e.message })
//             return false
//         }
//     },

//     eliminarRuta: async (id) => {
//         set({ cargando: true, error: null })
//         try {
//             const { error } = await supabase
//                 .from('rutas')
//                 .delete()
//                 .eq('id', id)
//             if (error) throw error
//             set(state => ({
//                 rutas: state.rutas.filter(r => r.id !== id)
//             }))
//             return true
//         } catch (e: any) {
//             set({ error: e.message })
//             return false
//         } finally {
//             set({ cargando: false })
//         }
//     },

//     limpiarError: () => set({ error: null }),
// }))

import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { Database } from '@/supabase/types'

type RutaRow = Database['public']['Tables']['rutas']['Row']

export type Ruta = RutaRow & {
    region?: { nombre: string; codigo: string } | null
    agencia_origen?: { nombre: string; codigo: string } | null
    agencia_destino?: { nombre: string; codigo: string } | null
}

export interface DatosRuta {
    nombre: string
    region_id: string
    agencia_origen_id: string
    agencia_destino_id: string
    precio_pasaje: number
    distancia_km: number | null
    duracion_estimada_min: number | null
}

export interface RegionOpcion { id: string; nombre: string; codigo: string }
export interface AgenciaOpcion { id: string; nombre: string; codigo: string; region_id: string }

export interface FiltrosRuta {
    estado?: string
    region?: string
}

export const POR_PAGINA = 8

interface RutasState {
    rutas: Ruta[]
    cargando: boolean
    error: string | null

    // paginación
    paginaActual: number
    totalRegistros: number
    totalPaginas: number
    filtrosActivos: FiltrosRuta

    // selects
    regionesActivas: RegionOpcion[]
    agenciasActivas: AgenciaOpcion[]

    // acciones
    cargarRutas: (filtros?: FiltrosRuta, pagina?: number) => Promise<void>
    cambiarPagina: (pagina: number) => Promise<void>
    cargarSelects: () => Promise<void>
    crearRuta: (datos: DatosRuta) => Promise<boolean>
    actualizarRuta: (id: string, datos: DatosRuta) => Promise<boolean>
    toggleActiva: (id: string, activa: boolean) => Promise<boolean>
    eliminarRuta: (id: string) => Promise<boolean>
    limpiarError: () => void
}

export const useRutasStore = create<RutasState>((set, get) => ({
    rutas: [],
    cargando: false,
    error: null,

    paginaActual: 1,
    totalRegistros: 0,
    totalPaginas: 0,
    filtrosActivos: {},

    regionesActivas: [],
    agenciasActivas: [],

    // ── cargar rutas con paginación server-side ───────────
    cargarRutas: async (filtros = {}, pagina = 1) => {
        set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
        try {
            const desde = (pagina - 1) * POR_PAGINA
            const hasta = desde + POR_PAGINA - 1

            let query = supabase
                .from('rutas')
                .select(`
                    *,
                    region:region_id           ( nombre, codigo ),
                    agencia_origen:agencia_origen_id   ( nombre, codigo ),
                    agencia_destino:agencia_destino_id ( nombre, codigo )
                `, { count: 'exact' })
                .order('fecha_creacion', { ascending: false })
                .range(desde, hasta)

            // filtro por estado
            if (filtros.estado && filtros.estado !== 'todos') {
                query = query.eq('activa', filtros.estado === 'activa')
            }

            // filtro por región (por id)
            if (filtros.region && filtros.region !== 'todas') {
                query = query.eq('region_id', filtros.region)
            }

            const { data, error, count } = await query
            if (error) throw error

            const total = count ?? 0
            const totalPaginas = Math.ceil(total / POR_PAGINA)

            const rutas = (data ?? []).map(r => ({
                ...r,
                region: Array.isArray(r.region) ? r.region[0] ?? null : r.region,
                agencia_origen: Array.isArray(r.agencia_origen) ? r.agencia_origen[0] ?? null : r.agencia_origen,
                agencia_destino: Array.isArray(r.agencia_destino) ? r.agencia_destino[0] ?? null : r.agencia_destino,
            }))

            set({ rutas, totalRegistros: total, totalPaginas })
        } catch (e: any) {
            set({ error: e.message })
        } finally {
            set({ cargando: false })
        }
    },

    cambiarPagina: async (pagina) => {
        const { filtrosActivos } = get()
        await get().cargarRutas(filtrosActivos, pagina)
    },

    cargarSelects: async () => {
        try {
            const [{ data: regiones }, { data: agencias }] = await Promise.all([
                supabase
                    .from('regiones')
                    .select('id, nombre, codigo')
                    .eq('estado', 'activo')
                    .order('nombre'),
                supabase
                    .from('agencias')
                    .select('id, nombre, codigo, region_id')
                    .eq('estado', 'activo')
                    .order('nombre'),
            ])

            set({
                regionesActivas: regiones ?? [],
                agenciasActivas: agencias ?? [],
            })
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    crearRuta: async (datos) => {
        set({ cargando: true, error: null })
        try {
            const { error } = await supabase.from('rutas').insert({
                ...datos,
                activa: true,
            })
            if (error) throw error
            await get().cargarRutas(get().filtrosActivos, 1)
            return true
        } catch (e: any) {
            set({ error: e.message })
            return false
        } finally {
            set({ cargando: false })
        }
    },

    actualizarRuta: async (id, datos) => {
        set({ cargando: true, error: null })
        try {
            const { error } = await supabase
                .from('rutas').update(datos).eq('id', id)
            if (error) throw error
            await get().cargarRutas(get().filtrosActivos, get().paginaActual)
            return true
        } catch (e: any) {
            set({ error: e.message })
            return false
        } finally {
            set({ cargando: false })
        }
    },

    toggleActiva: async (id, activa) => {
        try {
            const { error } = await supabase
                .from('rutas')
                .update({ activa: !activa })
                .eq('id', id)
            if (error) throw error
            await get().cargarRutas(get().filtrosActivos, get().paginaActual)
            return true
        } catch (e: any) {
            set({ error: e.message })
            return false
        }
    },

    eliminarRuta: async (id) => {
        set({ cargando: true, error: null })
        try {
            const { error } = await supabase
                .from('rutas').delete().eq('id', id)
            if (error) throw error
            const { paginaActual, rutas, filtrosActivos } = get()
            const nuevaPagina = rutas.length === 1 && paginaActual > 1
                ? paginaActual - 1
                : paginaActual
            await get().cargarRutas(filtrosActivos, nuevaPagina)
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