import { Building2, MapPin, Clock, Power } from 'lucide-react'
import { MenuAcciones }    from '@/components/shared/MenuAcciones'
import { EstadoBadge }     from '@/components/shared/EstadoBadge'
import { RolBadge }        from './RolBadge'
import { cn }              from '@/lib/utils'
import type { Usuario }   from '../usuariosStore'

interface Props {
  usuarios:        Usuario[]
  usuarioDetalle:  Usuario | null
  onSeleccionar:   (u: Usuario) => void
  onToggleEstado:  (u: Usuario) => void
}

export function TablaUsuarios({
  usuarios, usuarioDetalle,
  onSeleccionar, onToggleEstado,
}: Props) {
  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-420px)]">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border">
            {['Usuario', 'Rol', 'Región', 'Agencia', 'Último acceso', 'Estado', ''].map(h => (
              <th
                key={h}
                className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4 py-3 first:pl-5 last:pr-5"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {usuarios.map(usuario => {
            const esSeleccionado = usuarioDetalle?.id === usuario.id
            return (
              <tr
                key={usuario.id}
                onClick={() => onSeleccionar(usuario)}
                className={cn(
                  'hover:bg-secondary/30 transition-colors cursor-pointer',
                  esSeleccionado && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                {/* Usuario */}
                <td className="px-4 py-3 pl-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {usuario.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {usuario.nombre}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {usuario.email ?? 'Sin email'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Rol */}
                <td className="px-4 py-3">
                  <RolBadge rol={usuario.rol} />
                </td>

                {/* Región */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-foreground">
                      {usuario.region?.nombre ?? '—'}
                    </span>
                  </div>
                </td>

                {/* Agencia */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-foreground">
                      {usuario.agencia?.nombre ?? '—'}
                    </span>
                  </div>
                </td>

                {/* Último acceso */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-xs text-foreground">
                      {usuario.ultimo_acceso
                        ? new Date(usuario.ultimo_acceso).toLocaleString('es-CO', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                          })
                        : 'Nunca'}
                    </span>
                  </div>
                </td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <EstadoBadge estado={usuario.estado} />
                </td>

                {/* Acciones */}
                <td className="px-4 py-3 pr-5" onClick={e => e.stopPropagation()}>
                  <MenuAcciones items={[
                    {
                      icon:  <Power className="w-3.5 h-3.5" />,
                      label: usuario.estado === 'activo' ? 'Desactivar' : 'Activar',
                      fn:    () => onToggleEstado(usuario),
                      danger: usuario.estado === 'activo',
                    },
                  ]} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
