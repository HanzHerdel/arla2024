export const CONECTORES = [
  "",
  "DE",
  "LA",
  "LAS",
  "DEL",
  "A",
  "QUE",
  "CON",
  "POR",
  "EN",
];

export enum Collections {
  ventasDeleted = "ventasDeleted",
  users = "users",
  ventas = "ventas",
  marcas = "marcas",
  modelos = "modelos",
  lineas = "lineas",
  categorias = "categorias",
  proveedores = "proveedores",
  estaciones = "estaciones",
  repuestos = "repuestos",
  historial = "historial",
  clientes = "clientes",
  solicitudTraslado = "traslados",
}

export enum TipoHistorial {
  historialVentas = 1,
  historialProducto = 2,
}

export enum AccionHistorial {
  venta = 1,
  retorno = 2,
  eliminacion = 3,
  traslado = 4,
  actualizacion = 5,
  creacion = 6,
}

export enum RazonHistorial {
  garantia = 1,
  impago = 2,
}

export enum Ubicacion {
  ventas = "Sala de Ventas",
  bodega = "Bodega",
  caja = "Caja",
  despacho = "Despacho",
  indefinida = "No Definida",
}

export enum EstadoTraslado {
  pendiente = "Pendiente",
  entregado = "Entregado",
  enProgreso = "En progreso",
  cancelado = "cancelado",
}
