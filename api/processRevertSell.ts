import { Usuario } from "@/types";
import { Collections } from "@/utils/constants";
import {
  Firestore,
  doc,
  runTransaction,
  serverTimestamp,
  deleteDoc,
  collection,
} from "firebase/firestore";

interface ItemVenta {
  item: string;
  unidades: number;
  nombre: string;
  marca: string;
  linea: string;
  modelo: string;
  precio: number;
  categoria: number;
  codigo: string;
}

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
      const ventaRef = doc(db, "ventas", ventaId);
      const ventaSnapshot = await transaction.get(ventaRef);

      if (!ventaSnapshot.exists()) {
        throw new Error(`La venta con ID ${ventaId} no existe`);
      }

      const ventaData = ventaSnapshot.data();
      const items: ItemVenta[] = ventaData.items;

      // Actualizar existencias de cada producto
      for (const item of items) {
        const repuestoRef = doc(db, "repuestos", item.item);
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
      }
      // agregar entrada a la colleccion ventasDeleted
      const ventaDeletedRef = doc(collection(db, Collections.ventasDeleted));
      transaction.set(ventaDeletedRef, {
        ...ventaData,
        fechaEliminacion: serverTimestamp(),
        ventaOriginalId: ventaId,
        eliminadoPor: user,
        userId: user.id,
      });
      // eliminar venta
      transaction.delete(ventaRef);
    });

    console.log("Reversión de venta completada correctamente");
    return true;
  } catch (error) {
    console.error("Error al revertir la venta:", error);
    return false;
  }
};
