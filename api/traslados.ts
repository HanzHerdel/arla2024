import {
  GenericValue,
  Historial,
  New,
  Repuesto,
  Traslados,
  TrasladosType,
  Usuario,
} from "@/types";
import {
  AccionHistorial,
  Collections,
  EstadoTraslado,
  TipoHistorial,
  Ubicacion,
} from "@/utils/constants";
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const createTraslado = async (
  db: Firestore,
  ubicacionSalida: string,
  ubicacionDestino: string,
  repuesto: Repuesto,
  user: Usuario,
  tipoTraslado: TrasladosType = TrasladosType.traslado
): Promise<Traslados | null> => {
  try {
    // Referencia a la colección
    const collectionRef = collection(db, Collections.solicitudTraslado);

    const docRef = doc(collectionRef);

    const timestamp = serverTimestamp();
    const documentData: New<Traslados> = {
      usuarioSolicitud: user.id,
      ubicacion: ubicacionSalida as Ubicacion,
      destino: ubicacionDestino as Ubicacion,
      estado: EstadoTraslado.pendiente,
      fechaInicio: timestamp,
      idRepuesto: repuesto.id,
      tipo: tipoTraslado,
    };

    await runTransaction(db, async (transaction) => {
      const historialRef = doc(collection(db, Collections.historial));
      const historialDoc: New<Historial> = {
        tipo: TipoHistorial.historialProducto,
        accion: AccionHistorial.trasladoEnProgreso,
        fecha: timestamp,
        idRepuesto: repuesto.id,
        usuario: user.id,
      };
      transaction.set(historialRef, historialDoc);
      transaction.set(docRef, documentData);
    });
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
  traslado: Traslados,
  nuevoEstado: EstadoTraslado,
  usuarioActualizacion: string
): Promise<boolean> => {
  try {
    // Referencia al documento específico
    const docRef = doc(db, Collections.solicitudTraslado, traslado.id);

    // Datos a actualizar
    const updateData: Partial<Traslados> = {
      estado: nuevoEstado,
    };

    if (nuevoEstado === EstadoTraslado.enProgreso) {
      await runTransaction(db, async (transaction) => {
        const historialRef = doc(collection(db, Collections.historial));
        const timestamp = serverTimestamp();
        updateData.fechaEnProgreso = serverTimestamp();
        updateData.usuarioEnProgreso = usuarioActualizacion;
        const historialDoc: New<Historial> = {
          tipo: TipoHistorial.historialProducto,
          accion: AccionHistorial.trasladoEnProgreso,
          fecha: timestamp,
          idRepuesto: docRef.id,
          usuario: usuarioActualizacion,
        };
        transaction.set(historialRef, historialDoc);
        transaction.update(docRef, updateData);
      });
    }
    // Si el estado es 'completado' o 'cancelado', agregamos la fecha de finalización
    if (nuevoEstado === EstadoTraslado.entregado) {
      await runTransaction(db, async (transaction) => {
        const historialRef = doc(collection(db, Collections.historial));
        const timestamp = serverTimestamp();
        const historialDoc: New<Historial> = {
          tipo: TipoHistorial.historialProducto,
          accion: AccionHistorial.trasladoEntregado,
          fecha: timestamp,
          idRepuesto: traslado.idRepuesto,
          usuario: usuarioActualizacion,
        };
        transaction.set(historialRef, historialDoc);
        transaction.delete(docRef);
      });
    }

    console.log(
      "Estado de traslado actualizado con éxito",
      Collections.solicitudTraslado,
      traslado.id,
      updateData
    );

    return true;
  } catch (error) {
    console.error(
      `Error actualizando estado del traslado ${traslado.id} en ${Collections.solicitudTraslado}:`,
      error
    );
    return false;
  }
};
