import { GenericValue, Traslados, Usuario } from "@/types";
import { Collections, EstadoTraslado, Ubicacion } from "@/utils/constants";
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const createTraslado = async (
  db: Firestore,
  ubicacionSalida: GenericValue,
  ubicacionDestino: GenericValue,
  user: Usuario
): Promise<Traslados | null> => {
  try {
    // Referencia a la colección
    const collectionRef = collection(db, Collections.solicitudTraslado);

    // Si se proporciona un ID personalizado, usamos ese
    const docRef = doc(collectionRef);

    // Agregar timestamps
    const timestamp = serverTimestamp();
    const documentData = {
      usuarioSolicitud: user.id,
      ubicacion: ubicacionSalida.id,
      destino: ubicacionDestino.id,
      estado: EstadoTraslado.pendiente,
      fechaInicio: timestamp,
    };

    await setDoc(docRef, documentData);
    console.log(
      "elemento creado con exito",
      Collections.solicitudTraslado,
      documentData
    );
    return {
      ...documentData,
      id: docRef.id,
    } as Traslados;
  } catch (error) {
    console.error(
      `Error creating document in ${Collections.solicitudTraslado}:`,
      error
    );
    return null;
  }
};

export const updateTrasladoStatus = async (
  db: Firestore,
  trasladoId: string,
  nuevoEstado: EstadoTraslado,
  usuarioActualizacion?: string
): Promise<boolean> => {
  try {
    // Referencia al documento específico
    const docRef = doc(db, Collections.solicitudTraslado, trasladoId);

    // Datos a actualizar
    const updateData: Partial<Traslados> = {
      estado: nuevoEstado,
    };

    if (nuevoEstado === EstadoTraslado.enProgreso) {
      updateData.fechaEnProgreso = serverTimestamp();
      updateData.usuarioEnProgreso = usuarioActualizacion;
      await updateDoc(docRef, updateData);
    }
    // Si el estado es 'completado' o 'cancelado', agregamos la fecha de finalización
    if (nuevoEstado === EstadoTraslado.entregado) {
      await deleteDoc(docRef);
    }

    console.log(
      "Estado de traslado actualizado con éxito",
      Collections.solicitudTraslado,
      trasladoId,
      updateData
    );

    return true;
  } catch (error) {
    console.error(
      `Error actualizando estado del traslado ${trasladoId} en ${Collections.solicitudTraslado}:`,
      error
    );
    return false;
  }
};
