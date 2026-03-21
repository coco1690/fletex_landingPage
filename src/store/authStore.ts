import { create } from 'zustand'
import { supabase } from '../supabase/client'
import type { UsuarioRow } from '../types'
import { ROLES_DASHBOARD, type Rol } from '../lib/constants'

interface AuthState {
  usuario: UsuarioRow | null
  cargando: boolean
  error: string | null
  listo: boolean

  inicializarAuth: () => () => void
  iniciarSesion: (email: string, password: string) => Promise<void>
  cerrarSesion: () => Promise<void>
  cargarPerfil: () => Promise<void>
  limpiarError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: null,
  cargando: false,
  error: null,
  listo: false,

  inicializarAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) get().cargarPerfil()
      else set({ listo: true })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          set({ usuario: null, listo: true })
        }
        if (event === 'SIGNED_IN' && session) {
          get().cargarPerfil()
        }
      }
    )

    return () => subscription.unsubscribe()
  },

  iniciarSesion: async (email, password) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      if (!data.user) throw new Error('No se pudo iniciar sesión')

      await get().cargarPerfil()
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
    } finally {
      set({ cargando: false })
    }
  },

  cargarPerfil: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No hay sesión activa')

      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('Usuario no encontrado')

      // solo roles del dashboard pueden acceder
      if (!ROLES_DASHBOARD.includes(data.rol as Rol)) {
        await supabase.auth.signOut()
        throw new Error('No tienes permisos para acceder al dashboard')
      }

      set({ usuario: data })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido', usuario: null })
    } finally {
      set({ listo: true })
    }
  },

  cerrarSesion: async () => {
    set({ cargando: true })
    try {
      await supabase.auth.signOut()
      set({ usuario: null })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Error desconocido' })
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null }),
}))