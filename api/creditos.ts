import {
  collection,
  doc,
  Firestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getQuery } from "./getQuery";

export const getCreditos = async <Ventas>(
  db: Firestore,
  setValues: (data: Ventas[]) => void
): Promise<Ventas[] | null> => {
  const collectionRef = collection(db, "ventas");

  const ventasAlCreditoQuery = query(
    collectionRef,
    where("aCredito", "==", true)
  );
  const ventasAlCredito = await getQuery<Ventas>(
    ventasAlCreditoQuery,
    "creditos"
  );
  if (ventasAlCredito) {
    setValues(ventasAlCredito);
  }
  return ventasAlCredito;
};

export async function pagarCredito(db: Firestore, id: string) {
  const date = serverTimestamp();
  const docRef = doc(db, "ventas", id);

  return await updateDoc(docRef, {
    aCredito: false,
    creditoPagado: true,
    fecha: date,
  });
}
