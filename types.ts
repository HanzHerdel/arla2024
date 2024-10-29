import { FieldValue } from "firebase/firestore";

export interface Repuestos {
  id: string;
  // Agrega aquí otros campos que esperas en tus artículos
  categoria: string;
  codigo: string;
  compatibilidadFinal: number;
  compatibilidadInicial: number;
  estacion: string;
  existencias: number;
  linea: string;
  marca: string;
  modelo: number;
  nombre: string;
  precio: number;
  precioDescuento?: number;
  descripcion?: string;
  fechaDeModificacion?: FieldValue;
}

export interface RepuestoCart extends Repuestos {
  cantidad: number;
  costo: number;
  total?: number;
}

export interface Lineas {
  id: string;
  marca: string;
  nombre: string;
}

export interface Clientes {
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

export interface Marcas {
  id: string;
  nombre: string;
}
export interface Modelos {
  id: string;
  modelo: number;
}
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
