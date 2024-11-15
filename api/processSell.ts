import { Historial, ItemVenta, RepuestoCart, Usuario, New } from "@/types";
import { AccionHistorial, Collections, TipoHistorial } from "@/utils/constants";

import {
  collection,
  doc,
  Firestore,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Actualiza la cantidad de existencias y ultima actualizacion de shopList,
 * crea un registro de venta y añade documentos al historial por cada item
 * utiliza una transacción para la atomicidad de la operacion
 */
export const proccessSell = async (
  db: Firestore,
  shopList: RepuestoCart[],
  ventaData: any,
  usuario: Usuario
): Promise<boolean> => {
  try {
    const timestamp = serverTimestamp();
    await runTransaction(db, async (transaction) => {
      // Crear primero la referencia del documento de venta
      const ventasCollectionRef = collection(db, Collections.ventas);
      const newVentaRef = doc(ventasCollectionRef);
      const ventaId = newVentaRef.id;
      console.log("ventaId: ", ventaId);

      // Procesar cada item del shopList
      for (const actualizacion of shopList) {
        const repuestoRef = doc(db, Collections.repuestos, actualizacion.id);
        const repuestoSnapshot = await transaction.get(repuestoRef);
        console.log("repuestoSnapshot: ", repuestoSnapshot);

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

      const ventaItems: ItemVenta[] = shopList.map((item) => ({
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
      // Usar la referencia creada anteriormente
      transaction.set(newVentaRef, ventaData);
      // Crear documentos en la colección Historial para cada item
      for (const item of shopList) {
        const historialRef = doc(collection(db, Collections.historial));
        const historialDoc: New<Historial> = {
          tipo: TipoHistorial.historialProducto,
          accion: AccionHistorial.venta,
          fecha: timestamp,
          unidades: item.cantidad,
          idRepuesto: item.id,
          ventaId: ventaId,
          usuario: usuario.id,
        };
        transaction.set(historialRef, historialDoc);
      }

      const historialRef = doc(collection(db, Collections.historial));
      const historialDoc: New<Historial> = {
        tipo: TipoHistorial.historialVentas,
        accion: AccionHistorial.venta,
        fecha: timestamp,
        ventaId: ventaId,
        usuario: usuario.id,
      };
      transaction.set(historialRef, historialDoc);
    });

    console.log(
      "Actualización de cantidades, registro de ventas e historial completados correctamente"
    );
    return true;
  } catch (error) {
    console.error("Error al actualizar cantidades en transacción:", error);
    return false;
  }
};
