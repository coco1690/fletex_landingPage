import { useEffect, useState } from 'react'
import { Users, User } from 'lucide-react'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useUsuariosStore, type Usuario, POR_PAGINA } from './usuariosStore'
import { TablaPage }        from '@/components/shared/TablaPage'
import { TablaVacia }       from '@/components/shared/TablaVacia'
import { PanelDetalle }     from '@/components/shared/PanelDetalle'
import { Paginacion }       from '@/components/shared/Paginacion'
import { EstadoBadge }      from '@/components/shared/EstadoBadge'
import { RolBadge }         from './components/RolBadge'
import { UsuarioCard }      from './components/UsuarioCard'
import { TablaUsuarios }    from './components/TablaUsuarios'
import { ModalUsuario }     from './ModalUsuario'

export function UsuariosPage() {
  const {
    usuarios, cargando, error,
    paginaActual, totalRegistros, totalPaginas,
    cargarUsuarios, cambiarPagina,
    crearUsuario, actualizarUsuario,
    toggleEstado, limpiarError,
  } = useUsuariosStore()

  const [busqueda, setBusqueda]           = useState('')
  const [filtroEstado, setFiltroEstado]   = useState('todos')
  const [filtroRol, setFiltroRol]         = useState('todos')
  const [usuarioDetalle, setUsuarioDetalle] = useState<Usuario | null>(null)
  const [modalAbierto, setModalAbierto]     = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)

  // ── carga inicial ─────────────────────────────────────
  useEffect(() => { cargarUsuarios() }, [])

  // ── recargar al cambiar filtros ───────────────────────
  useEffect(() => {
    cargarUsuarios({
      estado: filtroEstado !== 'todos' ? filtroEstado : undefined,
      rol:    filtroRol    !== 'todos' ? filtroRol    : undefined,
    }, 1)
  }, [filtroEstado, filtroRol])

  // ── filtro local búsqueda ─────────────────────────────
  const filtrados = usuarios.filter(u => {
    const q       = busqueda.toLowerCase()
    const nombre  = u.nombre.toLowerCase()
    const email   = u.email?.toLowerCase() ?? ''
    const telefono = u.telefono?.toLowerCase() ?? ''
    return nombre.includes(q) || email.includes(q) || telefono.includes(q)
  })

  // ── handlers ─────────────────────────────────────────
  const handleSeleccionar = (u: Usuario) =>
    setUsuarioDetalle(usuarioDetalle?.id === u.id ? null : u)

  const handleToggleEstado = async (u: Usuario) => {
    const ok = await toggleEstado(u.id, u.estado)
    if (ok && usuarioDetalle?.id === u.id) setUsuarioDetalle(null)
  }

  const handleCrear = () => {
    setUsuarioEditando(null)
    setModalAbierto(true)
  }

  const handleEditar = (u: Usuario) => {
    setUsuarioEditando(u)
    setModalAbierto(true)
    setUsuarioDetalle(null)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setUsuarioEditando(null)
  }

  const filtrosActuales = () => ({
    estado: filtroEstado !== 'todos' ? filtroEstado : undefined,
    rol:    filtroRol    !== 'todos' ? filtroRol    : undefined,
  })

  const subtitulo = totalRegistros > 0
    ? `${totalRegistros} usuario${totalRegistros !== 1 ? 's' : ''} · página ${paginaActual} de ${totalPaginas}`
    : 'Sin usuarios registrados'

  return (
    <>
      <TablaPage
        titulo="Usuarios"
        subtitulo={subtitulo}
        labelBoton="Nuevo usuario"
        placeholder="Buscar por nombre, email o teléfono..."
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        filtrosEstado={[
          { valor: 'todos',    label: 'Todos' },
          { valor: 'activo',   label: 'Activo' },
          { valor: 'inactivo', label: 'Inactivo' },
        ]}
        filtroExtra={
          <Select value={filtroRol} onValueChange={setFiltroRol}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin_regional">Admin Regional</SelectItem>
              <SelectItem value="encargado_agencia">Encargado</SelectItem>
              <SelectItem value="conductor">Conductor</SelectItem>
              <SelectItem value="pasajero">Pasajero</SelectItem>
            </SelectContent>
          </Select>
        }
        cargando={cargando}
        error={error}
        onLimpiarError={limpiarError}
        onRefresh={() => cargarUsuarios(filtrosActuales(), paginaActual)}
        onCrear={handleCrear}
        paginacion={
          totalPaginas > 1 ? (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              totalRegistros={totalRegistros}
              porPagina={POR_PAGINA}
              onCambiar={cambiarPagina}
              cargando={cargando}
            />
          ) : undefined
        }
        panelDetalle={usuarioDetalle && (
          <PanelDetalle
            titulo="Detalle usuario"
            nombre={usuarioDetalle.nombre}
            subtitulo={usuarioDetalle.email ?? 'Sin email'}
            badge={
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <RolBadge rol={usuarioDetalle.rol} />
                <EstadoBadge estado={usuarioDetalle.estado} />
              </div>
            }
            icono={<User className="w-7 h-7 text-primary" />}
            stats={[]}
            campos={[
              { label: 'Teléfono',       valor: usuarioDetalle.telefono ?? 'Sin teléfono' },
              { label: 'Rol',            valor: usuarioDetalle.rol.replace('_', ' ') },
              { label: 'Región',         valor: usuarioDetalle.region?.nombre ?? '—' },
              { label: 'Agencia',        valor: usuarioDetalle.agencia?.nombre ?? '—' },
              { label: 'Fecha registro', valor: new Date(usuarioDetalle.fecha_registro).toLocaleString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                }) },
              { label: 'Último acceso',  valor: usuarioDetalle.ultimo_acceso
                  ? new Date(usuarioDetalle.ultimo_acceso).toLocaleString('es-CO', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })
                  : 'Nunca' },
            ]}
            onCerrar={() => setUsuarioDetalle(null)}
            onEditar={() => handleEditar(usuarioDetalle)}
            labelEditar="Editar usuario"
          />
        )}
      >
        {filtrados.length === 0 ? (
          <TablaVacia
            cargando={cargando}
            hayDatos={usuarios.length > 0}
            hayBusqueda={!!busqueda}
            icono={<Users className="w-6 h-6" />}
            labelVacio="Sin usuarios"
            labelCrear="Nuevo usuario"
            onCrear={handleCrear}
          />
        ) : (
          <>
            {/* Móvil — cards */}
            <div className="md:hidden overflow-y-auto max-h-[calc(100dvh-370px)] divide-y divide-border">
              {filtrados.map(u => (
                <UsuarioCard
                  key={u.id}
                  usuario={u}
                  esSeleccionado={usuarioDetalle?.id === u.id}
                  onSeleccionar={() => handleSeleccionar(u)}
                  onToggleEstado={() => handleToggleEstado(u)}
                />
              ))}
            </div>

            {/* Desktop — tabla */}
            <div className="hidden md:block">
              <TablaUsuarios
                usuarios={filtrados}
                usuarioDetalle={usuarioDetalle}
                onSeleccionar={handleSeleccionar}
                onToggleEstado={handleToggleEstado}
              />
            </div>
          </>
        )}
      </TablaPage>

      {/* Modal crear/editar usuario */}
      {modalAbierto && (
        <ModalUsuario
          usuario={usuarioEditando}
          onGuardar={crearUsuario}
          onActualizar={actualizarUsuario}
          onCerrar={handleCerrarModal}
          cargando={cargando}
        />
      )}
    </>
  )
}
