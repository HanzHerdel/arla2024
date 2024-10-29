import { RepuestoCart, Repuestos } from "@/types";
import { formatCurrency } from "./formatCurrency";
import { formatCompatibility } from "./formatCompatibility";

export interface Column {
  id: string;
  title: string;
  render: Function;
  flex?: any;
  width?: any;
}

const columnsCommon = [
  {
    id: "nombre",
    title: "Nombre",
    flex: 3,
    render: (item: Repuestos) => item.nombre,
  },
  {
    id: "compatibilidad",
    title: "Compatibilidad",
    flex: 2,
    render: (item: Repuestos) =>
      formatCompatibility(item.compatibilidadInicial, item.compatibilidadFinal),
  },
  {
    id: "marca",
    title: "Marca",
    flex: 1,
    render: (item: Repuestos) => item.marca,
  },
  {
    id: "linea",
    title: "Línea",
    flex: 1,
    render: (item: Repuestos) => item.linea,
  },
  {
    id: "estacion",
    title: "Estación",
    flex: 1,
    render: (item: Repuestos) => item.estacion,
  },
  {
    id: "precio",
    title: "Precio",
    flex: 1,
    render: (item: Repuestos) => formatCurrency(item.precio),
  },
];

export const columnsVentas = [
  {
    id: "existencias",
    title: "U",
    width: "2em",
    render: (item: Repuestos) => item.existencias,
  },
  ...columnsCommon,
  {
    id: "precioDescuento",
    title: "Descuento",
    flex: 1,
    render: (item: Repuestos) => formatCurrency(item.precioDescuento),
  },
];

export const columnsCart = [
  {
    id: "cantidad",
    title: "U",
    width: "2em",
    render: (item: RepuestoCart) => item.cantidad,
  },
  ...columnsCommon,
  {
    id: "total",
    title: "Total",
    flex: 1,
    render: (item: RepuestoCart) => formatCurrency(item.costo * item.cantidad),
  },
];
