export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agencias: {
        Row: {
          codigo: string
          creado_por: string | null
          direccion: string | null
          encargado_id: string | null
          estado: Database["public"]["Enums"]["estado_general"]
          fecha_creacion: string
          id: string
          latitud: number | null
          longitud: number | null
          nombre: string
          region_id: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          codigo: string
          creado_por?: string | null
          direccion?: string | null
          encargado_id?: string | null
          estado?: Database["public"]["Enums"]["estado_general"]
          fecha_creacion?: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre: string
          region_id: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          codigo?: string
          creado_por?: string | null
          direccion?: string | null
          encargado_id?: string | null
          estado?: Database["public"]["Enums"]["estado_general"]
          fecha_creacion?: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          region_id?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agencias_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "agencias_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agencias_encargado_id_fkey"
            columns: ["encargado_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "agencias_encargado_id_fkey"
            columns: ["encargado_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agencias_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regiones"
            referencedColumns: ["id"]
          },
        ]
      }
      conductores: {
        Row: {
          agencia_id: string
          categoria_licencia: string
          estado_suscripcion: Database["public"]["Enums"]["estado_suscripcion"]
          fecha_corte: string | null
          fecha_creacion: string
          fecha_vencimiento_licencia: string
          foto_perfil: string | null
          id: string
          numero_licencia: string
          numero_nequi: string | null
          updated_at: string
          usuario_id: string
          vehiculo_id: string | null
        }
        Insert: {
          agencia_id: string
          categoria_licencia?: string
          estado_suscripcion?: Database["public"]["Enums"]["estado_suscripcion"]
          fecha_corte?: string | null
          fecha_creacion?: string
          fecha_vencimiento_licencia: string
          foto_perfil?: string | null
          id?: string
          numero_licencia: string
          numero_nequi?: string | null
          updated_at?: string
          usuario_id: string
          vehiculo_id?: string | null
        }
        Update: {
          agencia_id?: string
          categoria_licencia?: string
          estado_suscripcion?: Database["public"]["Enums"]["estado_suscripcion"]
          fecha_corte?: string | null
          fecha_creacion?: string
          fecha_vencimiento_licencia?: string
          foto_perfil?: string | null
          id?: string
          numero_licencia?: string
          numero_nequi?: string | null
          updated_at?: string
          usuario_id?: string
          vehiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conductores_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conductores_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "conductores_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conductores_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["vehiculo_id"]
          },
          {
            foreignKeyName: "conductores_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracion_comisiones: {
        Row: {
          activo: boolean
          fecha_modificacion: string
          id: string
          modificado_por: string | null
          porcentaje: number
          region_id: string | null
          tipo_servicio: Database["public"]["Enums"]["tipo_servicio_comision"]
          updated_at: string
        }
        Insert: {
          activo?: boolean
          fecha_modificacion?: string
          id?: string
          modificado_por?: string | null
          porcentaje?: number
          region_id?: string | null
          tipo_servicio: Database["public"]["Enums"]["tipo_servicio_comision"]
          updated_at?: string
        }
        Update: {
          activo?: boolean
          fecha_modificacion?: string
          id?: string
          modificado_por?: string | null
          porcentaje?: number
          region_id?: string | null
          tipo_servicio?: Database["public"]["Enums"]["tipo_servicio_comision"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configuracion_comisiones_modificado_por_fkey"
            columns: ["modificado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "configuracion_comisiones_modificado_por_fkey"
            columns: ["modificado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "configuracion_comisiones_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regiones"
            referencedColumns: ["id"]
          },
        ]
      }
      encomiendas: {
        Row: {
          agencia_destino_id: string
          agencia_origen_id: string
          codigo_rastreo: string
          descripcion: string
          destinatario_nombre: string
          destinatario_telefono: string
          estado: Database["public"]["Enums"]["estado_encomienda"]
          fecha_entrega_estimada: string | null
          fecha_entrega_real: string | null
          fecha_registro: string
          firma_entrega: string | null
          id: string
          observaciones: string | null
          peso_kg: number | null
          porcentaje_comision: number
          recibida_por: string | null
          registrado_por: string | null
          remitente_id: string | null
          tipo_cobro: Database["public"]["Enums"]["tipo_cobro_encomienda"]
          updated_at: string
          valor_cobro: number
          valor_comision: number
          valor_declarado: number | null
          viaje_id: string | null
        }
        Insert: {
          agencia_destino_id: string
          agencia_origen_id: string
          codigo_rastreo: string
          descripcion: string
          destinatario_nombre: string
          destinatario_telefono: string
          estado?: Database["public"]["Enums"]["estado_encomienda"]
          fecha_entrega_estimada?: string | null
          fecha_entrega_real?: string | null
          fecha_registro?: string
          firma_entrega?: string | null
          id?: string
          observaciones?: string | null
          peso_kg?: number | null
          porcentaje_comision?: number
          recibida_por?: string | null
          registrado_por?: string | null
          remitente_id?: string | null
          tipo_cobro?: Database["public"]["Enums"]["tipo_cobro_encomienda"]
          updated_at?: string
          valor_cobro?: number
          valor_comision?: number
          valor_declarado?: number | null
          viaje_id?: string | null
        }
        Update: {
          agencia_destino_id?: string
          agencia_origen_id?: string
          codigo_rastreo?: string
          descripcion?: string
          destinatario_nombre?: string
          destinatario_telefono?: string
          estado?: Database["public"]["Enums"]["estado_encomienda"]
          fecha_entrega_estimada?: string | null
          fecha_entrega_real?: string | null
          fecha_registro?: string
          firma_entrega?: string | null
          id?: string
          observaciones?: string | null
          peso_kg?: number | null
          porcentaje_comision?: number
          recibida_por?: string | null
          registrado_por?: string | null
          remitente_id?: string | null
          tipo_cobro?: Database["public"]["Enums"]["tipo_cobro_encomienda"]
          updated_at?: string
          valor_cobro?: number
          valor_comision?: number
          valor_declarado?: number | null
          viaje_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "encomiendas_agencia_destino_id_fkey"
            columns: ["agencia_destino_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encomiendas_agencia_origen_id_fkey"
            columns: ["agencia_origen_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encomiendas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "encomiendas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encomiendas_remitente_id_fkey"
            columns: ["remitente_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "encomiendas_remitente_id_fkey"
            columns: ["remitente_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encomiendas_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: false
            referencedRelation: "detalle_mis_reservas"
            referencedColumns: ["viaje_id"]
          },
          {
            foreignKeyName: "encomiendas_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: false
            referencedRelation: "viajes"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_encomienda: {
        Row: {
          descripcion: string
          encomienda_id: string
          estado_anterior:
            | Database["public"]["Enums"]["estado_encomienda"]
            | null
          estado_nuevo: Database["public"]["Enums"]["estado_encomienda"]
          fecha: string
          id: string
          latitud: number | null
          longitud: number | null
          registrado_por: string | null
        }
        Insert: {
          descripcion: string
          encomienda_id: string
          estado_anterior?:
            | Database["public"]["Enums"]["estado_encomienda"]
            | null
          estado_nuevo: Database["public"]["Enums"]["estado_encomienda"]
          fecha?: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          registrado_por?: string | null
        }
        Update: {
          descripcion?: string
          encomienda_id?: string
          estado_anterior?:
            | Database["public"]["Enums"]["estado_encomienda"]
            | null
          estado_nuevo?: Database["public"]["Enums"]["estado_encomienda"]
          fecha?: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          registrado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_encomienda_encomienda_id_fkey"
            columns: ["encomienda_id"]
            isOneToOne: false
            referencedRelation: "encomiendas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_encomienda_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "eventos_encomienda_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      liquidaciones: {
        Row: {
          agencia_id: string
          estado: Database["public"]["Enums"]["estado_liquidacion"]
          fecha_creacion: string
          fecha_pago: string | null
          id: string
          observaciones: string | null
          periodo_fin: string
          periodo_inicio: string
          referencia_nequi: string | null
          registrado_por: string | null
          total_comisiones: number
          total_encomiendas: number
          total_pasajeros: number
          total_recaudado: number
          total_viajes: number
          updated_at: string
        }
        Insert: {
          agencia_id: string
          estado?: Database["public"]["Enums"]["estado_liquidacion"]
          fecha_creacion?: string
          fecha_pago?: string | null
          id?: string
          observaciones?: string | null
          periodo_fin: string
          periodo_inicio: string
          referencia_nequi?: string | null
          registrado_por?: string | null
          total_comisiones?: number
          total_encomiendas?: number
          total_pasajeros?: number
          total_recaudado?: number
          total_viajes?: number
          updated_at?: string
        }
        Update: {
          agencia_id?: string
          estado?: Database["public"]["Enums"]["estado_liquidacion"]
          fecha_creacion?: string
          fecha_pago?: string | null
          id?: string
          observaciones?: string | null
          periodo_fin?: string
          periodo_inicio?: string
          referencia_nequi?: string | null
          registrado_por?: string | null
          total_comisiones?: number
          total_encomiendas?: number
          total_pasajeros?: number
          total_recaudado?: number
          total_viajes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "liquidaciones_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liquidaciones_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "liquidaciones_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones: {
        Row: {
          canal: Database["public"]["Enums"]["canal_notificacion"]
          enviada_push: boolean
          fecha_envio: string
          fecha_lectura: string | null
          id: string
          leida: boolean
          mensaje: string
          referencia_id: string | null
          referencia_tipo: string | null
          tipo: Database["public"]["Enums"]["tipo_notificacion"]
          titulo: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          canal?: Database["public"]["Enums"]["canal_notificacion"]
          enviada_push?: boolean
          fecha_envio?: string
          fecha_lectura?: string | null
          id?: string
          leida?: boolean
          mensaje: string
          referencia_id?: string | null
          referencia_tipo?: string | null
          tipo: Database["public"]["Enums"]["tipo_notificacion"]
          titulo: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          canal?: Database["public"]["Enums"]["canal_notificacion"]
          enviada_push?: boolean
          fecha_envio?: string
          fecha_lectura?: string | null
          id?: string
          leida?: boolean
          mensaje?: string
          referencia_id?: string | null
          referencia_tipo?: string | null
          tipo?: Database["public"]["Enums"]["tipo_notificacion"]
          titulo?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "notificaciones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      planes_suscripcion: {
        Row: {
          activo: boolean
          creado_por: string | null
          descripcion: string | null
          duracion_dias: number
          fecha_creacion: string
          id: string
          incluye_planilla: boolean
          moneda: string
          nombre: string
          precio: number
          updated_at: string
        }
        Insert: {
          activo?: boolean
          creado_por?: string | null
          descripcion?: string | null
          duracion_dias?: number
          fecha_creacion?: string
          id?: string
          incluye_planilla?: boolean
          moneda?: string
          nombre: string
          precio: number
          updated_at?: string
        }
        Update: {
          activo?: boolean
          creado_por?: string | null
          descripcion?: string | null
          duracion_dias?: number
          fecha_creacion?: string
          id?: string
          incluye_planilla?: boolean
          moneda?: string
          nombre?: string
          precio?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planes_suscripcion_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "planes_suscripcion_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      planillas: {
        Row: {
          agencia_destino: string
          agencia_origen: string
          conductor_categoria_licencia: string
          conductor_id: string
          conductor_licencia: string
          conductor_nombre: string
          encomiendas_json: Json | null
          estado: Database["public"]["Enums"]["estado_planilla"]
          fecha_completada: string | null
          fecha_generacion: string
          generada_por: string | null
          hora_llegada: string | null
          hora_salida: string
          id: string
          novedad: string | null
          pasajeros_json: Json | null
          ruta_id: string
          ruta_nombre: string
          total_encomiendas: number
          total_no_show: number
          total_pasajeros: number
          updated_at: string
          url_pdf: string | null
          vehiculo_id: string
          vehiculo_placa: string
          vehiculo_tipo: string
          viaje_id: string
        }
        Insert: {
          agencia_destino: string
          agencia_origen: string
          conductor_categoria_licencia: string
          conductor_id: string
          conductor_licencia: string
          conductor_nombre: string
          encomiendas_json?: Json | null
          estado?: Database["public"]["Enums"]["estado_planilla"]
          fecha_completada?: string | null
          fecha_generacion?: string
          generada_por?: string | null
          hora_llegada?: string | null
          hora_salida: string
          id?: string
          novedad?: string | null
          pasajeros_json?: Json | null
          ruta_id: string
          ruta_nombre: string
          total_encomiendas?: number
          total_no_show?: number
          total_pasajeros?: number
          updated_at?: string
          url_pdf?: string | null
          vehiculo_id: string
          vehiculo_placa: string
          vehiculo_tipo: string
          viaje_id: string
        }
        Update: {
          agencia_destino?: string
          agencia_origen?: string
          conductor_categoria_licencia?: string
          conductor_id?: string
          conductor_licencia?: string
          conductor_nombre?: string
          encomiendas_json?: Json | null
          estado?: Database["public"]["Enums"]["estado_planilla"]
          fecha_completada?: string | null
          fecha_generacion?: string
          generada_por?: string | null
          hora_llegada?: string | null
          hora_salida?: string
          id?: string
          novedad?: string | null
          pasajeros_json?: Json | null
          ruta_id?: string
          ruta_nombre?: string
          total_encomiendas?: number
          total_no_show?: number
          total_pasajeros?: number
          updated_at?: string
          url_pdf?: string | null
          vehiculo_id?: string
          vehiculo_placa?: string
          vehiculo_tipo?: string
          viaje_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planillas_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "conductores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planillas_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["conductor_id"]
          },
          {
            foreignKeyName: "planillas_generada_por_fkey"
            columns: ["generada_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "planillas_generada_por_fkey"
            columns: ["generada_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planillas_ruta_id_fkey"
            columns: ["ruta_id"]
            isOneToOne: false
            referencedRelation: "rutas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planillas_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["vehiculo_id"]
          },
          {
            foreignKeyName: "planillas_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planillas_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: true
            referencedRelation: "detalle_mis_reservas"
            referencedColumns: ["viaje_id"]
          },
          {
            foreignKeyName: "planillas_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: true
            referencedRelation: "viajes"
            referencedColumns: ["id"]
          },
        ]
      }
      puntos_abordaje: {
        Row: {
          activo: boolean
          agencia_id: string
          descripcion: string | null
          fecha_creacion: string
          id: string
          latitud: number | null
          longitud: number | null
          nombre: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          agencia_id: string
          descripcion?: string | null
          fecha_creacion?: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          agencia_id?: string
          descripcion?: string | null
          fecha_creacion?: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "puntos_abordaje_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
        ]
      }
      regiones: {
        Row: {
          admin_id: string | null
          codigo: string
          creado_por: string | null
          estado: Database["public"]["Enums"]["estado_general"]
          fecha_creacion: string
          id: string
          nombre: string
          pais: string
          updated_at: string
        }
        Insert: {
          admin_id?: string | null
          codigo: string
          creado_por?: string | null
          estado?: Database["public"]["Enums"]["estado_general"]
          fecha_creacion?: string
          id?: string
          nombre: string
          pais?: string
          updated_at?: string
        }
        Update: {
          admin_id?: string | null
          codigo?: string
          creado_por?: string | null
          estado?: Database["public"]["Enums"]["estado_general"]
          fecha_creacion?: string
          id?: string
          nombre?: string
          pais?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "regiones_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "regiones_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regiones_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "regiones_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      reserva_pasajeros: {
        Row: {
          created_at: string
          estado: string
          id: string
          nombres: string
          orden: number
          reserva_id: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado?: string
          id?: string
          nombres: string
          orden?: number
          reserva_id: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado?: string
          id?: string
          nombres?: string
          orden?: number
          reserva_id?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reserva_pasajeros_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "detalle_mis_reservas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reserva_pasajeros_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          cancelada_por: string | null
          confirmado_por: string | null
          cupos_solicitados: number
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha_abordaje: string | null
          fecha_cancelacion: string | null
          fecha_reserva: string
          id: string
          motivo_cancelacion: string | null
          notas: string | null
          pagado_en_agencia: boolean
          pasajero_id: string
          porcentaje_comision: number
          precio_pasaje: number
          punto_abordaje_id: string | null
          updated_at: string
          valor_comision: number
          viaje_id: string
        }
        Insert: {
          cancelada_por?: string | null
          confirmado_por?: string | null
          cupos_solicitados?: number
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha_abordaje?: string | null
          fecha_cancelacion?: string | null
          fecha_reserva?: string
          id?: string
          motivo_cancelacion?: string | null
          notas?: string | null
          pagado_en_agencia?: boolean
          pasajero_id: string
          porcentaje_comision: number
          precio_pasaje: number
          punto_abordaje_id?: string | null
          updated_at?: string
          valor_comision: number
          viaje_id: string
        }
        Update: {
          cancelada_por?: string | null
          confirmado_por?: string | null
          cupos_solicitados?: number
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha_abordaje?: string | null
          fecha_cancelacion?: string | null
          fecha_reserva?: string
          id?: string
          motivo_cancelacion?: string | null
          notas?: string | null
          pagado_en_agencia?: boolean
          pasajero_id?: string
          porcentaje_comision?: number
          precio_pasaje?: number
          punto_abordaje_id?: string | null
          updated_at?: string
          valor_comision?: number
          viaje_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_cancelada_por_fkey"
            columns: ["cancelada_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "reservas_cancelada_por_fkey"
            columns: ["cancelada_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_confirmado_por_fkey"
            columns: ["confirmado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "reservas_confirmado_por_fkey"
            columns: ["confirmado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_pasajero_id_fkey"
            columns: ["pasajero_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "reservas_pasajero_id_fkey"
            columns: ["pasajero_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_punto_abordaje_id_fkey"
            columns: ["punto_abordaje_id"]
            isOneToOne: false
            referencedRelation: "puntos_abordaje"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: false
            referencedRelation: "detalle_mis_reservas"
            referencedColumns: ["viaje_id"]
          },
          {
            foreignKeyName: "reservas_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: false
            referencedRelation: "viajes"
            referencedColumns: ["id"]
          },
        ]
      }
      rutas: {
        Row: {
          activa: boolean
          agencia_destino_id: string
          agencia_origen_id: string
          distancia_km: number | null
          duracion_estimada_min: number | null
          fecha_creacion: string
          id: string
          nombre: string
          precio_pasaje: number
          region_id: string
          updated_at: string
        }
        Insert: {
          activa?: boolean
          agencia_destino_id: string
          agencia_origen_id: string
          distancia_km?: number | null
          duracion_estimada_min?: number | null
          fecha_creacion?: string
          id?: string
          nombre: string
          precio_pasaje: number
          region_id: string
          updated_at?: string
        }
        Update: {
          activa?: boolean
          agencia_destino_id?: string
          agencia_origen_id?: string
          distancia_km?: number | null
          duracion_estimada_min?: number | null
          fecha_creacion?: string
          id?: string
          nombre?: string
          precio_pasaje?: number
          region_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rutas_agencia_destino_id_fkey"
            columns: ["agencia_destino_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rutas_agencia_origen_id_fkey"
            columns: ["agencia_origen_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rutas_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regiones"
            referencedColumns: ["id"]
          },
        ]
      }
      suscripciones_conductor: {
        Row: {
          conductor_id: string
          estado: Database["public"]["Enums"]["estado_suscripcion_historica"]
          fecha_corte: string
          fecha_creacion: string
          fecha_inicio: string
          fecha_pago: string
          id: string
          observaciones: string | null
          plan_id: string
          referencia_nequi: string | null
          registrado_por: string | null
          updated_at: string
          valor_pagado: number
        }
        Insert: {
          conductor_id: string
          estado?: Database["public"]["Enums"]["estado_suscripcion_historica"]
          fecha_corte: string
          fecha_creacion?: string
          fecha_inicio: string
          fecha_pago: string
          id?: string
          observaciones?: string | null
          plan_id: string
          referencia_nequi?: string | null
          registrado_por?: string | null
          updated_at?: string
          valor_pagado: number
        }
        Update: {
          conductor_id?: string
          estado?: Database["public"]["Enums"]["estado_suscripcion_historica"]
          fecha_corte?: string
          fecha_creacion?: string
          fecha_inicio?: string
          fecha_pago?: string
          id?: string
          observaciones?: string | null
          plan_id?: string
          referencia_nequi?: string | null
          registrado_por?: string | null
          updated_at?: string
          valor_pagado?: number
        }
        Relationships: [
          {
            foreignKeyName: "suscripciones_conductor_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "conductores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_conductor_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["conductor_id"]
          },
          {
            foreignKeyName: "suscripciones_conductor_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planes_suscripcion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_conductor_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "suscripciones_conductor_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          agencia_id: string | null
          email: string | null
          estado: Database["public"]["Enums"]["estado_general"]
          fecha_registro: string
          id: string
          nombre: string
          region_id: string | null
          rol: Database["public"]["Enums"]["rol_usuario"]
          telefono: string | null
          token_push: string | null
          ultimo_acceso: string | null
          updated_at: string
        }
        Insert: {
          agencia_id?: string | null
          email?: string | null
          estado?: Database["public"]["Enums"]["estado_general"]
          fecha_registro?: string
          id: string
          nombre: string
          region_id?: string | null
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: string | null
          token_push?: string | null
          ultimo_acceso?: string | null
          updated_at?: string
        }
        Update: {
          agencia_id?: string | null
          email?: string | null
          estado?: Database["public"]["Enums"]["estado_general"]
          fecha_registro?: string
          id?: string
          nombre?: string
          region_id?: string | null
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: string | null
          token_push?: string | null
          ultimo_acceso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regiones"
            referencedColumns: ["id"]
          },
        ]
      }
      vehiculos: {
        Row: {
          agencia_id: string
          anio: number | null
          capacidad_carga_kg: number | null
          capacidad_pasajeros: number
          conductor_id: string | null
          estado: Database["public"]["Enums"]["estado_vehiculo"]
          fecha_registro: string
          foto: string | null
          id: string
          marca: string | null
          modelo: string | null
          placa: string
          tipo: Database["public"]["Enums"]["tipo_vehiculo"]
          updated_at: string
        }
        Insert: {
          agencia_id: string
          anio?: number | null
          capacidad_carga_kg?: number | null
          capacidad_pasajeros?: number
          conductor_id?: string | null
          estado?: Database["public"]["Enums"]["estado_vehiculo"]
          fecha_registro?: string
          foto?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          placa: string
          tipo?: Database["public"]["Enums"]["tipo_vehiculo"]
          updated_at?: string
        }
        Update: {
          agencia_id?: string
          anio?: number | null
          capacidad_carga_kg?: number | null
          capacidad_pasajeros?: number
          conductor_id?: string | null
          estado?: Database["public"]["Enums"]["estado_vehiculo"]
          fecha_registro?: string
          foto?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          placa?: string
          tipo?: Database["public"]["Enums"]["tipo_vehiculo"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehiculos_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehiculos_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "conductores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehiculos_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["conductor_id"]
          },
        ]
      }
      viajes: {
        Row: {
          acepta_encomiendas: boolean
          cancelado_por: string | null
          carga_disponible_kg: number | null
          conductor_id: string
          cupos_confirmados: number
          cupos_reservados: number
          cupos_totales: number
          estado: Database["public"]["Enums"]["estado_viaje"]
          fecha_creacion: string
          hora_llegada_estimada: string | null
          hora_llegada_real: string | null
          hora_salida_programada: string
          hora_salida_real: string | null
          id: string
          motivo_cancelacion: string | null
          observaciones: string | null
          planilla_generada: boolean
          precio_pasaje: number
          punto_abordaje_id: string | null
          ruta_id: string
          updated_at: string
          url_planilla: string | null
          vehiculo_id: string
        }
        Insert: {
          acepta_encomiendas?: boolean
          cancelado_por?: string | null
          carga_disponible_kg?: number | null
          conductor_id: string
          cupos_confirmados?: number
          cupos_reservados?: number
          cupos_totales: number
          estado?: Database["public"]["Enums"]["estado_viaje"]
          fecha_creacion?: string
          hora_llegada_estimada?: string | null
          hora_llegada_real?: string | null
          hora_salida_programada: string
          hora_salida_real?: string | null
          id?: string
          motivo_cancelacion?: string | null
          observaciones?: string | null
          planilla_generada?: boolean
          precio_pasaje: number
          punto_abordaje_id?: string | null
          ruta_id: string
          updated_at?: string
          url_planilla?: string | null
          vehiculo_id: string
        }
        Update: {
          acepta_encomiendas?: boolean
          cancelado_por?: string | null
          carga_disponible_kg?: number | null
          conductor_id?: string
          cupos_confirmados?: number
          cupos_reservados?: number
          cupos_totales?: number
          estado?: Database["public"]["Enums"]["estado_viaje"]
          fecha_creacion?: string
          hora_llegada_estimada?: string | null
          hora_llegada_real?: string | null
          hora_salida_programada?: string
          hora_salida_real?: string | null
          id?: string
          motivo_cancelacion?: string | null
          observaciones?: string | null
          planilla_generada?: boolean
          precio_pasaje?: number
          punto_abordaje_id?: string | null
          ruta_id?: string
          updated_at?: string
          url_planilla?: string | null
          vehiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "viajes_cancelado_por_fkey"
            columns: ["cancelado_por"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "viajes_cancelado_por_fkey"
            columns: ["cancelado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "conductores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["conductor_id"]
          },
          {
            foreignKeyName: "viajes_punto_abordaje_id_fkey"
            columns: ["punto_abordaje_id"]
            isOneToOne: false
            referencedRelation: "puntos_abordaje"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_ruta_id_fkey"
            columns: ["ruta_id"]
            isOneToOne: false
            referencedRelation: "rutas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["vehiculo_id"]
          },
          {
            foreignKeyName: "viajes_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      detalle_mis_reservas: {
        Row: {
          conductor_nombre: string | null
          conductor_telefono: string | null
          cupos_solicitados: number | null
          estado_reserva: Database["public"]["Enums"]["estado_reserva"] | null
          estado_viaje: Database["public"]["Enums"]["estado_viaje"] | null
          fecha_reserva: string | null
          hora_llegada_estimada: string | null
          hora_salida_programada: string | null
          id: string | null
          pasajero_id: string | null
          pasajeros: Json | null
          placa: string | null
          precio_pasaje: number | null
          punto_abordaje_id: string | null
          punto_abordaje_nombre: string | null
          ruta_nombre: string | null
          valor_comision: number | null
          vehiculo_tipo: Database["public"]["Enums"]["tipo_vehiculo"] | null
          viaje_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservas_pasajero_id_fkey"
            columns: ["pasajero_id"]
            isOneToOne: false
            referencedRelation: "perfil_conductor"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "reservas_pasajero_id_fkey"
            columns: ["pasajero_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_punto_abordaje_id_fkey"
            columns: ["punto_abordaje_id"]
            isOneToOne: false
            referencedRelation: "puntos_abordaje"
            referencedColumns: ["id"]
          },
        ]
      }
      perfil_conductor: {
        Row: {
          agencia_codigo: string | null
          agencia_id: string | null
          agencia_nombre: string | null
          agencia_telefono: string | null
          anio: number | null
          capacidad_carga_kg: number | null
          capacidad_pasajeros: number | null
          categoria_licencia: string | null
          conductor_id: string | null
          email: string | null
          estado: Database["public"]["Enums"]["estado_general"] | null
          estado_suscripcion:
            | Database["public"]["Enums"]["estado_suscripcion"]
            | null
          fecha_corte: string | null
          fecha_vencimiento_licencia: string | null
          foto_perfil: string | null
          marca: string | null
          modelo: string | null
          nombre: string | null
          numero_licencia: string | null
          numero_nequi: string | null
          placa: string | null
          region_nombre: string | null
          rol: Database["public"]["Enums"]["rol_usuario"] | null
          telefono: string | null
          token_push: string | null
          ultimo_acceso: string | null
          usuario_id: string | null
          vehiculo_estado: Database["public"]["Enums"]["estado_vehiculo"] | null
          vehiculo_id: string | null
          vehiculo_tipo: Database["public"]["Enums"]["tipo_vehiculo"] | null
        }
        Relationships: [
          {
            foreignKeyName: "conductores_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      abordar_pasajero: {
        Args: { p_conductor_usuario_id: string; p_reserva_id: string }
        Returns: {
          cancelada_por: string | null
          confirmado_por: string | null
          cupos_solicitados: number
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha_abordaje: string | null
          fecha_cancelacion: string | null
          fecha_reserva: string
          id: string
          motivo_cancelacion: string | null
          notas: string | null
          pagado_en_agencia: boolean
          pasajero_id: string
          porcentaje_comision: number
          precio_pasaje: number
          punto_abordaje_id: string | null
          updated_at: string
          valor_comision: number
          viaje_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reservas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      actualizar_comision: {
        Args: {
          p_modificado_por: string
          p_porcentaje: number
          p_region_id: string
          p_tipo_servicio: Database["public"]["Enums"]["tipo_servicio_comision"]
        }
        Returns: {
          activo: boolean
          fecha_modificacion: string
          id: string
          modificado_por: string | null
          porcentaje: number
          region_id: string | null
          tipo_servicio: Database["public"]["Enums"]["tipo_servicio_comision"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "configuracion_comisiones"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      actualizar_estado_encomienda: {
        Args: {
          p_descripcion: string
          p_encomienda_id: string
          p_estado_nuevo: Database["public"]["Enums"]["estado_encomienda"]
          p_firma_entrega?: string
          p_latitud?: number
          p_longitud?: number
          p_recibida_por?: string
          p_registrado_por: string
        }
        Returns: {
          agencia_destino_id: string
          agencia_origen_id: string
          codigo_rastreo: string
          descripcion: string
          destinatario_nombre: string
          destinatario_telefono: string
          estado: Database["public"]["Enums"]["estado_encomienda"]
          fecha_entrega_estimada: string | null
          fecha_entrega_real: string | null
          fecha_registro: string
          firma_entrega: string | null
          id: string
          observaciones: string | null
          peso_kg: number | null
          porcentaje_comision: number
          recibida_por: string | null
          registrado_por: string | null
          remitente_id: string | null
          tipo_cobro: Database["public"]["Enums"]["tipo_cobro_encomienda"]
          updated_at: string
          valor_cobro: number
          valor_comision: number
          valor_declarado: number | null
          viaje_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "encomiendas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      agregar_pasajero_directo: {
        Args: {
          p_conductor_usuario_id: string
          p_nombre: string
          p_telefono?: string
          p_viaje_id: string
        }
        Returns: {
          cancelada_por: string | null
          confirmado_por: string | null
          cupos_solicitados: number
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha_abordaje: string | null
          fecha_cancelacion: string | null
          fecha_reserva: string
          id: string
          motivo_cancelacion: string | null
          notas: string | null
          pagado_en_agencia: boolean
          pasajero_id: string
          porcentaje_comision: number
          precio_pasaje: number
          punto_abordaje_id: string | null
          updated_at: string
          valor_comision: number
          viaje_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reservas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      cancelar_reserva: {
        Args: {
          p_cancelado_por: string
          p_motivo?: string
          p_reserva_id: string
        }
        Returns: {
          cancelada_por: string | null
          confirmado_por: string | null
          cupos_solicitados: number
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha_abordaje: string | null
          fecha_cancelacion: string | null
          fecha_reserva: string
          id: string
          motivo_cancelacion: string | null
          notas: string | null
          pagado_en_agencia: boolean
          pasajero_id: string
          porcentaje_comision: number
          precio_pasaje: number
          punto_abordaje_id: string | null
          updated_at: string
          valor_comision: number
          viaje_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reservas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      completar_planilla: {
        Args: { p_hora_llegada: string; p_novedad?: string; p_viaje_id: string }
        Returns: {
          agencia_destino: string
          agencia_origen: string
          conductor_categoria_licencia: string
          conductor_id: string
          conductor_licencia: string
          conductor_nombre: string
          encomiendas_json: Json | null
          estado: Database["public"]["Enums"]["estado_planilla"]
          fecha_completada: string | null
          fecha_generacion: string
          generada_por: string | null
          hora_llegada: string | null
          hora_salida: string
          id: string
          novedad: string | null
          pasajeros_json: Json | null
          ruta_id: string
          ruta_nombre: string
          total_encomiendas: number
          total_no_show: number
          total_pasajeros: number
          updated_at: string
          url_pdf: string | null
          vehiculo_id: string
          vehiculo_placa: string
          vehiculo_tipo: string
          viaje_id: string
        }
        SetofOptions: {
          from: "*"
          to: "planillas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      confirmar_abordaje: {
        Args: { p_conductor_usuario_id: string; p_reserva_id: string }
        Returns: {
          cancelada_por: string | null
          confirmado_por: string | null
          cupos_solicitados: number
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha_abordaje: string | null
          fecha_cancelacion: string | null
          fecha_reserva: string
          id: string
          motivo_cancelacion: string | null
          notas: string | null
          pagado_en_agencia: boolean
          pasajero_id: string
          porcentaje_comision: number
          precio_pasaje: number
          punto_abordaje_id: string | null
          updated_at: string
          valor_comision: number
          viaje_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reservas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      crear_notificacion: {
        Args: {
          p_canal?: Database["public"]["Enums"]["canal_notificacion"]
          p_mensaje: string
          p_referencia_id?: string
          p_referencia_tipo?: string
          p_tipo: Database["public"]["Enums"]["tipo_notificacion"]
          p_titulo: string
          p_usuario_id: string
        }
        Returns: {
          canal: Database["public"]["Enums"]["canal_notificacion"]
          enviada_push: boolean
          fecha_envio: string
          fecha_lectura: string | null
          id: string
          leida: boolean
          mensaje: string
          referencia_id: string | null
          referencia_tipo: string | null
          tipo: Database["public"]["Enums"]["tipo_notificacion"]
          titulo: string
          updated_at: string
          usuario_id: string
        }
        SetofOptions: {
          from: "*"
          to: "notificaciones"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      crear_reserva: {
        Args: {
          p_cupos: number
          p_pasajero_id: string
          p_pasajeros: Json
          p_punto_abordaje_id?: string
          p_viaje_id: string
        }
        Returns: {
          cancelada_por: string | null
          confirmado_por: string | null
          cupos_solicitados: number
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha_abordaje: string | null
          fecha_cancelacion: string | null
          fecha_reserva: string
          id: string
          motivo_cancelacion: string | null
          notas: string | null
          pagado_en_agencia: boolean
          pasajero_id: string
          porcentaje_comision: number
          precio_pasaje: number
          punto_abordaje_id: string | null
          updated_at: string
          valor_comision: number
          viaje_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reservas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      crear_viaje: {
        Args: {
          p_acepta_encomiendas?: boolean
          p_carga_disponible_kg?: number
          p_conductor_id: string
          p_hora_salida: string
          p_observaciones?: string
          p_punto_abordaje_id: string
          p_ruta_id: string
          p_vehiculo_id: string
        }
        Returns: {
          acepta_encomiendas: boolean
          cancelado_por: string | null
          carga_disponible_kg: number | null
          conductor_id: string
          cupos_confirmados: number
          cupos_reservados: number
          cupos_totales: number
          estado: Database["public"]["Enums"]["estado_viaje"]
          fecha_creacion: string
          hora_llegada_estimada: string | null
          hora_llegada_real: string | null
          hora_salida_programada: string
          hora_salida_real: string | null
          id: string
          motivo_cancelacion: string | null
          observaciones: string | null
          planilla_generada: boolean
          precio_pasaje: number
          punto_abordaje_id: string | null
          ruta_id: string
          updated_at: string
          url_planilla: string | null
          vehiculo_id: string
        }
        SetofOptions: {
          from: "*"
          to: "viajes"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      ensure_usuario_profile: { Args: never; Returns: undefined }
      generar_codigo_rastreo: {
        Args: { p_agencia_destino_id: string; p_agencia_origen_id: string }
        Returns: string
      }
      generar_liquidacion: {
        Args: {
          p_agencia_id: string
          p_generado_por: string
          p_periodo_fin: string
          p_periodo_inicio: string
        }
        Returns: {
          agencia_id: string
          estado: Database["public"]["Enums"]["estado_liquidacion"]
          fecha_creacion: string
          fecha_pago: string | null
          id: string
          observaciones: string | null
          periodo_fin: string
          periodo_inicio: string
          referencia_nequi: string | null
          registrado_por: string | null
          total_comisiones: number
          total_encomiendas: number
          total_pasajeros: number
          total_recaudado: number
          total_viajes: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "liquidaciones"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      generar_planilla: {
        Args: { p_generada_por: string; p_viaje_id: string }
        Returns: {
          agencia_destino: string
          agencia_origen: string
          conductor_categoria_licencia: string
          conductor_id: string
          conductor_licencia: string
          conductor_nombre: string
          encomiendas_json: Json | null
          estado: Database["public"]["Enums"]["estado_planilla"]
          fecha_completada: string | null
          fecha_generacion: string
          generada_por: string | null
          hora_llegada: string | null
          hora_salida: string
          id: string
          novedad: string | null
          pasajeros_json: Json | null
          ruta_id: string
          ruta_nombre: string
          total_encomiendas: number
          total_no_show: number
          total_pasajeros: number
          updated_at: string
          url_pdf: string | null
          vehiculo_id: string
          vehiculo_placa: string
          vehiculo_tipo: string
          viaje_id: string
        }
        SetofOptions: {
          from: "*"
          to: "planillas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      iniciar_viaje: {
        Args: { p_conductor_id: string; p_viaje_id: string }
        Returns: {
          acepta_encomiendas: boolean
          cancelado_por: string | null
          carga_disponible_kg: number | null
          conductor_id: string
          cupos_confirmados: number
          cupos_reservados: number
          cupos_totales: number
          estado: Database["public"]["Enums"]["estado_viaje"]
          fecha_creacion: string
          hora_llegada_estimada: string | null
          hora_llegada_real: string | null
          hora_salida_programada: string
          hora_salida_real: string | null
          id: string
          motivo_cancelacion: string | null
          observaciones: string | null
          planilla_generada: boolean
          precio_pasaje: number
          punto_abordaje_id: string | null
          ruta_id: string
          updated_at: string
          url_planilla: string | null
          vehiculo_id: string
        }
        SetofOptions: {
          from: "*"
          to: "viajes"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      marcar_no_show: {
        Args: { p_conductor_usuario_id: string; p_reserva_id: string }
        Returns: {
          cancelada_por: string | null
          confirmado_por: string | null
          cupos_solicitados: number
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha_abordaje: string | null
          fecha_cancelacion: string | null
          fecha_reserva: string
          id: string
          motivo_cancelacion: string | null
          notas: string | null
          pagado_en_agencia: boolean
          pasajero_id: string
          porcentaje_comision: number
          precio_pasaje: number
          punto_abordaje_id: string | null
          updated_at: string
          valor_comision: number
          viaje_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reservas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      marcar_no_show_pasajero: {
        Args: { p_conductor_usuario_id: string; p_reserva_pasajero_id: string }
        Returns: {
          created_at: string
          estado: string
          id: string
          nombres: string
          orden: number
          reserva_id: string
          telefono: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "reserva_pasajeros"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      marcar_notificacion_leida: {
        Args: { p_notificacion_id: string; p_usuario_id: string }
        Returns: {
          canal: Database["public"]["Enums"]["canal_notificacion"]
          enviada_push: boolean
          fecha_envio: string
          fecha_lectura: string | null
          id: string
          leida: boolean
          mensaje: string
          referencia_id: string | null
          referencia_tipo: string | null
          tipo: Database["public"]["Enums"]["tipo_notificacion"]
          titulo: string
          updated_at: string
          usuario_id: string
        }
        SetofOptions: {
          from: "*"
          to: "notificaciones"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      marcar_todas_leidas: { Args: { p_usuario_id: string }; Returns: number }
      pagar_liquidacion: {
        Args: {
          p_liquidacion_id: string
          p_observaciones?: string
          p_referencia_nequi: string
          p_registrado_por: string
        }
        Returns: {
          agencia_id: string
          estado: Database["public"]["Enums"]["estado_liquidacion"]
          fecha_creacion: string
          fecha_pago: string | null
          id: string
          observaciones: string | null
          periodo_fin: string
          periodo_inicio: string
          referencia_nequi: string | null
          registrado_por: string | null
          total_comisiones: number
          total_encomiendas: number
          total_pasajeros: number
          total_recaudado: number
          total_viajes: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "liquidaciones"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      registrar_encomienda: {
        Args: {
          p_agencia_destino_id: string
          p_agencia_origen_id: string
          p_descripcion: string
          p_destinatario_nombre: string
          p_destinatario_telefono: string
          p_observaciones?: string
          p_peso_kg: number
          p_registrado_por: string
          p_remitente_id: string
          p_tipo_cobro: Database["public"]["Enums"]["tipo_cobro_encomienda"]
          p_valor_cobro: number
          p_valor_declarado: number
          p_viaje_id: string
        }
        Returns: {
          agencia_destino_id: string
          agencia_origen_id: string
          codigo_rastreo: string
          descripcion: string
          destinatario_nombre: string
          destinatario_telefono: string
          estado: Database["public"]["Enums"]["estado_encomienda"]
          fecha_entrega_estimada: string | null
          fecha_entrega_real: string | null
          fecha_registro: string
          firma_entrega: string | null
          id: string
          observaciones: string | null
          peso_kg: number | null
          porcentaje_comision: number
          recibida_por: string | null
          registrado_por: string | null
          remitente_id: string | null
          tipo_cobro: Database["public"]["Enums"]["tipo_cobro_encomienda"]
          updated_at: string
          valor_cobro: number
          valor_comision: number
          valor_declarado: number | null
          viaje_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "encomiendas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      registrar_pago_suscripcion: {
        Args: {
          p_conductor_id: string
          p_fecha_pago: string
          p_observaciones?: string
          p_plan_id: string
          p_referencia_nequi: string
          p_registrado_por: string
          p_valor_pagado: number
        }
        Returns: {
          conductor_id: string
          estado: Database["public"]["Enums"]["estado_suscripcion_historica"]
          fecha_corte: string
          fecha_creacion: string
          fecha_inicio: string
          fecha_pago: string
          id: string
          observaciones: string | null
          plan_id: string
          referencia_nequi: string | null
          registrado_por: string | null
          updated_at: string
          valor_pagado: number
        }
        SetofOptions: {
          from: "*"
          to: "suscripciones_conductor"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      verificar_vencimiento_suscripcion: { Args: never; Returns: undefined }
    }
    Enums: {
      canal_notificacion: "push" | "in_app" | "ambos"
      estado_encomienda:
        | "registrada"
        | "en_transito"
        | "entregada"
        | "devuelta"
        | "perdida"
      estado_general: "activo" | "inactivo" | "pendiente"
      estado_liquidacion: "pendiente" | "pagado" | "en_disputa"
      estado_planilla: "generada" | "completada" | "anulada"
      estado_reserva: "reservada" | "abordada" | "no_show" | "cancelada"
      estado_suscripcion:
        | "activo"
        | "por_vencer"
        | "suspendido"
        | "pendiente_activacion"
      estado_suscripcion_historica: "activo" | "vencido"
      estado_vehiculo: "activo" | "mantenimiento" | "inactivo"
      estado_viaje:
        | "programado"
        | "abordando"
        | "en_curso"
        | "completado"
        | "cancelado"
      rol_usuario:
        | "super_admin"
        | "admin_regional"
        | "encargado_agencia"
        | "conductor"
        | "pasajero"
      tipo_cobro_encomienda: "prepago" | "contraentrega"
      tipo_notificacion:
        | "vencimiento_suscripcion"
        | "suscripcion_suspendida"
        | "suscripcion_renovada"
        | "viaje_nuevo"
        | "viaje_cancelado"
        | "viaje_iniciado"
        | "reserva_confirmada"
        | "reserva_cancelada"
        | "pasajero_abordado"
        | "encomienda_registrada"
        | "encomienda_en_transito"
        | "encomienda_entregada"
        | "liquidacion_pendiente"
        | "liquidacion_pagada"
      tipo_servicio_comision: "pasajero" | "encomienda"
      tipo_vehiculo: "duster" | "ford_platon" | "otro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      canal_notificacion: ["push", "in_app", "ambos"],
      estado_encomienda: [
        "registrada",
        "en_transito",
        "entregada",
        "devuelta",
        "perdida",
      ],
      estado_general: ["activo", "inactivo", "pendiente"],
      estado_liquidacion: ["pendiente", "pagado", "en_disputa"],
      estado_planilla: ["generada", "completada", "anulada"],
      estado_reserva: ["reservada", "abordada", "no_show", "cancelada"],
      estado_suscripcion: [
        "activo",
        "por_vencer",
        "suspendido",
        "pendiente_activacion",
      ],
      estado_suscripcion_historica: ["activo", "vencido"],
      estado_vehiculo: ["activo", "mantenimiento", "inactivo"],
      estado_viaje: [
        "programado",
        "abordando",
        "en_curso",
        "completado",
        "cancelado",
      ],
      rol_usuario: [
        "super_admin",
        "admin_regional",
        "encargado_agencia",
        "conductor",
        "pasajero",
      ],
      tipo_cobro_encomienda: ["prepago", "contraentrega"],
      tipo_notificacion: [
        "vencimiento_suscripcion",
        "suscripcion_suspendida",
        "suscripcion_renovada",
        "viaje_nuevo",
        "viaje_cancelado",
        "viaje_iniciado",
        "reserva_confirmada",
        "reserva_cancelada",
        "pasajero_abordado",
        "encomienda_registrada",
        "encomienda_en_transito",
        "encomienda_entregada",
        "liquidacion_pendiente",
        "liquidacion_pagada",
      ],
      tipo_servicio_comision: ["pasajero", "encomienda"],
      tipo_vehiculo: ["duster", "ford_platon", "otro"],
    },
  },
} as const
