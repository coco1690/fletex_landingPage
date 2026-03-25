import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import type { Database } from '@/supabase/types'

type UsuarioRow    = Database['public']['Tables']['usuarios']['Row']
type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update']
type EstadoGeneral = Database['public']['Enums']['estado_general']
type RolUsuario    = Database['public']['Enums']['rol_usuario']

export type Usuario = UsuarioRow & {
  agencia?: { nombre: string; codigo: string } | null
  region?:  { nombre: string; codigo: string } | null
}

export interface CrearUsuarioParams {
  nombre:      string
  email:       string
  password:    string
  telefono?:   string
  rol:         RolUsuario
  region_id?:  string
  agencia_id?: string
}

export interface FiltrosUsuario {
  estado?: string
  rol?:    string
}

export const POR_PAGINA = 8

interface UsuariosState {
  usuarios:        Usuario[]
  cargando:        boolean
  error:           string | null

  // paginación
  paginaActual:    number
  totalRegistros:  number
  totalPaginas:    number
  filtrosActivos:  FiltrosUsuario

  // acciones
  cargarUsuarios:    (filtros?: FiltrosUsuario, pagina?: number) => Promise<void>
  cambiarPagina:     (pagina: number) => Promise<void>
  crearUsuario:      (params: CrearUsuarioParams) => Promise<boolean>
  actualizarUsuario: (id: string, datos: UsuarioUpdate) => Promise<boolean>
  toggleEstado:      (id: string, estadoActual: EstadoGeneral) => Promise<boolean>
  limpiarError:      () => void
}

export const useUsuariosStore = create<UsuariosState>((set, get) => ({
  usuarios:        [],
  cargando:        false,
  error:           null,
  paginaActual:    1,
  totalRegistros:  0,
  totalPaginas:    0,
  filtrosActivos:  {},

  // ── cargar con paginación server-side ────────────────
  cargarUsuarios: async (filtros = {}, pagina = 1) => {
    set({ cargando: true, error: null, filtrosActivos: filtros, paginaActual: pagina })
    try {
      const desde = (pagina - 1) * POR_PAGINA
      const hasta = desde + POR_PAGINA - 1

      let query = supabase
        .from('usuarios')
        .select(`
          *,
          agencia:agencia_id (
            nombre, codigo
          ),
          region:region_id (
            nombre, codigo
          )
        `, { count: 'exact' })
        .order('fecha_registro', { ascending: false })
        .range(desde, hasta)

      // filtros
      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado as EstadoGeneral)
      }
      if (filtros.rol && filtros.rol !== 'todos') {
        query = query.eq('rol', filtros.rol as RolUsuario)
      }

      const { data, error, count } = await query
      if (error) throw error

      const total     = count ?? 0
      const totalPags = Math.ceil(total / POR_PAGINA)

      const usuarios = (data ?? []).map(u => ({
        ...u,
        agencia: Array.isArray(u.agencia) ? u.agencia[0] ?? null : u.agencia,
        region:  Array.isArray(u.region)  ? u.region[0]  ?? null : u.region,
      }))

      set({ usuarios, totalRegistros: total, totalPaginas: totalPags })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
    } finally {
      set({ cargando: false })
    }
  },

  // ── cambiar página ────────────────────────────────────
  cambiarPagina: async (pagina) => {
    await get().cargarUsuarios(get().filtrosActivos, pagina)
  },

  // ── crear usuario (Auth + tabla usuarios) ─────────────
  crearUsuario: async (params) => {
    set({ cargando: true, error: null })
    try {
      // 1. Crear en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email:    params.email,
        password: params.password,
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('No se pudo crear el usuario en Auth')

      // 2. Insertar en tabla usuarios
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert({
          id:         authData.user.id,
          nombre:     params.nombre,
          email:      params.email,
          telefono:   params.telefono || null,
          rol:        params.rol,
          region_id:  params.region_id || null,
          agencia_id: params.agencia_id || null,
        })
      if (dbError) throw dbError

      await get().cargarUsuarios(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al crear usuario' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  // ── actualizar usuario ────────────────────────────────
  actualizarUsuario: async (id, datos) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase
        .from('usuarios')
        .update(datos)
        .eq('id', id)
      if (error) throw error
      await get().cargarUsuarios(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al actualizar usuario' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  // ── toggle estado activo/inactivo ─────────────────────
  toggleEstado: async (id, estadoActual) => {
    const nuevoEstado: EstadoGeneral = estadoActual === 'activo' ? 'inactivo' : 'activo'
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ estado: nuevoEstado })
        .eq('id', id)
      if (error) throw error
      await get().cargarUsuarios(get().filtrosActivos, get().paginaActual)
      return true
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error al cambiar estado' })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null }),
}))
