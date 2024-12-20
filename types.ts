import { FieldValue, Timestamp } from "firebase/firestore";
import {
  AccionHistorial,
  EstadoTraslado,
  METHODOS_DE_PAGO,
  RazonHistorial,
  TipoHistorial,
  Ubicacion,
  UbicacionesKeys,
} from "./utils/constants";

export enum EstadoRepuesto {
  nuevo = "nuevo",
  usado = "usado",
}
export interface Repuesto {
  id: string;
  codigo: string;
  compatibilidadFinal: number;
  compatibilidadInicial: number;
  modelo: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioDescuento?: number;
  lado?: Array<string>;
  fechaDeModificacion?: FieldValue;
  estado?: EstadoRepuesto | "" | undefined;
  unidadesLimite?: number;
  categoria: string;
  estacion: string;
  existencias: number;
  unidadesEnReserva?: number;
  linea: string;
  marca: string;
  ubicacion?: Ubicacion;
  [UbicacionesKeys.ventas]: number;
  [UbicacionesKeys.bodega]: number;
  [UbicacionesKeys.caja]: number;
  [UbicacionesKeys.despacho]: number;
  unidadesEnTraslado?: number;
  keyWords?: Array<string>;
  // este es el unico valor apuntando a Ids de momento
  proveedor?: string;
}

export interface RepuestoCart extends Repuesto {
  cantidad: number;
  costo: number;
  total?: number;
}

export interface Cliente {
  id: string;
  apellido?: string;
  direccion?: string;
  nit: string;
  nombre: string;
  telefono?: string;
  correo?: string;
  notas?: string;
}

export type New<T> = Omit<T, "id">;

export interface Pass {
  id: string;
  pass: string;
}

export interface ItemVenta {
  item: string;
  unidades: number;
  nombre: string;
  marca: string;
  linea: string;
  modelo: number;
  precio: number;
  categoria: number;
  codigo: string;
}

export enum VentaEstados {
  "pendiente" = "pendiente",
  "cobrado" = "cobrado",
  "despachado" = "despachado",
}

export enum TiposVentaUsuario {
  "vendedor" = "vendedor",
  "despacho" = "despacho",
  "cajero" = "cajero",
}

export const TIPOS_DE_USUARIO_VENTA = Object.values(TiposVentaUsuario).filter(
  (value) => typeof value === "string"
);
export interface Venta {
  id: string;
  cliente: Cliente;
  // TODO: convertir a string vendedor
  [TiposVentaUsuario.vendedor]: Usuario;
  [TiposVentaUsuario.cajero]?: string;
  [TiposVentaUsuario.despacho]?: string;
  items: ItemVenta[];
  total: number;
  fecha: FieldValue | Timestamp;
  fechaDespacho?: FieldValue | Timestamp;
  estado: VentaEstados;
  metodosPago: MethodoDePago;
  contabilizado: boolean;
  aCredito: boolean;
  creditoActivo: boolean;
}

export interface Abono {
  ventaId: string;
  cajero: string;
  valor: number;
}

export interface Usuario {
  id: string;
  superUser: boolean;
  admin: boolean;
  nombre: string;
  telefono: string;
  ubicacion?: Ubicacion;
}

// Metodos de pago
export type MetodoDePagoKey = keyof typeof METHODOS_DE_PAGO;
export type MetodoDePagoValue = (typeof METHODOS_DE_PAGO)[MetodoDePagoKey];
export type MetodosDePagoType = Record<MetodoDePagoKey, MetodoDePagoValue>;
export type MethodoDePago = Record<MetodoDePagoKey, number>;
export interface Estacion {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Marca {
  id: string;
  nombre: string;
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Modelo {
  id: string;
  modelo: number;
}

export interface Linea {
  id: string;
  marca: string;
  nombre: string;
  marcaId?: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  nit?: string;
  telefono?: string;
  empresa?: string;
  email?: string;
}

export interface GenericValue {
  id: string;
  nombre: string;
}

export interface Historial {
  id: string;
  tipo: TipoHistorial;
  accion: AccionHistorial;
  usuario?: string;
  fecha: FieldValue | Timestamp;
  idRepuesto?: string;
  ventaId?: string;
  unidades?: number;
  razon?: RazonHistorial;
  notas?: string;
  changes?: Record<string, any>;
  vendedor?: string;
  cajero?: string;
}

export enum TrasladosType {
  "venta" = "venta",
  "traslado" = "traslado",
}
export interface Traslados {
  id: string;
  ubicacion: Ubicacion;
  destino: Ubicacion;
  usuarioSolicitud: string;
  idRepuesto?: string;
  usuarioEnProgreso?: string;
  estado: EstadoTraslado;
  ventaId?: string;
  // unidades: number;
  fechaInicio: FieldValue | Timestamp;
  fechaEnProgreso?: FieldValue | Timestamp;
  fechaEntregado?: FieldValue | Timestamp;
  tipo: TrasladosType;
  venta?: Venta;
}

export interface TrasladoPedido {
  id: string;
  usuarioSolicitud: string;
  idRepuesto?: string;
  usuarioEnProgreso?: string;
  ubicacion: Ubicacion;
  destino: Ubicacion;
  //origen: Ubicacion;
  estado: EstadoTraslado;
  // unidades: number;
  fechaInicio: FieldValue | Timestamp;
  fechaEnProgreso?: FieldValue | Timestamp;
  fechaEntregado?: FieldValue | Timestamp;
}
