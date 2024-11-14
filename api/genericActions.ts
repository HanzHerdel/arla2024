import { Collections } from "@/utils/constants";
import {
  collection,
  doc,
  Firestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export const createGenericDocument = async <T>(
  db: Firestore,
  collectionName: Collections,
  data: T,
  customId?: string
): Promise<T | null> => {
  try {
    // Referencia a la colección
    const collectionRef = collection(db, collectionName);

    // Si se proporciona un ID personalizado, usamos ese
    const docRef = customId ? doc(collectionRef, customId) : doc(collectionRef);

    // Agregar timestamps
    const timestamp = serverTimestamp();
    const documentData = {
      ...data,
      fechaDeCreacion: timestamp,
      fechaDeModificacion: timestamp,
    };

    await setDoc(docRef, documentData);
    console.log("elemento creado con exito", collectionName, documentData);
    // Retornar el documento creado con su ID
    return {
      ...data,
      id: docRef.id,
    } as T;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    return null;
  }
};
