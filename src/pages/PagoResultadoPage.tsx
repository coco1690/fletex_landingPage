import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePagoResultadoStore } from '@/store/usePagoResultadoStore'

export function PagoResultadoPage() {
    const [searchParams] = useSearchParams()
    const { estado, valorTotal, verificarTransaccion } = usePagoResultadoStore()
    const transactionId = searchParams.get('id')

    useEffect(() => {
        if (transactionId) {
            verificarTransaccion(transactionId)
        }
    }, [transactionId])

    const valorFormateado = valorTotal ? valorTotal.toLocaleString('es-CO') : null

    if (estado === 'verificando') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center gap-6 py-12">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Verificando pago...</h1>
                            <p className="text-muted-foreground mt-2">
                                Estamos confirmando tu transacción, espera un momento.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (estado === 'pagado') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center gap-6 py-12">
                        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="w-14 h-14 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">¡Pago exitoso!</h1>
                            {valorFormateado && (
                                <p className="text-3xl font-bold text-primary mt-2">
                                    ${valorFormateado}
                                </p>
                            )}
                            <p className="text-muted-foreground mt-3">
                                Tu reserva fue confirmada. Abre la app Fletex para ver tu tiquete de abordaje.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                className="w-full"
                                onClick={() => window.location.href = 'fletex-pasajero://reserva'}
                            >
                                Abrir app Fletex
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
                                Volver al inicio
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (estado === 'fallido') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center gap-6 py-12">
                        <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <XCircle className="w-14 h-14 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Pago fallido</h1>
                            <p className="text-muted-foreground mt-2">
                                No se pudo procesar tu pago. Los cupos fueron liberados. Puedes intentarlo de nuevo desde la app.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                className="w-full"
                                onClick={() => window.location.href = 'fletex-pasajero://reservar'}
                            >
                                Intentar de nuevo
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
                                Volver al inicio
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (estado === 'expirado') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center gap-6 py-12">
                        <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Clock className="w-14 h-14 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Reserva expirada</h1>
                            <p className="text-muted-foreground mt-2">
                                El tiempo para completar el pago expiró. Los cupos fueron liberados.
                            </p>
                        </div>
                        <Button
                            className="w-full"
                            onClick={() => window.location.href = 'fletex-pasajero://inicio'}
                        >
                            Abrir app Fletex
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Estado pendiente
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center gap-6 py-12">
                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Clock className="w-14 h-14 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Procesando pago</h1>
                        <p className="text-muted-foreground mt-2">
                            Tu pago está siendo procesado. Abre la app Fletex para ver el estado de tu reserva.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Button
                            className="w-full"
                            onClick={() => window.location.href = 'fletex-pasajero://reserva'}
                        >
                            Abrir app Fletex
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
                            Volver al inicio
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}