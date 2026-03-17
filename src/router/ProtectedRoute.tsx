import { useAuthStore } from '@/store/authStore'
import { Navigate, Outlet } from 'react-router-dom'


export function ProtectedRoute() {
  const { usuario, listo } = useAuthStore()

  if (!listo) return null // esperar a que cargue

  if (!usuario) return <Navigate to="/login" replace />

  return <Outlet />
}