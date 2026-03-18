// import { create } from 'zustand'
// import { supabase } from '@/supabase/client'
// import type { Database } from '@/supabase/types'

// type ConductorRow = Database['public']['Tables']['conductores']['Row']
// type EstadoGeneral = Database['public']['Enums']['estado_general']

// export type Conductor = ConductorRow & {
//   usuario?: {
//     nombre: string
//     telefono: string | null
//     email: string | null
//     estado: EstadoGeneral
//   } | null
//   agencia?: { nombre: string; codigo: string; region_id: string } | null
//   vehiculo?: {
//     placa: string
//     marca: string | null
//     modelo: string | null
//     tipo: string
//   } | null
// }

// export interface CrearConductorParams {
//   // usuario
//   nombre: string
//   telefono: string
//   email?: string
//   // conductor
//   agencia_id: string
//   numero_licencia: string
//   categoria_licencia: string
//   fecha_vencimiento_licencia: string
//   numero_nequi?: string
// }

// export interface RegistrarPagoParams {
//   conductor_id: string
//   plan_id: string
//   valor_pagado: number
//   referencia_nequi: string
//   fecha_pago: string
//   observaciones?: string
// }

// interface ConductoresState {
//   conductores: Conductor[]
//   cargando: boolean
//   error: string | null

//   cargarConductores: (agenciaId?: string) => Promise<void>
//   crearConductor: (datos: CrearConductorParams) => Promise<boolean>
//   actualizarConductor: (conductorId: string, datos: Partial<ConductorRow>) => Promise<boolean>
//   toggleEstadoUsuario: (usuarioId: string, estadoActual: EstadoGeneral) => Promise<boolean>
//   asignarVehiculo: (conductorId: string, vehiculoId: string | null) => Promise<boolean>
//   registrarPago: (datos: RegistrarPagoParams, registradoPor: string) => Promise<boolean>
//   limpiarError: () => void
// }

// export const useConductoresStore = create<ConductoresState>((set, get) => ({
//   conductores: [],
//   cargando: false,
//   error: null,

//   cargarConductores: async (agenciaId?: string) => {
//     set({ cargando: true, error: null })
//     try {
//       let query = supabase
//         .from('conductores')
//         .select(`
//           *,
//           usuario:usuario_id ( nombre, telefono, email, estado ),
//           agencia:agencia_id ( nombre, codigo, region_id ),
//           vehiculo:vehiculo_id ( placa, marca, modelo, tipo )
//         `)
//         .order('fecha_creacion', { ascending: false })

//       if (agenciaId) query = query.eq('agencia_id', agenciaId)

//       const { data, error } = await query
//       if (error) throw error

//       const conductores = (data ?? []).map(c => ({
//         ...c,
//         usuario: Array.isArray(c.usuario) ? c.usuario[0] ?? null : c.usuario,
//         agencia: Array.isArray(c.agencia) ? c.agencia[0] ?? null : c.agencia,
//         vehiculo: Array.isArray(c.vehiculo) ? c.vehiculo[0] ?? null : c.vehiculo,
//       }))

//       set({ conductores })
//     } catch (e: any) {
//       set({ error: e.message })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   // crearConductor: async (datos) => {
//   //   set({ cargando: true, error: null })
//   //   try {
//   //     // 1. crear usuario en auth (sin contraseña — solo phone OTP)
//   //     // Nota: supabase.auth.admin no está disponible desde el cliente

//   //     // alternativa: crear registro directo en usuarios con un UUID generado
//   //     // el conductor se autenticará después por OTP con su teléfono
//   //     const nuevoId = crypto.randomUUID()

//   //     const { error: usuarioError } = await supabase
//   //       .from('usuarios')
//   //       .insert({
//   //         id: nuevoId,
//   //         nombre: datos.nombre,
//   //         telefono: datos.telefono,
//   //         email: datos.email ?? null,
//   //         rol: 'conductor',
//   //         estado: 'activo',
//   //       })

//   //     if (usuarioError) throw usuarioError

//   //     const { error: conductorError } = await supabase
//   //       .from('conductores')
//   //       .insert({
//   //         usuario_id: nuevoId,
//   //         agencia_id: datos.agencia_id,
//   //         numero_licencia: datos.numero_licencia,
//   //         categoria_licencia: datos.categoria_licencia,
//   //         fecha_vencimiento_licencia: datos.fecha_vencimiento_licencia,
//   //         numero_nequi: datos.numero_nequi ?? null,
//   //         estado_suscripcion: 'pendiente_activacion',
//   //       })

//   //     if (conductorError) throw conductorError

//   //     await get().cargarConductores()
//   //     return true
//   //   } catch (e: any) {
//   //     set({ error: e.message })
//   //     return false
//   //   } finally {
//   //     set({ cargando: false })
//   //   }
//   // },

//   crearConductor: async (datos) => {
//     set({ cargando: true, error: null })
//     try {
//       // Obtener el token del usuario actual
//       const { data: { session } } = await supabase.auth.getSession()
//       if (!session) throw new Error('No hay sesión activa')

//       // Llamar a la Edge Function
//       const response = await fetch(
//         `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crear-conductor`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${session.access_token}`,
//           },
//           body: JSON.stringify(datos),
//         }
//       )

//       const result = await response.json()
//       if (!result.ok) throw new Error(result.error)

//       await get().cargarConductores()
//       return true
//     } catch (e: any) {
//       set({ error: e.message })
//       return false
//     } finally {
//       set({ cargando: false })
//     }
//   },


//   actualizarConductor: async (conductorId, datos) => {
//     set({ cargando: true, error: null })
//     try {
//       const { error } = await supabase
//         .from('conductores')
//         .update(datos)
//         .eq('id', conductorId)
//       if (error) throw error
//       await get().cargarConductores()
//       return true
//     } catch (e: any) {
//       set({ error: e.message })
//       return false
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   toggleEstadoUsuario: async (usuarioId, estadoActual) => {
//     const nuevoEstado: EstadoGeneral = estadoActual === 'activo' ? 'inactivo' : 'activo'
//     try {
//       const { error } = await supabase
//         .from('usuarios')
//         .update({ estado: nuevoEstado })
//         .eq('id', usuarioId)
//       if (error) throw error
//       set(state => ({
//         conductores: state.conductores.map(c =>
//           c.usuario_id === usuarioId
//             ? { ...c, usuario: c.usuario ? { ...c.usuario, estado: nuevoEstado } : null }
//             : c
//         )
//       }))
//       return true
//     } catch (e: any) {
//       set({ error: e.message })
//       return false
//     }
//   },

//   asignarVehiculo: async (conductorId, vehiculoId) => {
//     try {
//       const { error } = await supabase
//         .from('conductores')
//         .update({ vehiculo_id: vehiculoId })
//         .eq('id', conductorId)
//       if (error) throw error
//       await get().cargarConductores()
//       return true
//     } catch (e: any) {
//       set({ error: e.message })
//       return false
//     }
//   },

//   registrarPago: async (datos, registradoPor) => {
//     set({ cargando: true, error: null })
//     try {
//       const { error } = await supabase.rpc('registrar_pago_suscripcion', {
//         p_conductor_id: datos.conductor_id,
//         p_plan_id: datos.plan_id,
//         p_valor_pagado: datos.valor_pagado,
//         p_referencia_nequi: datos.referencia_nequi,
//         p_fecha_pago: datos.fecha_pago,
//         p_observaciones: datos.observaciones ?? undefined,
//         p_registrado_por: registradoPor,
//       })
//       if (error) throw error
//       await get().cargarConductores()
//       return true
//     } catch (e: any) {
//       set({ error: e.message })
//       return false
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   limpiarError: () => set({ error: null }),
// }))

import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { Database } from '@/supabase/types'

type ConductorRow = Database['public']['Tables']['conductores']['Row']
type EstadoGeneral = Database['public']['Enums']['estado_general']

export type Conductor = ConductorRow & {
  usuario?: {
    nombre: string
    telefono: string | null
    email: string | null
    estado: EstadoGeneral
  } | null
  agencia?: { nombre: string; codigo: string; region_id: string } | null
  vehiculo?: {
    placa: string
    marca: string | null
    modelo: string | null
    tipo: string
  } | null
}

export interface CrearConductorParams {
  nombre: string
  telefono: string
  email?: string
  agencia_id: string
  numero_licencia: string
  categoria_licencia: string
  fecha_vencimiento_licencia: string
  numero_nequi?: string
}

export interface RegistrarPagoParams {
  conductor_id: string
  plan_id: string
  valor_pagado: number
  referencia_nequi: string
  fecha_pago: string
  observaciones?: string
}

export interface FiltrosConductor {
  estado?: string
  suscripcion?: string
}

export const POR_PAGINA = 8

interface ConductoresState {
  conductores: Conductor[]
  cargando: boolean
  error: string | null

  // paginación
  paginaActual: number
  totalRegistros: number
  totalPaginas: number
  filtrosActivos: FiltrosConductor

  // acciones
  cargarConductores: (filtros?: FiltrosConductor, pagina?: number, agenciaId?: string) => Promise<void>
  cambiarPagina: (pagina: number) => Promise<void>
  crearConductor: (datos: CrearConductorParams) => Promise<boolean>
  actualizarConductor: (conductorId: string, datos: Partial<ConductorRow>) => Promise<boolean>
  toggleEstadoUsuario: (usuarioId: string, estadoActual: EstadoGeneral) => Promise<boolean>
  asignarVehiculo: (conductorId: string, vehiculoId: string | null) => Promise<boolean>
  registrarPago: (datos: RegistrarPagoParams, registradoPor: string) => Promise<boolean>
  limpiarError: () => void
}

export const useConductoresStore = create<ConductoresState>((set, get) => ({
  conductores: [],
  cargando: false,
  error: null,

  paginaActual: 1,
  totalRegistros: 0,
  totalPaginas: 0,
  filtrosActivos: {},

  // ── cargar conductores con paginación server-side ───────
  cargarConductores: async (filtros = {}, pagina = 1, agenciaId?: string) => {
    set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      let query = supabase
        .from('conductores')
        .select(`
          *,
          usuario:usuario_id ( nombre, telefono, email, estado ),
          agencia:agencia_id ( nombre, codigo, region_id ),
          vehiculo:vehiculo_id ( placa, marca, modelo, tipo )
        `, { count: 'exact' })
        .order('fecha_creacion', { ascending: false })
        .range(desde, hasta)

      if (agenciaId) query = query.eq('agencia_id', agenciaId)

      // filtro por estado del usuario (inner join filter)
      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('usuario.estado', filtros.estado as EstadoGeneral)
      }

      // filtro por suscripción
      if (filtros.suscripcion && filtros.suscripcion !== 'todas') {
        query = query.eq('estado_suscripcion', filtros.suscripcion as 'activo' | 'por_vencer' | 'suspendido' | 'pendiente_activacion')
      }

      const { data, error, count } = await query
      if (error) throw error

      const total = count ?? 0
      const totalPaginas = Math.ceil(total / POR_PAGINA)

      const conductores = (data ?? []).map(c => ({
        ...c,
        usuario: Array.isArray(c.usuario) ? c.usuario[0] ?? null : c.usuario,
        agencia: Array.isArray(c.agencia) ? c.agencia[0] ?? null : c.agencia,
        vehiculo: Array.isArray(c.vehiculo) ? c.vehiculo[0] ?? null : c.vehiculo,
      }))

      set({ conductores, totalRegistros: total, totalPaginas })
    } catch (e: any) {
      set({ error: e.message })
    } finally {
      set({ cargando: false })
    }
  },

  cambiarPagina: async (pagina) => {
    const { filtrosActivos } = get()
    await get().cargarConductores(filtrosActivos, pagina)
  },

  crearConductor: async (datos) => {
    set({ cargando: true, error: null })
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No hay sesión activa')

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crear-conductor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(datos),
        }
      )

      const result = await response.json()
      if (!result.ok) throw new Error(result.error)

      await get().cargarConductores(get().filtrosActivos, 1)
      return true
    } catch (e: any) {
      set({ error: e.message })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  actualizarConductor: async (conductorId, datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase
        .from('conductores')
        .update(datos)
        .eq('id', conductorId)
      if (error) throw error
      await get().cargarConductores(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: any) {
      set({ error: e.message })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  toggleEstadoUsuario: async (usuarioId, estadoActual) => {
    const nuevoEstado: EstadoGeneral = estadoActual === 'activo' ? 'inactivo' : 'activo'
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ estado: nuevoEstado })
        .eq('id', usuarioId)
      if (error) throw error
      await get().cargarConductores(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: any) {
      set({ error: e.message })
      return false
    }
  },

  asignarVehiculo: async (conductorId, vehiculoId) => {
    try {
      const { error } = await supabase
        .from('conductores')
        .update({ vehiculo_id: vehiculoId })
        .eq('id', conductorId)
      if (error) throw error
      await get().cargarConductores(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: any) {
      set({ error: e.message })
      return false
    }
  },

  registrarPago: async (datos, registradoPor) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.rpc('registrar_pago_suscripcion', {
        p_conductor_id: datos.conductor_id,
        p_plan_id: datos.plan_id,
        p_valor_pagado: datos.valor_pagado,
        p_referencia_nequi: datos.referencia_nequi,
        p_fecha_pago: datos.fecha_pago,
        p_observaciones: datos.observaciones ?? undefined,
        p_registrado_por: registradoPor,
      })
      if (error) throw error
      await get().cargarConductores(get().filtrosActivos, get().paginaActual)
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