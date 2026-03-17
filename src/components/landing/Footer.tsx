import { Bus } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Bus className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm">Fletex</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transporte inteligente en los llanos colombianos.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">App</p>
            <div className="flex flex-col gap-2">
              {['App Store', 'Google Play', 'Descargar'].map(l => (
                <span key={l} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Empresa</p>
            <div className="flex flex-col gap-2">
              {['Quiénes somos', 'Contacto', 'Agencias'].map(l => (
                <span key={l} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Contacto</p>
            <div className="flex flex-col gap-2">
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">💬 WhatsApp</a>
              <a href="mailto:contacto@fletex.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors">📧 Email</a>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Fletex. Todos los derechos reservados.</span>
          <span>Hecho con ❤️ en los llanos colombianos</span>
        </div>
      </div>
    </footer>
  )
}