import { Collections } from "@/utils/constants";
import {
  collection,
  doc,
  Firestore,
  serverTimestamp,
  setDoc,
  updateDoc,
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
    return {
      ...data,
      id: docRef.id,
    } as T;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    return null;
  }
};

export const updateGenericDocument = async <T>(
  db: Firestore,
  collectionName: Collections,
  documentId: string,
  data: Partial<T>
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const documentData = {
      ...data,
      fechaDeModificacion: serverTimestamp(),
    };

    await updateDoc(docRef, documentData);
    console.log("elemento actualizado con éxito", collectionName, documentData);
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return false;
  }
};
