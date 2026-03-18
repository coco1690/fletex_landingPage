import { create } from 'zustand'
import { supabase } from '@/supabase/client'

type EstadoPago = 'verificando' | 'pagado' | 'fallido' | 'expirado' | 'pendiente'

interface PagoResultadoState {
  estado: EstadoPago
  valorTotal: number | null
  verificando: boolean
  verificarTransaccion: (transactionId: string) => Promise<void>
}

export const usePagoResultadoStore = create<PagoResultadoState>((set) => ({
  estado: 'verificando',
  valorTotal: null,
  verificando: false,

  verificarTransaccion: async (transactionId) => {
    set({ verificando: true })
    try {
      const { data } = await supabase
        .from('reservas')
        .select('estado_pago, valor_total')
        .eq('wompi_transaction_id', transactionId)
        .single()

      if (data) {
        set({ estado: data.estado_pago as EstadoPago, valorTotal: data.valor_total })
        return
      }

      // Webhook aún no llegó — reintentar en 3 segundos
      setTimeout(async () => {
        const { data: data2 } = await supabase
          .from('reservas')
          .select('estado_pago, valor_total')
          .eq('wompi_transaction_id', transactionId)
          .single()

        if (data2) {
          set({ estado: data2.estado_pago as EstadoPago, valorTotal: data2.valor_total })
        } else {
          set({ estado: 'pendiente' })
        }
      }, 3000)

    } catch {
      set({ estado: 'pendiente' })
    } finally {
      set({ verificando: false })
    }
  },
}))