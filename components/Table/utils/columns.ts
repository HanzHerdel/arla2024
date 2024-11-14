import { RepuestoCart, Repuesto } from "@/types";
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
    render: (item: Repuesto) => item.nombre,
  },
  {
    id: "compatibilidad",
    title: "Compatibilidad",
    flex: 2,
    render: (item: Repuesto) =>
      formatCompatibility(item.compatibilidadInicial, item.compatibilidadFinal),
  },
  {
    id: "marca",
    title: "Marca",
    flex: 1,
    render: (item: Repuesto) => item.marca,
  },
  {
    id: "linea",
    title: "Línea",
    flex: 1,
    render: (item: Repuesto) => item.linea,
  },
  {
    id: "estacion",
    title: "Estación",
    flex: 1,
    render: (item: Repuesto) => item.estacion,
  },
  {
    id: "precio",
    title: "Precio",
    flex: 1,
    render: (item: Repuesto) => formatCurrency(item.precio),
  },
];

export const columnsVentas = [
  {
    id: "existencias",
    title: "U",
    width: "2em",
    render: (item: Repuesto) => item.existencias,
  },
  ...columnsCommon,
  {
    id: "precioDescuento",
    title: "Descuento",
    flex: 1,
    render: (item: Repuesto) => formatCurrency(item.precioDescuento),
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
