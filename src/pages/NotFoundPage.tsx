import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Bus } from 'lucide-react'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-center px-6">
      <div>
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Bus className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-8">Página no encontrada</p>
        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    </div>
  )
}