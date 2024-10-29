import { Repuestos } from "@/types";
import { CONECTORES } from "@/utils/constants";
import {
  collection,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const getCollectionData = async <T>(
  db: Firestore,
  collectionName: string,
  setValues?: (data: T[]) => void,
  orderByProp = "nombre"
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);

    const repQuery = query(collectionRef, orderBy(orderByProp, "asc"));

    // Obtener los documentos
    const snapshot = await getDocs(repQuery);
    const fetchedData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    if (setValues) {
      setValues(fetchedData);
    }

    return fetchedData;
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}: `, error);
    throw new Error(`Error fetching data from ${collectionName}`);
  }
};
