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
interface GetRepuestosVentas {
  nombre: string;
  marca?: string;
  linea?: string | null;
  estacion?: string | null;
  modelo?: string;
  limite?: number;
}
export const getRepuestosVentas = async (
  db: Firestore,
  { marca, linea, nombre, estacion, modelo, limite = 32 }: GetRepuestosVentas
): Promise<Repuestos[]> => {
  try {
    const keyWords = nombre
      .split(" ")
      .filter((word) => !CONECTORES.includes(word));

    const repuestosCollection = collection(db, "repuestos");

    const queryArray = [];
    marca && queryArray.push(where("marca", "==", marca));
    linea && queryArray.push(where("linea", "==", linea));
    keyWords.forEach((keyWord) => {
      queryArray.push(where("keyWords", "array-contains", keyWord));
    });
    queryArray.push(where("nombre", ">=", nombre));
    if (modelo) {
      queryArray.push(where("compatibilidadInicial", "<=", modelo));
      queryArray.push(where("compatibilidadFinal", ">=", modelo));
    }

    estacion && queryArray.push(where("estacion", "==", estacion));
    console.log("queryArray: ", queryArray);
    const repQuery = query(
      repuestosCollection,
      ...queryArray,
      orderBy("nombre", "asc"),
      limit(limite)
    );

    // Obtener los documentos
    const snapshot = await getDocs(repQuery);
    const fetchedRepuestos: Repuestos[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Repuestos[];
    return fetchedRepuestos;
  } catch (error) {
    console.error("Error fetching repuestos: ", error);
    throw new Error("Error fetching repuestos"); // Lanzar error para manejo en el llamador
  }
};
