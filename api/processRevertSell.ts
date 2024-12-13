import { Historial, ItemVenta, New, Usuario } from "@/types";
import {
  AccionHistorial,
  Collections,
  RazonHistorial,
  TipoHistorial,
} from "@/utils/constants";
import {
  Firestore,
  doc,
  runTransaction,
  serverTimestamp,
  deleteDoc,
  collection,
  DocumentSnapshot,
} from "firebase/firestore";

/**
 * Revierte una venta: incrementa las existencias de los productos y elimina el registro de venta
 * Utiliza una transacción para mantener la atomicidad de la operación
 */
export const processRevertSell = async (
  db: Firestore,
  ventaId: string,
  user: Usuario
): Promise<boolean> => {
  try {
    const timestamp = serverTimestamp();

    await runTransaction(db, async (transaction) => {
      // Paso 1: Obtener el documento de la venta
      const ventaRef = doc(db, Collections.ventas, ventaId);
      const ventaSnapshot = await transaction.get(ventaRef);

      if (!ventaSnapshot.exists()) {
        throw new Error(`La venta con ID ${ventaId} no existe`);
      }

      const ventaData = ventaSnapshot.data();
      const items: ItemVenta[] = ventaData.items;

      // Paso 2: Lectura de todos los repuestos
      const repuestoSnapshots: {
        id: string;
        snapshot: DocumentSnapshot;
        unidades: number;
      }[] = [];

      // Leer todos los repuestos
      for (const item of items) {
        const repuestoRef = doc(db, Collections.repuestos, item.item);
        const repuestoSnapshot = await transaction.get(repuestoRef);

        if (!repuestoSnapshot.exists()) {
          throw new Error(`Repuesto con ID ${item.item} no existe`);
        }

        repuestoSnapshots.push({
          id: item.item,
          snapshot: repuestoSnapshot,
          unidades: item.unidades,
        });
      }

      // Paso 3: Realizar todas las actualizaciones de repuestos
      const historialProductoDocs: New<Historial>[] = [];
      for (const { snapshot, unidades, id } of repuestoSnapshots) {
        const repuestoRef = doc(db, Collections.repuestos, id);
        const existenciasActuales = snapshot.data()?.existencias ?? 0;

        // Incrementar la cantidad (revertir la venta)
        const nuevaCantidad = existenciasActuales + unidades;

        transaction.update(repuestoRef, {
          existencias: nuevaCantidad,
          fechaDeModificacion: timestamp,
        });

        // Preparar historial de repuestos
        historialProductoDocs.push({
          tipo: TipoHistorial.historialProducto,
          accion: AccionHistorial.eliminacion,
          fecha: timestamp,
          unidades: unidades,
          idRepuesto: id,
          ventaId: ventaId,
          usuario: user.id,
        });
      }

      // Paso 4: Crear documentos de historial de producto
      historialProductoDocs.forEach((historialDoc) => {
        const historialRef = doc(collection(db, Collections.historial));
        transaction.set(historialRef, historialDoc);
      });

      // Paso 5: Agregar entrada a la colección ventasDeleted
      const ventaDeletedRef = doc(
        collection(db, Collections.ventasDeleted),
        ventaId
      );
      transaction.set(ventaDeletedRef, {
        ...ventaData,
        fechaEliminacion: timestamp,
        ventaOriginalId: ventaId,
        eliminadoPor: user,
        userId: user.id,
      });

      // Paso 6: Eliminar venta original
      transaction.delete(ventaRef);

      // Paso 7: Crear historial de ventas
      const historialVentaRef = doc(collection(db, Collections.historial));
      const historialVentaDoc: New<Historial> = {
        tipo: TipoHistorial.historialVentas,
        accion: AccionHistorial.eliminacion,
        fecha: timestamp,
        ventaId: ventaId,
        usuario: user.id,
      };
      transaction.set(historialVentaRef, historialVentaDoc);
    });

    console.log("Reversión de venta completada correctamente");
    return true;
  } catch (error) {
    console.error("Error al revertir la venta:", error);
    return false;
  }
};
