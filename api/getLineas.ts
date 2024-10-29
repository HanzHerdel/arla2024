import {
  collection,
  Firestore,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
interface Lineas {
  id: string;
  marca: string;
  nombre: string;
}
export const getLineas = async (
  db: Firestore,
  setValues?: Function
): Promise<Lineas[]> => {
  try {
    const lineasCollection = collection(db, "lineas");

    const repQuery = query(lineasCollection, orderBy("nombre", "asc"));

    // Obtener los documentos
    const snapshot = await getDocs(repQuery);
    const fetchedLineas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Lineas[];
    if (setValues) {
      setValues(fetchedLineas);
    }
    return fetchedLineas;
  } catch (error) {
    console.error("Error fetching lineas: ", error);
    throw new Error("Error fetching lineas"); // Lanzar error para manejo en el llamador
  }
};
