import {
  collection,
  Firestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getQuery } from "./getQuery";
import { Collections } from "@/utils/constants";
import { TiposVentaUsuario } from "@/types";

export const getVentas = async <Ventas>(
  db: Firestore,
  setValues: (data: Ventas[]) => void,
  fechaInicio: Date,
  fechaFin: Date,
  tipo: TiposVentaUsuario,
  usuarioId?: string
): Promise<Ventas[] | null> => {
  const collectionRef = collection(db, Collections.ventas);

  const querys = [
    where("fecha", ">=", fechaInicio),
    where("fecha", "<=", fechaFin),
  ];

  if (usuarioId) {
    if (tipo === TiposVentaUsuario.vendedor) {
      // TODO: corregir al corregir el vendedor a string
      querys.push(where("vendedor.id", "==", usuarioId));
    } else {
      querys.push(where(tipo, "==", usuarioId));
    }
  }
  const ventasQuery = query(collectionRef, ...querys, orderBy("fecha", "asc"));
  const ventas = await getQuery<Ventas>(ventasQuery, "ventas");

  if (ventas) {
    setValues(ventas);
  } else {
    setValues([]);
  }

  return ventas;
};
