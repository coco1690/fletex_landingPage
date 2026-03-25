import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/themeStore'
import logoLight from '@/assets/logo_light.svg'
import logoDark from '@/assets/logo_dark.svg'

type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  size?: LogoSize
  showText?: boolean
}

const tamanos: Record<LogoSize, { imagen: string; texto: string }> = {
  sm: { imagen: 'h-6 w-6', texto: 'text-sm' },
  md: { imagen: 'h-7 w-7', texto: 'text-base' },
  lg: { imagen: 'h-9 w-9', texto: 'text-lg' },
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const tema = useThemeStore((s) => s.tema)
  const t = tamanos[size]
  const logo = tema === 'dark' ? logoDark : logoLight

  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="Fletex" className={cn(t.imagen, 'rounded-lg')} />
      {showText && (
        <span className={cn('font-exo tracking-tight text-foreground', t.texto)}>
          FLETEX
        </span>
      )}
    </div>
  )
}
