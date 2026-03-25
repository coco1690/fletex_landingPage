import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, Loader2, ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePagoResultadoStore } from '@/store/usePagoResultadoStore'
import { Logo } from '@/components/Logo'

export function PagoResultadoPage() {
  const [searchParams] = useSearchParams()
  const { estado, valorTotal, verificarTransaccion } = usePagoResultadoStore()
  const transactionId = searchParams.get('id')

  useEffect(() => {
    if (transactionId) verificarTransaccion(transactionId)
  }, [transactionId])

  const valorFormateado = valorTotal
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valorTotal)
    : null

  if (estado === 'verificando') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <Logo size="lg" />
        </div>
        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-6 shadow-sm">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground">Verificando pago</h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Confirmando tu transacción con Wompi, espera un momento.
              </p>
            </div>
            <div className="w-full bg-border rounded-full h-1 overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (estado === 'pagado') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <Logo size="lg" />
        </div>
        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Header verde */}
            <div className="bg-success/10 border-b border-success/20 px-8 pt-8 pb-6 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-success" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-success mb-1">Pago confirmado</p>
                <h1 className="text-3xl font-bold text-foreground">
                  {valorFormateado ?? '—'}
                </h1>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6 flex flex-col gap-5">
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Estado</p>
                <p className="text-sm font-medium text-foreground">Tu reserva fue confirmada exitosamente</p>
              </div>

              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Abre la app Fletex para ver tu tiquete de abordaje con el código QR.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full h-12 text-sm font-semibold rounded-xl"
                  onClick={() => window.location.href = 'fletex-pasajero://reserva'}
                >
                  Abrir app Fletex
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-10 text-sm text-muted-foreground"
                  onClick={() => window.location.href = '/'}
                >
                  Volver al inicio
                </Button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Pagos procesados de forma segura por <span className="font-medium">Wompi</span>
          </p>
        </div>
      </div>
    )
  }

  if (estado === 'fallido') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <Logo size="lg" />
        </div>
        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-error/10 border-b border-error/20 px-8 pt-8 pb-6 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-error/15 flex items-center justify-center">
                <XCircle className="w-9 h-9 text-error" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-error mb-1">Pago fallido</p>
                <h1 className="text-2xl font-bold text-foreground">No se pudo procesar</h1>
              </div>
            </div>

            <div className="px-8 py-6 flex flex-col gap-5">
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">¿Qué pasó?</p>
                <p className="text-sm font-medium text-foreground">El pago fue rechazado. Los cupos fueron liberados automáticamente.</p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full h-12 text-sm font-semibold rounded-xl"
                  onClick={() => window.location.href = 'fletex-pasajero://inicio'}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Intentar de nuevo
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-10 text-sm text-muted-foreground"
                  onClick={() => window.location.href = '/'}
                >
                  Volver al inicio
                </Button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Pagos procesados de forma segura por <span className="font-medium">Wompi</span>
          </p>
        </div>
      </div>
    )
  }

  if (estado === 'expirado') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <Logo size="lg" />
        </div>
        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-warning/10 border-b border-warning/20 px-8 pt-8 pb-6 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-warning/15 flex items-center justify-center">
                <Clock className="w-9 h-9 text-warning" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-warning mb-1">Tiempo agotado</p>
                <h1 className="text-2xl font-bold text-foreground">Reserva expirada</h1>
              </div>
            </div>

            <div className="px-8 py-6 flex flex-col gap-5">
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">¿Qué pasó?</p>
                <p className="text-sm font-medium text-foreground">El tiempo para completar el pago expiró. Los cupos fueron liberados.</p>
              </div>

              <Button
                className="w-full h-12 text-sm font-semibold rounded-xl"
                onClick={() => window.location.href = 'fletex-pasajero://inicio'}
              >
                Volver a reservar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Pagos procesados de forma segura por <span className="font-medium">Wompi</span>
          </p>
        </div>
      </div>
    )
  }

  // Estado pendiente
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-info/10 border-b border-info/20 px-8 pt-8 pb-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-info/15 flex items-center justify-center">
              <Clock className="w-9 h-9 text-info" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-info mb-1">En proceso</p>
              <h1 className="text-2xl font-bold text-foreground">Procesando pago</h1>
            </div>
          </div>

          <div className="px-8 py-6 flex flex-col gap-5">
            <div className="bg-secondary rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Estado</p>
              <p className="text-sm font-medium text-foreground">Tu pago está siendo procesado. Abre la app para ver el estado.</p>
            </div>

            <Button
              className="w-full h-12 text-sm font-semibold rounded-xl"
              onClick={() => window.location.href = 'fletex-pasajero://reserva'}
            >
              Abrir app Fletex
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Pagos procesados de forma segura por <span className="font-medium">Wompi</span>
        </p>
      </div>
    </div>
  )
}