// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// type Tema = 'light' | 'dark'

// interface ThemeState {
//   tema: Tema
//   toggle: () => void
//   setTema: (tema: Tema) => void
// }

// export const useThemeStore = create<ThemeState>()(
//   persist(
//     (set, get) => ({
//       tema: 'light',

//       toggle: () => {
//         const nuevoTema = get().tema === 'light' ? 'dark' : 'light'
//         set({ tema: nuevoTema })
//         document.documentElement.classList.toggle('dark', nuevoTema === 'dark')
//       },

//       setTema: (tema) => {
//         set({ tema })
//         document.documentElement.classList.toggle('dark', tema === 'dark')
//       },
//     }),
//     {
//       name: 'fletex-tema',
//       onRehydrateStorage: () => (state) => {
//         // aplicar tema guardado al recargar
//         if (state?.tema === 'dark') {
//           document.documentElement.classList.add('dark')
//         }
//       },
//     }
//   )
// )

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Tema = 'light' | 'dark'

interface ThemeState {
  tema: Tema
  toggle: () => void
  setTema: (tema: Tema) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      tema: 'light',

      toggle: () => {
        const nuevoTema: Tema = get().tema === 'light' ? 'dark' : 'light'

        document.documentElement.classList.toggle('dark', nuevoTema === 'dark')

        set({ tema: nuevoTema })
      },

      setTema: (tema: Tema) => {
        document.documentElement.classList.toggle('dark', tema === 'dark')

        set({ tema })
      },
    }),
    {
      name: 'fletex-tema',

      onRehydrateStorage: () => (state) => {
        document.documentElement.classList.toggle('dark', state?.tema === 'dark')
      },
    }
  )
)