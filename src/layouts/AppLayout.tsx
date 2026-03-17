import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'


export function AppLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* Sidebar desktop — siempre visible */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Sidebar mobile — drawer */}
      {sidebarAbierto && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarAbierto(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar onCerrar={() => setSidebarAbierto(false)} />
          </div>
        </>
      )}

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onAbrirSidebar={() => setSidebarAbierto(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

    </div>
  )
}