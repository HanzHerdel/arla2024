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

export const getVentas = async <Ventas>(
  db: Firestore,
  setValues: (data: Ventas[]) => void,
  fechaInicio: Date,
  fechaFin: Date,
  vendedorId?: string
): Promise<Ventas[] | null> => {
  const collectionRef = collection(db, Collections.ventas);

  const querys = [
    where("fecha", ">=", fechaInicio),
    where("fecha", "<=", fechaFin),
    ...(vendedorId ? [where("vendedor.id", "==", vendedorId)] : []),
  ];

  const ventasQuery = query(collectionRef, ...querys, orderBy("fecha", "asc"));
  const ventas = await getQuery<Ventas>(ventasQuery, "ventas");

  if (ventas) {
    setValues(ventas);
  } else {
    setValues([]);
  }

  return ventas;
};
