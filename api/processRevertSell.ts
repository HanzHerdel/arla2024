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
      // Obtener el documento de la venta
      const ventaRef = doc(db, Collections.ventas, ventaId);
      const ventaSnapshot = await transaction.get(ventaRef);

      if (!ventaSnapshot.exists()) {
        throw new Error(`La venta con ID ${ventaId} no existe`);
      }

      const ventaData = ventaSnapshot.data();
      const items: ItemVenta[] = ventaData.items;

      // Actualizar existencias de cada producto
      for (const item of items) {
        const repuestoRef = doc(db, Collections.repuestos, item.item);
        const repuestoSnapshot = await transaction.get(repuestoRef);

        if (!repuestoSnapshot.exists()) {
          throw new Error(`Repuesto con ID ${item.item} no existe`);
        }

        const existenciasActuales = repuestoSnapshot.data()?.existencias ?? 0;

        // Incrementar la cantidad (revertir la venta)
        const nuevaCantidad = existenciasActuales + item.unidades;

        // Actualizar el documento del repuesto
        transaction.update(repuestoRef, {
          existencias: nuevaCantidad,
          fechaDeModificacion: timestamp,
        });
        // creacion historial de repuestos
        const historialRef = doc(collection(db, Collections.historial));
        const historialDoc: New<Historial> = {
          tipo: TipoHistorial.historialProducto,
          accion: AccionHistorial.eliminacion,
          fecha: timestamp,
          unidades: item.unidades,
          idRepuesto: item.item,
          ventaId: ventaId,
          usuario: user.id,
        };
        transaction.set(historialRef, historialDoc);
      }
      // agregar entrada a la colleccion ventasDeleted
      const ventaDeletedRef = doc(
        collection(db, Collections.ventasDeleted, ventaId)
      );
      transaction.set(ventaDeletedRef, {
        ...ventaData,
        fechaEliminacion: serverTimestamp(),
        ventaOriginalId: ventaId,
        eliminadoPor: user,
        userId: user.id,
      });
      // eliminar venta
      transaction.delete(ventaRef);
      // creacopm historial de ventas
      const historialRef = doc(collection(db, Collections.historial));
      const historialDoc: New<Historial> = {
        tipo: TipoHistorial.historialVentas,
        accion: AccionHistorial.eliminacion,
        fecha: timestamp,
        ventaId: ventaId,
        usuario: user.id,
      };
      transaction.set(historialRef, historialDoc);
    });

    console.log("Reversión de venta completada correctamente");
    return true;
  } catch (error) {
    console.error("Error al revertir la venta:", error);
    return false;
  }
};
