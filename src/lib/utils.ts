import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parsea una fecha tipo "2026-04-03" como hora local (no UTC).
 * Evita que se muestre el día anterior en zonas horarias negativas.
 */
export function parsearFechaLocal(fecha: string): Date {
  if (fecha.includes('T')) return new Date(fecha)
  return new Date(fecha + 'T00:00:00')
}
