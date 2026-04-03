
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '../lib/constants'

type Modulo =
  | 'regiones'
  | 'agencias'
  | 'conductores'
  | 'vehiculos'
  | 'rutas'
  | 'viajes'
  | 'reservas'
  | 'liquidaciones'
  | 'carreras'
  | 'encomiendas'
  | 'planillas'
  | 'planes'
  | 'pagos'
  | 'comisiones'
  | 'reportes'
  | 'usuarios'

interface Permisos {
  puedeVer: boolean
  puedeCrear: boolean
  puedeEditar: boolean
  puedeEliminar: boolean
  esGlobal: boolean  // ve todos los datos sin filtro de región/agencia
}

const MATRIZ: Record<string, Record<Modulo, Partial<Permisos>>> = {
  [ROLES.SUPER_ADMIN]: {
    regiones:      { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    agencias:      { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    conductores:   { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    vehiculos:     { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    rutas:         { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    viajes:        { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    reservas:      { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    liquidaciones:  { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    carreras:       { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    encomiendas:    { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    planillas:      { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    planes:         { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    pagos:          { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    comisiones:     { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
    reportes:       { puedeVer: true, esGlobal: true },
    usuarios:       { puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true, esGlobal: true },
  },
  [ROLES.ADMIN_REGIONAL]: {
    regiones:       { puedeVer: true },
    agencias:       { puedeVer: true, puedeCrear: true, puedeEditar: true },
    conductores:    { puedeVer: true, puedeCrear: true, puedeEditar: true },
    vehiculos:      { puedeVer: true, puedeCrear: true, puedeEditar: true },
    rutas:          { puedeVer: true },
    viajes:         { puedeVer: true },
    reservas:       { puedeVer: true },
    liquidaciones:  { puedeVer: true },
    carreras:       { puedeVer: true },
    encomiendas:    { puedeVer: true },
    planillas:      { puedeVer: true },
    planes:         { puedeVer: true },
    pagos:          { puedeVer: true, puedeCrear: true },
    comisiones:     { puedeVer: true },
    reportes:       { puedeVer: true },
    usuarios:       { puedeVer: true },
  },
  [ROLES.ENCARGADO_AGENCIA]: {
    regiones:       {},
    agencias:       { puedeVer: true },
    conductores:    { puedeVer: true, puedeCrear: true, puedeEditar: true },
    vehiculos:      { puedeVer: true, puedeCrear: true, puedeEditar: true },
    rutas:          { puedeVer: true },
    viajes:         { puedeVer: true, puedeCrear: true },
    reservas:       { puedeVer: true, puedeCrear: true, puedeEditar: true },
    liquidaciones:  { puedeVer: true, puedeCrear: true },
    carreras:       { puedeVer: true },
    encomiendas:    { puedeVer: true, puedeCrear: true },
    planillas:      { puedeVer: true },
    planes:         { puedeVer: true },
    pagos:          { puedeVer: true, puedeCrear: true },
    comisiones:     {},
    reportes:       { puedeVer: true },
    usuarios:       { puedeVer: true },
  },
}

export function usePermisos(modulo: Modulo): Permisos {
  const usuario = useAuthStore(s => s.usuario)
  const rol = usuario?.rol ?? ''
  const permisos = MATRIZ[rol]?.[modulo] ?? {}

  return {
    puedeVer:      permisos.puedeVer      ?? false,
    puedeCrear:    permisos.puedeCrear    ?? false,
    puedeEditar:   permisos.puedeEditar   ?? false,
    puedeEliminar: permisos.puedeEliminar ?? false,
    esGlobal:      permisos.esGlobal      ?? false,
  }
}