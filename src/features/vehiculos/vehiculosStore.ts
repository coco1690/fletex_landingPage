// import { create } from 'zustand'
// import { supabase } from '@/supabase/client'
// import type { Database } from '@/supabase/types'

// type VehiculoRow = Database['public']['Tables']['vehiculos']['Row']
// type VehiculoInsert = Database['public']['Tables']['vehiculos']['Insert']
// type VehiculoUpdate = Database['public']['Tables']['vehiculos']['Update']
// type EstadoVehiculo = Database['public']['Enums']['estado_vehiculo']
// type TipoVehiculo = Database['public']['Enums']['tipo_vehiculo']

// export type Vehiculo = VehiculoRow & {
//     agencia?: { nombre: string; codigo: string } | null
//     conductor?: { nombre: string; telefono: string | null } | null
// }

// export const TIPO_LABELS: Record<TipoVehiculo, string> = {
//     duster: 'Duster',
//     ford_platon: 'Ford Platón',
//     otro: 'Otro',
// }

// export const ESTADO_VEHICULO_LABELS: Record<EstadoVehiculo, string> = {
//     activo: 'Activo',
//     mantenimiento: 'Mantenimiento',
//     inactivo: 'Inactivo',
// }

// export interface ConductorOpcion {
//     id: string
//     usuario_id: string
//     nombre: string
//     licencia: string
//     tiene_vehiculo: boolean
// }

// interface VehiculosState {
//     vehiculos: Vehiculo[]
//     cargando: boolean
//     error: string | null

//     cargarVehiculos: (agenciaId?: string) => Promise<void>
//     crearVehiculo: (datos: VehiculoInsert) => Promise<boolean>
//     actualizarVehiculo: (id: string, datos: VehiculoUpdate) => Promise<boolean>
//     cambiarEstado: (id: string, estado: EstadoVehiculo) => Promise<boolean>
//     asignarConductor: (vehiculoId: string, conductorId: string | null) => Promise<boolean>
//     limpiarError: () => void
//     conductoresDisponibles: ConductorOpcion[]
//     cargandoConductores: boolean
//     cargarConductoresPorAgencia: (agenciaId: string, vehiculoId: string) => Promise<void>
// }



// export const useVehiculosStore = create<VehiculosState>((set, get) => ({
//     vehiculos: [],
//     cargando: false,
//     error: null,
//     conductoresDisponibles: [],
//     cargandoConductores: false,

//     cargarConductoresPorAgencia: async (agenciaId, vehiculoId) => {
//         set({ cargandoConductores: true })
//         try {
//             const { data, error } = await supabase
//                 .from('conductores')
//                 .select(`
//         id,
//         usuario_id,
//         numero_licencia,
//         vehiculo_id,
//         usuario:usuario_id ( nombre )
//       `)
//                 .eq('agencia_id', agenciaId)
//                 .eq('estado_suscripcion', 'activo')

//             if (error) throw error

//             const conductoresDisponibles: ConductorOpcion[] = (data ?? []).map(c => ({
//                 id: c.id,
//                 usuario_id: c.usuario_id,
//                 nombre: (c.usuario as any)?.nombre ?? '—',
//                 licencia: c.numero_licencia,
//                 tiene_vehiculo: !!c.vehiculo_id && c.vehiculo_id !== vehiculoId,
//             }))

//             set({ conductoresDisponibles })
//         } catch (e: any) {
//             set({ error: e.message })
//         } finally {
//             set({ cargandoConductores: false })
//         }
//     },

//     cargarVehiculos: async (agenciaId?: string) => {
//         set({ cargando: true, error: null })
//         try {
//             let query = supabase
//                 .from('vehiculos')
//                 .select(`
//           *,
//           agencia:agencia_id ( nombre, codigo ),
//           conductor:conductor_id ( usuario_id, usuario:usuario_id ( nombre, telefono ) )
//         `)
//                 .order('fecha_registro', { ascending: false })

//             if (agenciaId) query = query.eq('agencia_id', agenciaId)

//             const { data, error } = await query
//             if (error) throw error

//             const vehiculos = (data ?? []).map(v => ({
//                 ...v,
//                 agencia: Array.isArray(v.agencia) ? v.agencia[0] ?? null : v.agencia,
//                 conductor: Array.isArray(v.conductor) ? v.conductor[0] ?? null : v.conductor,
//             }))

//             set({ vehiculos })
//         } catch (e: any) {
//             set({ error: e.message })
//         } finally {
//             set({ cargando: false })
//         }
//     },

//     crearVehiculo: async (datos) => {
//         set({ cargando: true, error: null })
//         try {
//             const { error } = await supabase.from('vehiculos').insert(datos)
//             if (error) throw error
//             await get().cargarVehiculos()
//             return true
//         } catch (e: any) {
//             set({ error: e.message })
//             return false
//         } finally {
//             set({ cargando: false })
//         }
//     },

//     actualizarVehiculo: async (id, datos) => {
//         set({ cargando: true, error: null })
//         try {
//             const { error } = await supabase.from('vehiculos').update(datos).eq('id', id)
//             if (error) throw error
//             await get().cargarVehiculos()
//             return true
//         } catch (e: any) {
//             set({ error: e.message })
//             return false
//         } finally {
//             set({ cargando: false })
//         }
//     },

//     cambiarEstado: async (id, estado) => {
//         try {
//             const { error } = await supabase
//                 .from('vehiculos')
//                 .update({ estado })
//                 .eq('id', id)
//             if (error) throw error
//             set(state => ({
//                 vehiculos: state.vehiculos.map(v =>
//                     v.id === id ? { ...v, estado } : v
//                 )
//             }))
//             return true
//         } catch (e: any) {
//             set({ error: e.message })
//             return false
//         }
//     },

//     asignarConductor: async (vehiculoId, conductorId) => {
//         try {
//             // 1. Obtener conductor_id actual del vehículo para limpiar su vehiculo_id
//             const { data: vehiculoActual } = await supabase
//                 .from('vehiculos')
//                 .select('conductor_id')
//                 .eq('id', vehiculoId)
//                 .single()

//             // 2. Si el vehículo ya tenía conductor, limpiar su vehiculo_id
//             if (vehiculoActual?.conductor_id) {
//                 await supabase
//                     .from('conductores')
//                     .update({ vehiculo_id: null })
//                     .eq('id', vehiculoActual.conductor_id)
//             }

//             // 3. Si el nuevo conductor ya tenía vehículo, limpiar ese vehículo
//             if (conductorId) {
//                 const { data: conductorActual } = await supabase
//                     .from('conductores')
//                     .select('vehiculo_id')
//                     .eq('id', conductorId)
//                     .single()

//                 if (conductorActual?.vehiculo_id) {
//                     await supabase
//                         .from('vehiculos')
//                         .update({ conductor_id: null })
//                         .eq('id', conductorActual.vehiculo_id)
//                 }

//                 // 4. Asignar vehiculo_id al nuevo conductor
//                 await supabase
//                     .from('conductores')
//                     .update({ vehiculo_id: vehiculoId })
//                     .eq('id', conductorId)
//             }

//             // 5. Actualizar conductor_id en el vehículo
//             const { error } = await supabase
//                 .from('vehiculos')
//                 .update({ conductor_id: conductorId })
//                 .eq('id', vehiculoId)

//             if (error) throw error

//             await get().cargarVehiculos()
//             return true
//         } catch (e: any) {
//             set({ error: e.message })
//             return false
//         }
//     },

//     limpiarError: () => set({ error: null }),
// }))


import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { Database } from '@/supabase/types'

type VehiculoRow = Database['public']['Tables']['vehiculos']['Row']
type VehiculoInsert = Database['public']['Tables']['vehiculos']['Insert']
type VehiculoUpdate = Database['public']['Tables']['vehiculos']['Update']
type EstadoVehiculo = Database['public']['Enums']['estado_vehiculo']
type TipoVehiculo = Database['public']['Enums']['tipo_vehiculo']

export type Vehiculo = VehiculoRow & {
    agencia?: { nombre: string; codigo: string } | null
    conductor?: { nombre: string; telefono: string | null } | null
}

export const TIPO_LABELS: Record<TipoVehiculo, string> = {
    duster: 'Duster',
    ford_platon: 'Ford Platón',
    otro: 'Otro',
}

export const ESTADO_VEHICULO_LABELS: Record<EstadoVehiculo, string> = {
    activo: 'Activo',
    mantenimiento: 'Mantenimiento',
    inactivo: 'Inactivo',
}

export interface ConductorOpcion {
    id: string
    usuario_id: string
    nombre: string
    licencia: string
    tiene_vehiculo: boolean
}

export interface FiltrosVehiculo {
    estado?: string
    tipo?: string
    agencia_id?: string
}

export const POR_PAGINA = 8

interface VehiculosState {
    vehiculos: Vehiculo[]
    cargando: boolean
    error: string | null

    // paginación
    paginaActual: number
    totalRegistros: number
    totalPaginas: number
    filtrosActivos: FiltrosVehiculo

    // acciones
    cargarVehiculos: (filtros?: FiltrosVehiculo, pagina?: number) => Promise<void>
    cambiarPagina: (pagina: number) => Promise<void>
    crearVehiculo: (datos: VehiculoInsert) => Promise<boolean>
    actualizarVehiculo: (id: string, datos: VehiculoUpdate) => Promise<boolean>
    cambiarEstado: (id: string, estado: EstadoVehiculo) => Promise<boolean>
    asignarConductor: (vehiculoId: string, conductorId: string | null) => Promise<boolean>
    limpiarError: () => void

    conductoresDisponibles: ConductorOpcion[]
    cargandoConductores: boolean
    cargarConductoresPorAgencia: (agenciaId: string, vehiculoId: string) => Promise<void>
}

export const useVehiculosStore = create<VehiculosState>((set, get) => ({
    vehiculos: [],
    cargando: false,
    error: null,
    conductoresDisponibles: [],
    cargandoConductores: false,

    paginaActual: 1,
    totalRegistros: 0,
    totalPaginas: 0,
    filtrosActivos: {},

    cargarConductoresPorAgencia: async (agenciaId, vehiculoId) => {
        set({ cargandoConductores: true })
        try {
            const { data, error } = await supabase
                .from('conductores')
                .select(`
                    id,
                    usuario_id,
                    numero_licencia,
                    vehiculo_id,
                    usuario:usuario_id ( nombre )
                `)
                .eq('agencia_id', agenciaId)
                .eq('estado_suscripcion', 'activo')

            if (error) throw error

            const conductoresDisponibles: ConductorOpcion[] = (data ?? []).map(c => ({
                id: c.id,
                usuario_id: c.usuario_id,
                nombre: (c.usuario as { nombre: string } | null)?.nombre ?? '—',
                licencia: c.numero_licencia,
                tiene_vehiculo: !!c.vehiculo_id && c.vehiculo_id !== vehiculoId,
            }))

            set({ conductoresDisponibles })
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : 'Error desconocido' })
        } finally {
            set({ cargandoConductores: false })
        }
    },

    // ── cargar vehículos con paginación server-side ───────
    cargarVehiculos: async (filtros = {}, pagina = 1) => {
        set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
        try {
            const desde = (pagina - 1) * POR_PAGINA
            const hasta = desde + POR_PAGINA - 1

            let query = supabase
                .from('vehiculos')
                .select(`
                    *,
                    agencia:agencia_id ( nombre, codigo ),
                    conductor:conductor_id ( usuario_id, usuario:usuario_id ( nombre, telefono ) )
                `, { count: 'exact' })
                .order('fecha_registro', { ascending: false })
                .range(desde, hasta)

            // filtro por estado
            if (filtros.estado && filtros.estado !== 'todos') {
                query = query.eq('estado', filtros.estado as EstadoVehiculo)
            }

            // filtro por tipo
            if (filtros.tipo && filtros.tipo !== 'todos') {
                query = query.eq('tipo', filtros.tipo as TipoVehiculo)
            }

            // filtro por agencia
            if (filtros.agencia_id && filtros.agencia_id !== 'todas') {
                query = query.eq('agencia_id', filtros.agencia_id)
            }

            const { data, error, count } = await query
            if (error) throw error

            const total = count ?? 0
            const totalPaginas = Math.ceil(total / POR_PAGINA)

            const vehiculos = (data ?? []).map(v => {
                const agencia = Array.isArray(v.agencia) ? v.agencia[0] ?? null : v.agencia
                const conductorRaw = Array.isArray(v.conductor) ? v.conductor[0] ?? null : v.conductor
                const usuarioRaw = conductorRaw
                    ? (Array.isArray(conductorRaw.usuario) ? conductorRaw.usuario[0] ?? null : conductorRaw.usuario)
                    : null
                return {
                    ...v,
                    agencia,
                    conductor: usuarioRaw
                        ? { nombre: usuarioRaw.nombre, telefono: usuarioRaw.telefono }
                        : null,
                }
            })

            set({ vehiculos, totalRegistros: total, totalPaginas })
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : 'Error desconocido' })
        } finally {
            set({ cargando: false })
        }
    },

    cambiarPagina: async (pagina) => {
        const { filtrosActivos } = get()
        await get().cargarVehiculos(filtrosActivos, pagina)
    },

    crearVehiculo: async (datos) => {
        set({ cargando: true, error: null })
        try {
            const { error } = await supabase.from('vehiculos').insert(datos)
            if (error) throw error
            await get().cargarVehiculos(get().filtrosActivos, 1)
            return true
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : 'Error desconocido' })
            return false
        } finally {
            set({ cargando: false })
        }
    },

    actualizarVehiculo: async (id, datos) => {
        set({ cargando: true, error: null })
        try {
            const { error } = await supabase.from('vehiculos').update(datos).eq('id', id)
            if (error) throw error
            await get().cargarVehiculos(get().filtrosActivos, get().paginaActual)
            return true
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : 'Error desconocido' })
            return false
        } finally {
            set({ cargando: false })
        }
    },

    cambiarEstado: async (id, estado) => {
        try {
            const { error } = await supabase
                .from('vehiculos')
                .update({ estado })
                .eq('id', id)
            if (error) throw error
            await get().cargarVehiculos(get().filtrosActivos, get().paginaActual)
            return true
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : 'Error desconocido' })
            return false
        }
    },

    asignarConductor: async (vehiculoId, conductorId) => {
        try {
            const { data: vehiculoActual } = await supabase
                .from('vehiculos')
                .select('conductor_id')
                .eq('id', vehiculoId)
                .single()

            if (vehiculoActual?.conductor_id) {
                await supabase
                    .from('conductores')
                    .update({ vehiculo_id: null })
                    .eq('id', vehiculoActual.conductor_id)
            }

            if (conductorId) {
                const { data: conductorActual } = await supabase
                    .from('conductores')
                    .select('vehiculo_id')
                    .eq('id', conductorId)
                    .single()

                if (conductorActual?.vehiculo_id) {
                    await supabase
                        .from('vehiculos')
                        .update({ conductor_id: null })
                        .eq('id', conductorActual.vehiculo_id)
                }

                await supabase
                    .from('conductores')
                    .update({ vehiculo_id: vehiculoId })
                    .eq('id', conductorId)
            }

            const { error } = await supabase
                .from('vehiculos')
                .update({ conductor_id: conductorId })
                .eq('id', vehiculoId)

            if (error) throw error

            await get().cargarVehiculos(get().filtrosActivos, get().paginaActual)
            return true
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : 'Error desconocido' })
            return false
        }
    },

    limpiarError: () => set({ error: null }),
}))