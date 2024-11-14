import { FieldValue, Timestamp } from "firebase/firestore";

export enum EstadoRepuesto {
  nuevo = "nuevo",
  usado = "usado",
}
export interface Repuesto {
  id: string;
  // Agrega aquí otros campos que esperas en tus artículos
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
  linea: string;
  marca: string;
  keyWords?: Array<string>;
  // este es el unico valor apuntando a Ids de momento
  proveedor?: string;
  /*   categoriaId: string;
  lineaId?: string;
  estacionId: string;
  marcaId: string; */
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
export interface User {
  id: string;
  admin: boolean;
  sueprUser: boolean;
  nombre: string;
  telefono: string;
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
export interface Venta {
  id: string;
  cliente: Cliente;
  vendedor: Usuario;
  items: ItemVenta[];
  total: number;
  fecha: FieldValue | Timestamp;
  atendio: Usuario;
}

export interface Usuario {
  id: string;
  admin: boolean;
  nombre: string;
  password: string;
  superUser: boolean;
  tel: string;
  usuario: string;
}

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
