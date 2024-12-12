import { Repuesto } from "@/types";

export const convertRepValuesToNumbers = (
  data: Partial<Repuesto>
): Partial<Repuesto> => {
  const numericFields: (keyof Repuesto)[] = [
    "compatibilidadFinal",
    "compatibilidadInicial",
    "modelo",
    "precio",
    "precioDescuento",
    "unidadesLimite",
    "existencias",
    "unidadesSalaVentas",
    "unidadesBodega",
    "unidadesCaja",
    "unidadesDespacho",
    "unidadesEnTraslado",
  ];

  const convertedData = { ...data };

  numericFields.forEach((field) => {
    if (field in data && data[field] !== undefined && data[field] !== "") {
      // @ts-ignore - Necesario porque TypeScript no puede inferir que el campo es numérico
      convertedData[field] = Number(data[field]);
    }
  });

  return convertedData;
};
