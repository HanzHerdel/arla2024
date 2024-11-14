import { Modelo } from "@/types";
import { FieldValue, Timestamp } from "firebase/firestore";

export const getDateString = (fechaRaw: Timestamp) => {
  const fecha = fechaRaw.toDate();
  const fechaFormateada = fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return fechaFormateada;
};

export const generateYearsList = (startYear: number = 1980): Modelo[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return { id: year.toString(), modelo: year, nombre: year };
  });
};
