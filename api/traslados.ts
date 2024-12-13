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
  user: Usuario
): Promise<Traslados | null> => {
  try {
    // Referencia a la colección
    const collectionRef = collection(db, Collections.traslado);

    const docRef = doc(collectionRef);

    const timestamp = serverTimestamp();
    const documentData: New<Traslados> = {
      usuarioSolicitud: user.id,
      ubicacion: ubicacionSalida as Ubicacion,
      destino: ubicacionDestino as Ubicacion,
      estado: EstadoTraslado.pendiente,
      fechaInicio: timestamp,
      idRepuesto: repuesto.id,
      tipo: TrasladosType.traslado,
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
      Collections.traslado,
      documentData
    );
    return {
      ...documentData,
      id: docRef.id,
    } as Traslados;
  } catch (error) {
    console.error(`Error creating document in ${Collections.traslado}:`, error);
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
    const docRef = doc(db, Collections.traslado, traslado.id);

    // Datos a actualizar
    const updateData: Partial<Traslados> = {
      estado: nuevoEstado,
    };

    if (nuevoEstado === EstadoTraslado.enProgreso) {
      await runTransaction(db, async (transaction) => {
        const timestamp = serverTimestamp();

        // Se crean historiales cuando no son ventas
        if (traslado.tipo !== TrasladosType.venta) {
          const historialRef = doc(collection(db, Collections.historial));
          const historialDoc: New<Historial> = {
            tipo: TipoHistorial.historialProducto,
            accion: AccionHistorial.trasladoEnProgreso,
            fecha: timestamp,
            idRepuesto: traslado.id,
            usuario: usuarioActualizacion,
          };
          transaction.set(historialRef, historialDoc);
        }
        updateData.fechaEnProgreso = serverTimestamp();
        updateData.usuarioEnProgreso = usuarioActualizacion;
        transaction.update(docRef, updateData);
      });
    }
    // Si el estado es 'completado' o 'cancelado', agregamos la fecha de finalización
    if (nuevoEstado === EstadoTraslado.entregado) {
      await runTransaction(db, async (transaction) => {
        if (traslado.tipo !== TrasladosType.venta) {
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
        }
        transaction.delete(docRef);
      });
    }

    console.log(
      "Estado de traslado actualizado con éxito",
      Collections.traslado,
      traslado.id,
      updateData
    );

    return true;
  } catch (error) {
    console.error(
      `Error actualizando estado del traslado ${traslado.id} en ${Collections.traslado}:`,
      error
    );
    return false;
  }
};
