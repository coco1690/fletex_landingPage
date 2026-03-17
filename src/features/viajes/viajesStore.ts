import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { Database } from '@/supabase/types'

type ViajeRow = Database['public']['Tables']['viajes']['Row']
type EstadoViaje = Database['public']['Enums']['estado_viaje']

export type Viaje = ViajeRow & {
    ruta?: {
        nombre: string
        precio_pasaje: number
        agencia_origen: { nombre: string } | null
        agencia_destino: { nombre: string } | null
    } | null
    conductor?: {
        usuario: { nombre: string; telefono: string | null } | null
    } | null
    vehiculo?: {
        placa: string
        tipo: string
        capacidad_pasajeros: number
    } | null
    punto_abordaje?: { nombre: string } | null
}

export interface ConductorOpcion { id: string; nombre: string; placa: string | null }
export interface RutaOpcion { id: string; nombre: string; precio_pasaje: number }
export interface VehiculoOpcion { id: string; placa: string; tipo: string; capacidad_pasajeros: number }
export interface PuntoAbordajeOpcion { id: string; nombre: string }

export interface DatosViaje {
    conductor_id: string
    ruta_id: string
    vehiculo_id: string
    hora_salida_programada: string
    precio_pasaje: number
    acepta_encomiendas: boolean
    carga_disponible_kg: number | null
    punto_abordaje_id: string | null
    observaciones: string | null
}

export interface FiltrosViaje {
    fecha?: string
    estado?: string
}

// ── constante de paginación ───────────────────────────────
export const POR_PAGINA = 8

interface ViajesState {
    viajes: Viaje[]
    cargando: boolean
    error: string | null

    // paginación
    paginaActual: number
    totalRegistros: number
    totalPaginas: number
    filtrosActivos: FiltrosViaje

    // selects
    conductoresOpciones: ConductorOpcion[]
    rutasOpciones: RutaOpcion[]
    vehiculosOpciones: VehiculoOpcion[]
    puntosAbordajeOpciones: PuntoAbordajeOpcion[]

    // acciones
    cargarViajes: (filtros?: FiltrosViaje, pagina?: number) => Promise<void>
    cambiarPagina: (pagina: number) => Promise<void>
    cargarSelects: () => Promise<void>
    crearViaje: (datos: DatosViaje) => Promise<boolean>
    actualizarViaje: (id: string, datos: Partial<DatosViaje>) => Promise<boolean>
    cancelarViaje: (id: string, motivo: string, canceladoPor: string) => Promise<boolean>
    eliminarViaje: (id: string) => Promise<boolean>
    limpiarError: () => void
}

export const useViajesStore = create<ViajesState>((set, get) => ({
    viajes: [],
    cargando: false,
    error: null,

    // paginación
    paginaActual: 1,
    totalRegistros: 0,
    totalPaginas: 0,
    filtrosActivos: {},

    // selects
    conductoresOpciones: [],
    rutasOpciones: [],
    vehiculosOpciones: [],
    puntosAbordajeOpciones: [],

    // ── cargar viajes con paginación server-side ──────────
    cargarViajes: async (filtros = {}, pagina = 1) => {
        set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
        try {
            const desde = (pagina - 1) * POR_PAGINA
            const hasta = desde + POR_PAGINA - 1

            let query = supabase
                .from('viajes')
                .select(`
          *,
          ruta:ruta_id (
            nombre,
            precio_pasaje,
            agencia_origen:agencia_origen_id   ( nombre ),
            agencia_destino:agencia_destino_id ( nombre )
          ),
          conductor:conductor_id (
            usuario:usuario_id ( nombre, telefono )
          ),
          vehiculo:vehiculo_id ( placa, tipo, capacidad_pasajeros ),
          punto_abordaje:punto_abordaje_id ( nombre )
        `, { count: 'exact' })  // ← count exacto para paginación
                .order('hora_salida_programada', { ascending: false })
                .range(desde, hasta)    // ← solo trae los registros de esta página

            // filtro por estado
            if (filtros.estado && filtros.estado !== 'todos') {
                query = query.eq('estado', filtros.estado as EstadoViaje)
            }

            // filtro por fecha
            if (filtros.fecha) {
                const inicio = `${filtros.fecha}T00:00:00`
                const fin = `${filtros.fecha}T23:59:59`
                query = query
                    .gte('hora_salida_programada', inicio)
                    .lte('hora_salida_programada', fin)
            }

            const { data, error, count } = await query
            if (error) throw error

            const total = count ?? 0
            const totalPaginas = Math.ceil(total / POR_PAGINA)

            const viajes = (data ?? []).map(v => ({
                ...v,
                ruta: Array.isArray(v.ruta) ? v.ruta[0] ?? null : v.ruta,
                conductor: Array.isArray(v.conductor) ? v.conductor[0] ?? null : v.conductor,
                vehiculo: Array.isArray(v.vehiculo) ? v.vehiculo[0] ?? null : v.vehiculo,
                punto_abordaje: Array.isArray(v.punto_abordaje) ? v.punto_abordaje[0] ?? null : v.punto_abordaje,
            }))

            set({ viajes, totalRegistros: total, totalPaginas })
        } catch (e: any) {
            set({ error: e.message })
        } finally {
            set({ cargando: false })
        }
    },

    // ── cambiar página ─────────────────────────────────────
    cambiarPagina: async (pagina) => {
        const { filtrosActivos } = get()
        await get().cargarViajes(filtrosActivos, pagina)
    },

    // ── cargar selects ─────────────────────────────────────
    cargarSelects: async () => {
        try {
            const [
                { data: rawConductores },
                { data: rutas },
                { data: vehiculos },
                { data: puntos },
            ] = await Promise.all([
                supabase
                    .from('conductores')
                    .select(`
            id,
            vehiculo:vehiculo_id ( placa ),
            usuario:usuario_id   ( nombre )
          `)
                    .eq('estado_suscripcion', 'activo'),

                supabase
                    .from('rutas')
                    .select('id, nombre, precio_pasaje')
                    .eq('activa', true)
                    .order('nombre'),

                supabase
                    .from('vehiculos')
                    .select('id, placa, tipo, capacidad_pasajeros')
                    .eq('estado', 'activo')
                    .order('placa'),

                supabase
                    .from('puntos_abordaje')
                    .select('id, nombre')
                    .eq('activo', true)
                    .order('nombre'),
            ])

            const conductoresOpciones: ConductorOpcion[] = (rawConductores ?? []).map(c => ({
                id: c.id,
                nombre: (c.usuario as any)?.nombre ?? '—',
                placa: (c.vehiculo as any)?.placa ?? null,
            }))

            set({
                conductoresOpciones,
                rutasOpciones: rutas ?? [],
                vehiculosOpciones: vehiculos ?? [],
                puntosAbordajeOpciones: puntos ?? [],
            })
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    // ── CRUD ───────────────────────────────────────────────
    crearViaje: async (datos) => {
        set({ cargando: true, error: null })
        try {
            const { error } = await supabase.rpc('crear_viaje', {
                p_conductor_id: datos.conductor_id,
                p_ruta_id: datos.ruta_id,
                p_vehiculo_id: datos.vehiculo_id,
                p_hora_salida: datos.hora_salida_programada,
                p_punto_abordaje_id: datos.punto_abordaje_id ?? '',
                p_acepta_encomiendas: datos.acepta_encomiendas,
                p_carga_disponible_kg: datos.carga_disponible_kg ?? undefined,
                p_observaciones: datos.observaciones ?? undefined,
            })
            if (error) throw error
            // volver a página 1 al crear
            await get().cargarViajes(get().filtrosActivos, 1)
            return true
        } catch (e: any) {
            set({ error: e.message })
            return false
        } finally {
            set({ cargando: false })
        }
    },

    actualizarViaje: async (id, datos) => {
        set({ cargando: true, error: null })
        try {
            const { error } = await supabase
                .from('viajes').update(datos).eq('id', id)
            if (error) throw error
            await get().cargarViajes(get().filtrosActivos, get().paginaActual)
            return true
        } catch (e: any) {
            set({ error: e.message })
            return false
        } finally {
            set({ cargando: false })
        }
    },

    cancelarViaje: async (id, motivo, canceladoPor) => {
        set({ cargando: true, error: null })
        try {
            const { error } = await supabase
                .from('viajes')
                .update({
                    estado: 'cancelado',
                    motivo_cancelacion: motivo,
                    cancelado_por: canceladoPor,
                })
                .eq('id', id)
            if (error) throw error
            await get().cargarViajes(get().filtrosActivos, get().paginaActual)
            return true
        } catch (e: any) {
            set({ error: e.message })
            return false
        } finally {
            set({ cargando: false })
        }
    },

    eliminarViaje: async (id) => {
        set({ cargando: true, error: null })
        try {
            const { error } = await supabase
                .from('viajes').delete().eq('id', id)
            if (error) throw error
            // si era el último de la página, ir a la anterior
            const { paginaActual, viajes, filtrosActivos } = get()
            const nuevaPagina = viajes.length === 1 && paginaActual > 1
                ? paginaActual - 1
                : paginaActual
            await get().cargarViajes(filtrosActivos, nuevaPagina)
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