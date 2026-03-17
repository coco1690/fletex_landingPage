import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

import { supabase } from './supabase/client'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'

export default function App() {
  const { cargarPerfil } = useAuthStore()
  const { tema } = useThemeStore()

  // aplicar tema al montar
  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'dark')
  }, [tema])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) cargarPerfil()
      else useAuthStore.setState({ listo: true })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          useAuthStore.setState({ usuario: null, listo: true })
        }
        if (event === 'SIGNED_IN' && session) {
          cargarPerfil()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return <RouterProvider router={router} />
}