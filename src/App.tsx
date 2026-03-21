import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'

export default function App() {
  const { inicializarAuth } = useAuthStore()
  const { tema } = useThemeStore()

  // aplicar tema al montar
  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'dark')
  }, [tema])

  useEffect(() => {
    const desuscribir = inicializarAuth()
    return desuscribir
  }, [inicializarAuth])

  return <RouterProvider router={router} />
}