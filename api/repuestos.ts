import { Historial, New, Repuesto, Usuario } from "@/types";
import { AccionHistorial, Collections, TipoHistorial } from "@/utils/constants";
import {
  collection,
  doc,
  Firestore,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const createRepuesto = async (
  db: Firestore,
  data: New<Repuesto>,
  usuario: Usuario
): Promise<Repuesto | null> => {
  try {
    // Referencia a la colección
    const collectionRef = collection(db, Collections.repuestos);

    const docRef = doc(collectionRef);

    const timestamp = serverTimestamp();
    const productoData = {
      ...data,
      fechaDeCreacion: timestamp,
      fechaDeModificacion: timestamp,
    };

    await runTransaction(db, async (transaction) => {
      // Create the new Repuesto document
      transaction.set(docRef, productoData);

      // Create the Historial document
      const historialRef = doc(collection(db, Collections.historial));
      const historialDoc: New<Historial> = {
        tipo: TipoHistorial.historialProducto,
        accion: AccionHistorial.creacion,
        fecha: timestamp,
        unidades: productoData.existencias,
        idRepuesto: docRef.id,
        usuario: usuario.id,
      };
      transaction.set(historialRef, historialDoc);
    });

    const repuesto = {
      ...data,
      id: docRef.id,
    };
    console.log("elemento creado con exito", repuesto);
    return repuesto as Repuesto;
  } catch (error) {
    console.error(
      `Error creating document in ${Collections.repuestos}:`,
      error
    );
    return null;
  }
};

export const updateRepuesto = async (
  db: Firestore,
  documentId: string,
  data: Repuesto,
  usuario: Usuario
): Promise<Repuesto | null> => {
  try {
    const docRef = doc(db, Collections.repuestos, documentId);

    // Get the current document data
    const currentDoc = await getDoc(docRef);
    const previousData = currentDoc.data() as Repuesto;

    const updatedData = {
      ...previousData,
      ...data,
      fechaDeModificacion: serverTimestamp(),
    };

    await runTransaction(db, async (transaction) => {
      // Update the Repuesto document
      transaction.update(docRef, updatedData);

      // Create a new Historial document
      getChangedFields;
      const historialRef = doc(collection(db, Collections.historial));
      const historialDoc: New<Historial> = {
        tipo: TipoHistorial.historialProducto,
        accion: AccionHistorial.actualizacion,
        fecha: serverTimestamp(),
        idRepuesto: documentId,
        usuario: usuario.id,
        changes: getChangedFields(previousData, updatedData),
      };
      transaction.set(historialRef, historialDoc);
    });

    console.log(
      "elemento actualizado con éxito",
      Collections.repuestos,
      updatedData
    );
    return updatedData;
  } catch (error) {
    console.error(
      `Error updating document in ${Collections.repuestos}:`,
      error
    );
    return null;
  }
};

const getChangedFields = (
  prevData: Record<string, any>,
  updatedData: Record<string, any>
): Record<string, any> => {
  const changes: Record<string, any> = {};
  for (const key in updatedData) {
    if (updatedData.hasOwnProperty(key) && prevData.hasOwnProperty(key)) {
      const dataCurrent = JSON.stringify(prevData[key]);
      const dataNew = JSON.stringify(updatedData[key]);
      if (dataCurrent !== dataNew) {
        changes[key] = updatedData[key];
        changes[`_${key}`] = prevData[key];
      }
    }
  }

  return changes;
};
