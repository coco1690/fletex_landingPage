import { create } from 'zustand'
import { supabase } from '../supabase/client'
import type { UsuarioRow } from '../types'
import { ROLES_DASHBOARD } from '../lib/constants'

interface AuthState {
  usuario: UsuarioRow | null
  cargando: boolean
  error: string | null
  listo: boolean

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
    } catch (e: any) {
      set({ error: e.message })
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
      if (!ROLES_DASHBOARD.includes(data.rol as any)) {
        await supabase.auth.signOut()
        throw new Error('No tienes permisos para acceder al dashboard')
      }

      set({ usuario: data })
    } catch (e: any) {
      set({ error: e.message, usuario: null })
    } finally {
      set({ listo: true })
    }
  },

  cerrarSesion: async () => {
    set({ cargando: true })
    try {
      await supabase.auth.signOut()
      set({ usuario: null })
    } catch (e: any) {
      set({ error: e.message })
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null }),
}))