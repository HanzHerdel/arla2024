import { Usuario } from "@/types";
import {
  collection,
  doc,
  Firestore,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { getQuery } from "./getQuery";

export const getUsuarioById = async (
  db: Firestore,
  userId: string
): Promise<Usuario | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const usuario = { id: docSnap.id, ...docSnap.data() } as Usuario;
      console.log("usuario: ", usuario);
      return usuario;
    } else {
      console.log("No se encontró el usuario con ID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return null;
  }
};

export const getUsuarios = async (
  db: Firestore,
  setusuarios: (u: Usuario[]) => void
): Promise<Usuario[] | null> => {
  try {
    const collRef = collection(db, "users");
    const repQuery = query(collRef, orderBy("nombre", "asc"));
    const result = await getQuery<Usuario>(repQuery);
    console.log("result: ", result);
    if (result) {
      setusuarios(result);
      return result;
    } else {
      console.log("No se encontraron usuarios");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return null;
  }
};
