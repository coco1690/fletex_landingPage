import { Building2, MapPin, Clock, Power } from 'lucide-react'
import { MenuAcciones }    from '@/components/shared/MenuAcciones'
import { EstadoBadge }     from '@/components/shared/EstadoBadge'
import { RolBadge }        from './RolBadge'
import { cn }              from '@/lib/utils'
import type { Usuario }   from '../usuariosStore'

interface Props {
  usuario:        Usuario
  esSeleccionado: boolean
  onSeleccionar:  () => void
  onToggleEstado: () => void
}

export function UsuarioCard({
  usuario, esSeleccionado,
  onSeleccionar, onToggleEstado,
}: Props) {
  return (
    <div
      onClick={onSeleccionar}
      className={cn(
        'p-4 cursor-pointer hover:bg-secondary/30 transition-colors',
        esSeleccionado && 'bg-primary/5 border-l-2 border-l-primary'
      )}
    >
      {/* Fila superior: nombre + estado + menú */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sm font-bold text-primary">
              {usuario.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {usuario.nombre}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {usuario.email ?? 'Sin email'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <EstadoBadge estado={usuario.estado} />
          <MenuAcciones items={[
            {
              icon:  <Power className="w-3.5 h-3.5" />,
              label: usuario.estado === 'activo' ? 'Desactivar' : 'Activar',
              fn:    onToggleEstado,
              danger: usuario.estado === 'activo',
            },
          ]} />
        </div>
      </div>

      {/* Rol */}
      <div className="mt-2.5">
        <RolBadge rol={usuario.rol} />
      </div>

      {/* Detalles */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] text-foreground truncate">
            {usuario.region?.nombre ?? '—'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] text-foreground truncate">
            {usuario.agencia?.nombre ?? '—'}
          </span>
        </div>
      </div>

      {/* Último acceso */}
      <div className="mt-2 flex items-center gap-1.5">
        <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="text-[10px] text-muted-foreground">
          Último acceso: {usuario.ultimo_acceso
            ? new Date(usuario.ultimo_acceso).toLocaleString('es-CO', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              })
            : 'Nunca'}
        </span>
      </div>
    </div>
  )
}
