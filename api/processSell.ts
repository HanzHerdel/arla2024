import {
  Historial,
  ItemVenta,
  RepuestoCart,
  Usuario,
  New,
  Repuesto,
  Venta,
  VentaEstados,
} from "@/types";
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
export const processSell = async (
  db: Firestore,
  pedido: Venta,
  usuario: Usuario
): Promise<boolean> => {
  try {
    const timestamp = serverTimestamp();
    const ventaData = { ...pedido };
    await runTransaction(db, async (transaction) => {
      // Crear primero la referencia del documento de venta
      const ventasCollectionRef = collection(db, Collections.ventas);
      const newVentaRef = doc(ventasCollectionRef, ventaData.id);
      console.log("newVentaRef: ", newVentaRef);
      const ventaId = newVentaRef.id;
      console.log("ventaId: ", ventaId);

      // Procesar cada item del shopList
      for (const item of ventaData.items) {
        const repuestoRef = doc(db, Collections.repuestos, item.item);
        const repuestoSnapshot = await transaction.get(repuestoRef);
        console.log("repuestoSnapshot: ", repuestoSnapshot);

        if (!repuestoSnapshot.exists()) {
          throw new Error(`Repuesto con ID ${item.item} no existe`);
        }

        const { existencias = 0, unidadesEnReserva = 0 } =
          repuestoSnapshot.data() as Repuesto;
        console.log("existenciasActuales: ", existencias);

        // Verifica que la nueva cantidad no haga que las existencias sean menores a 0
        const nuevaCantidad = existencias - item.unidades;
        if (nuevaCantidad < 0) {
          throw new Error(
            `Las existencias para el repuesto con ID ${item.item} no pueden ser menores a 0`
          );
        }

        // Realiza la actualización en la transacción
        transaction.update(repuestoRef, {
          existencias: nuevaCantidad,
          fechaDeModificacion: timestamp,
          unidadesEnReserva: unidadesEnReserva
            ? unidadesEnReserva - item.unidades
            : 0,
        });
      }

      ventaData.fecha = timestamp;
      ventaData.cajero = usuario;
      ventaData.estado = VentaEstados.pendiente;
      transaction.set(newVentaRef, ventaData);
      // Crear documentos Historial de producto para cada item
      for (const item of ventaData.items) {
        const historialRef = doc(collection(db, Collections.historial));
        const historialDoc: New<Historial> = {
          tipo: TipoHistorial.historialProducto,
          accion: AccionHistorial.venta,
          fecha: timestamp,
          unidades: item.unidades,
          idRepuesto: item.item,
          ventaId: ventaId,
          vendedor: ventaData.vendedor.id,
          cajero: usuario.id,
        };
        transaction.set(historialRef, historialDoc);
      }
      // Crear historial de venta
      const historialRef = doc(collection(db, Collections.historial));
      const historialDoc: New<Historial> = {
        tipo: TipoHistorial.historialVentas,
        accion: AccionHistorial.venta,
        fecha: timestamp,
        ventaId: ventaId,
        vendedor: ventaData.vendedor.id,
        cajero: usuario.id,
      };
      transaction.set(historialRef, historialDoc);
      /** actualizar pedido */
      const pedidosCollectionRef = collection(db, Collections.pedidos);
      const pedidoExistente = doc(pedidosCollectionRef, pedido.id);
      transaction.update(pedidoExistente, {
        estado: VentaEstados.cobrado,
      });
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

export const createPedido = async (
  db: Firestore,
  shopList: RepuestoCart[],
  pedidoData: any,
  usuario: Usuario
): Promise<boolean> => {
  try {
    const timestamp = serverTimestamp();
    await runTransaction(db, async (transaction) => {
      // Crear primero la referencia del documento de venta
      const pedidosCollectionRef = collection(db, Collections.pedidos);
      const nuevoPedido = doc(pedidosCollectionRef);
      const pedidoId = nuevoPedido.id;
      console.log("ventaId: ", pedidoId);

      // Procesar cada item del shopList
      for (const actualizacion of shopList) {
        const repuestoRef = doc(db, Collections.repuestos, actualizacion.id);
        const repuestoSnapshot = await transaction.get(repuestoRef);
        console.log("repuestoSnapshot: ", repuestoSnapshot);

        if (!repuestoSnapshot.exists()) {
          throw new Error(`Repuesto con ID ${actualizacion.id} no existe`);
        }

        const { existencias, unidadesEnReserva } =
          repuestoSnapshot.data() as Repuesto;
        console.log("existenciasActuales: ", existencias);

        // Verifica que la nueva cantidad no haga que las existencias sean menores a 0
        const nuevaCantidad = existencias - actualizacion.cantidad;
        if (nuevaCantidad < 0) {
          throw new Error(
            `Las existencias para el repuesto con ID ${actualizacion.id} no pueden ser menores a 0`
          );
        }

        // Realiza la actualización de unidades en reserva
        transaction.update(repuestoRef, {
          unidadesEnReserva: unidadesEnReserva ?? 0 + actualizacion.cantidad,
        });
      }

      const pedidoItems: ItemVenta[] = shopList.map((item) => ({
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
      pedidoData.items = pedidoItems;
      pedidoData.fecha = timestamp;
      pedidoData.estado = VentaEstados.pendiente;
      pedidoData.vendedor = usuario;
      // Usar la referencia creada anteriormente
      transaction.set(nuevoPedido, pedidoData);
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
