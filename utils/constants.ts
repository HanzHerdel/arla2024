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
  pedidos = "pedidos",
}

export enum TipoHistorial {
  historialVentas = 1,
  historialProducto = 2,
}

export enum AccionHistorial {
  venta = 1,
  retorno = 2,
  eliminacion = 3,
  trasladoSolicitud = 4,
  actualizacion = 5,
  creacion = 6,
  trasladoEnProgreso = 41,
  trasladoEntregado = 42,
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

export const UbicacionesKeys = {
  ventas: "unidadesSalaVentas",
  bodega: "unidadesBodega",
  caja: "unidadesCaja",
  despacho: "unidadesDespacho",
  indefinida: "unidadesIndefinida",
} as const;

export enum EstadoTraslado {
  pendiente = "Pendiente",
  entregado = "Entregado",
  enProgreso = "En progreso",
  cancelado = "cancelado",
}

export const PAGES = {
  ventas: {
    usuarios: [Ubicacion.ventas],
    nombre: "ventas",
    title: "Sala de Ventas",
  },
  caja: { usuarios: [Ubicacion.caja], nombre: "caja", title: "Caja" },
  creditos: { usuarios: [], nombre: "creditos", title: "Creditos" },
  reportes: { usuarios: [], nombre: "reportes", title: "Reporteria" },
  creacion: { usuarios: [], nombre: "creacion", title: "Creacion Elementos" },
  inventario: {
    usuarios: [],
    nombre: "inventario",
    title: "Inventario y Edicion",
  },
  bodega: { usuarios: [Ubicacion.bodega], nombre: "bodega", title: "Bodega" },
  traslados: { usuarios: [], nombre: "traslados", title: "Traslados" },
  bitacora: {
    usuarios: [],
    nombre: "bitacora",
    title: "Bitacora de Repuestos",
  },
} as const;

export type PageKey = keyof typeof PAGES;

// 2. Crear un objeto que refleje estas claves
export const PageKeys: Record<PageKey, PageKey> = Object.keys(PAGES).reduce(
  (acc, key) => {
    acc[key as PageKey] = key as PageKey;
    return acc;
  },
  {} as Record<PageKey, PageKey>
);
