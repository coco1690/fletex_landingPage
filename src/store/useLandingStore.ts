import { create } from 'zustand'

interface LandingState {
  whatsappNumber: string
  whatsappMessage: string
  openWhatsApp: () => void
}

export const useLandingStore = create<LandingState>((_, get) => ({
  whatsappNumber: '573148632751',
  whatsappMessage: 'Hola, vengo de la página de Fletex y necesito ayuda',

  openWhatsApp: () => {
    const { whatsappNumber, whatsappMessage } = get()
    const encodedMessage = encodeURIComponent(whatsappMessage)
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      '_blank'
    )
  },
}))