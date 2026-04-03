export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN_REGIONAL: 'admin_regional',
  ENCARGADO_AGENCIA: 'encargado_agencia',
  CONDUCTOR: 'conductor',
  MOTO_TAXI: 'moto_taxi',
  PASAJERO: 'pasajero',
} as const

export type Rol = typeof ROLES[keyof typeof ROLES]

export const ROLES_DASHBOARD: Rol[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN_REGIONAL,
  ROLES.ENCARGADO_AGENCIA,
]

export const ESTADO_SUSCRIPCION = {
  ACTIVO: 'activo',
  POR_VENCER: 'por_vencer',
  SUSPENDIDO: 'suspendido',
  PENDIENTE: 'pendiente_activacion',
} as const

export const ESTADO_VIAJE = {
  PROGRAMADO: 'programado',
  ABORDANDO: 'abordando',
  EN_CURSO: 'en_curso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
} as const