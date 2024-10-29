import { RepuestoCart } from "@/types";
import {
  collection,
  doc,
  Firestore,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

/**
 * Actualiza la cantidad de existencias y ultima actualizacion de shopList y crea una registro de venta
 * utiliza una transacción para la atomicidad de la operacion
 */
export const proccessSell = async (
  db: Firestore,
  shopList: RepuestoCart[],
  ventaData: any
): Promise<boolean> => {
  try {
    const timestamp = serverTimestamp();
    await runTransaction(db, async (transaction) => {
      for (const actualizacion of shopList) {
        const repuestoRef = doc(db, "repuestos", actualizacion.id);
        const repuestoSnapshot = await transaction.get(repuestoRef);

        if (!repuestoSnapshot.exists()) {
          throw new Error(`Repuesto con ID ${actualizacion.id} no existe`);
        }

        const existenciasActuales = repuestoSnapshot.data()?.existencias ?? 0;
        console.log("existenciasActuales: ", existenciasActuales);

        // Verifica que la nueva cantidad no haga que las existencias sean menores a 0
        const nuevaCantidad = existenciasActuales - actualizacion.cantidad;
        if (nuevaCantidad < 0) {
          throw new Error(
            `Las existencias para el repuesto con ID ${actualizacion.id} no pueden ser menores a 0`
          );
        }

        // Realiza la actualización en la transacción
        transaction.update(repuestoRef, {
          existencias: nuevaCantidad,
          fechaDeModificacion: timestamp,
        });
      }

      const ventaItems = shopList.map((item) => ({
        item: item.id,
        unidades: item.cantidad,
        nombre: item.nombre,
        marca: item.marca,
        linea: item.linea,
        modelo: item.modelo,
        precio: item.costo,
        categoria: item.cantidad,
        codigo: item.codigo,
      }));
      ventaData.items = ventaItems;
      ventaData.fecha = timestamp;
      // Agregar la venta
      const ventasRef = doc(collection(db, "ventas"));
      transaction.set(ventasRef, ventaData);
    });

    console.log(
      "Actualización de cantidades y registro de ventas completados correctamente"
    );
    return true;
  } catch (error) {
    console.error("Error al actualizar cantidades en transacción:", error);
    return false;
  }
};
