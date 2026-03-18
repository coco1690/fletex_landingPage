import { Button } from '@/components/ui/button'
import { useLandingStore } from '@/store/useLandingStore'
import { Headset } from 'lucide-react'


export function WhatsAppButton() {
  const openWhatsApp = useLandingStore((state) => state.openWhatsApp)

  return (
    <div className="relative">
      {/* Onda radar 1 */}
      <span
        className="
          absolute inset-0 rounded-full
          bg-primary opacity-0
          animate-[radar_2s_ease-out_infinite]
        "
      />
      {/* Onda radar 2 (desfasada) */}
      <span
        className="
          absolute inset-0 rounded-full
          bg-primary opacity-0
          animate-[radar_2s_ease-out_1s_infinite]
        "
      />

      <Button
        onClick={openWhatsApp}
        size="icon"
        variant="default"
        className="
          relative z-10
          h-12 w-12 rounded-full
          bg-primary hover:bg-primary/90
          text-primary-foreground
          shadow-[0_4px_20px_rgba(37,99,235,0.4)]
          dark:shadow-[0_4px_20px_rgba(29,158,117,0.4)]
          hover:shadow-[0_6px_30px_rgba(37,99,235,0.5)]
          dark:hover:shadow-[0_6px_30px_rgba(29,158,117,0.5)]
          hover:scale-110
          transition-all duration-300 ease-in-out
        "
        aria-label="Soporte por WhatsApp"
      >
        <Headset className="h-6 w-6" />
      </Button>
    </div>
  )
}