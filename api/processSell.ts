import {
  Historial,
  ItemVenta,
  RepuestoCart,
  Usuario,
  New,
  Repuesto,
  Venta,
  VentaEstados,
  TrasladosType,
} from "@/types";
import {
  AccionHistorial,
  Collections,
  EstadoTraslado,
  TipoHistorial,
  Ubicacion,
} from "@/utils/constants";
import { Traslados } from "../types";
import { SIN_VENTA } from "../utils/constants";

import {
  collection,
  doc,
  DocumentSnapshot,
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
      // Paso 1: Lectura de todos los repuestos
      const repuestoSnapshots: {
        id: string;
        snapshot: DocumentSnapshot;
        unidades: number;
      }[] = [];

      // Leer todos los repuestos
      for (const item of ventaData.items) {
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

      // Validar existencias antes de hacer cualquier actualización
      for (const { snapshot, unidades, id } of repuestoSnapshots) {
        const { existencias = 0 } = snapshot.data() as Repuesto;
        const nuevaCantidad = existencias - unidades;

        if (nuevaCantidad < 0) {
          throw new Error(
            `Las existencias para el repuesto con ID ${id} no pueden ser menores a 0`
          );
        }
      }

      // Paso 2: Preparar referencias para documentos nuevos
      const ventasCollectionRef = collection(db, Collections.ventas);
      const newVentaRef = doc(ventasCollectionRef, ventaData.id);
      const ventaId = newVentaRef.id;

      // Paso 3: Realizar todas las actualizaciones de repuestos
      for (const { snapshot, unidades, id } of repuestoSnapshots) {
        const repuestoRef = doc(db, Collections.repuestos, id);
        const { existencias = 0, unidadesEnReserva = 0 } =
          snapshot.data() as Repuesto;

        transaction.update(repuestoRef, {
          existencias: existencias - unidades,
          fechaDeModificacion: timestamp,
          unidadesEnReserva:
            unidadesEnReserva >= unidades ? unidadesEnReserva - unidades : 0,
        });
      }

      // Paso 4: Crear documento de venta
      ventaData.fecha = timestamp;
      ventaData.cajero = usuario.id;
      ventaData.estado = VentaEstados.pendiente;
      transaction.set(newVentaRef, ventaData);

      // Paso 5: Crear documentos de historial de producto
      ventaData.items.forEach((item) => {
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
        return historialRef;
      });

      // Paso 6: Crear historial de venta
      const historialVentaRef = doc(collection(db, Collections.historial));
      const historialVentaDoc: New<Historial> = {
        tipo: TipoHistorial.historialVentas,
        accion: AccionHistorial.venta,
        fecha: timestamp,
        ventaId: ventaId,
        vendedor: ventaData.vendedor.id,
        cajero: usuario.id,
      };
      transaction.set(historialVentaRef, historialVentaDoc);

      // Paso 7: Actualizar estado del pedido
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
      // Primero, realizar todas las lecturas
      const repuestoSnapshots: {
        id: string;
        snapshot: DocumentSnapshot;
        unidadesAReservar: number;
      }[] = [];

      // Paso 1: Lectura de todos los repuestos
      for (const item of shopList) {
        const repuestoRef = doc(db, Collections.repuestos, item.id);
        const repuestoSnapshot = await transaction.get(repuestoRef);

        if (!repuestoSnapshot.exists()) {
          throw new Error(`Repuesto con ID ${item.id} no existe`);
        }

        repuestoSnapshots.push({
          id: item.id,
          snapshot: repuestoSnapshot,
          unidadesAReservar: item.cantidad,
        });
      }

      // Validar existencias antes de hacer cualquier actualización
      for (const { snapshot, unidadesAReservar, id } of repuestoSnapshots) {
        const { existencias, unidadesEnReserva = 0 } =
          snapshot.data() as Repuesto;
        const nuevaCantidad =
          existencias - unidadesAReservar - unidadesEnReserva;

        if (nuevaCantidad < 0) {
          throw new Error(
            `Las existencias para el repuesto con ID ${id} no son suficientes para reservar`
          );
        }
      }

      // Preparar referencias para documentos nuevos
      const pedidosCollectionRef = collection(db, Collections.pedidos);
      const nuevoPedido = doc(pedidosCollectionRef);
      const pedidoId = nuevoPedido.id;

      const trasladoRef = collection(db, Collections.traslado);
      const nuevoTraslado = doc(trasladoRef);

      // Realizar todas las actualizaciones
      for (const { snapshot, unidadesAReservar, id } of repuestoSnapshots) {
        const repuestoRef = doc(db, Collections.repuestos, id);
        const { unidadesEnReserva = 0 } = snapshot.data() as Repuesto;

        transaction.update(repuestoRef, {
          unidadesEnReserva: unidadesEnReserva + unidadesAReservar,
        });
      }

      // Crear pedido
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

      transaction.set(nuevoPedido, pedidoData);

      // Paso 5: Crear traslado
      const trasladoData: New<Traslados> = {
        usuarioSolicitud: usuario.id,
        ubicacion: Ubicacion.bodega,
        destino: Ubicacion.despacho,
        estado: EstadoTraslado.pendiente,
        ventaId: pedidoId,
        fechaInicio: timestamp,
        tipo: TrasladosType.venta,
      };

      transaction.set(nuevoTraslado, trasladoData);
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

export const finalizarVenta = async (
  db: Firestore,
  venta: Venta,
  usuario: Usuario
): Promise<boolean | string> => {
  try {
    const timestamp = serverTimestamp();

    const sinVenta = await runTransaction(db, async (transaction) => {
      // actualizar documento de venta a despachado y usuario despacho
      const ventasCollectionRef = collection(db, Collections.ventas);
      const ventaRef = doc(ventasCollectionRef, venta.id);
      const _venta = await transaction.get(ventaRef);
      console.log("_venta: ", _venta.data(), _venta.exists());

      if (!_venta.exists()) {
        return SIN_VENTA;
      }
      const updateVenta: Partial<Venta> = {
        estado: VentaEstados.despachado,
        despacho: usuario.id,
        fechaDespacho: timestamp,
      };
      console.log("updateVenta: ", updateVenta);
      transaction.update(ventaRef, updateVenta);
      // eliminar pedido
      const pedidosCollectionRef = collection(db, Collections.pedidos);
      const pedidoExistente = doc(pedidosCollectionRef, venta.id);
      transaction.delete(pedidoExistente);
    });
    // la transaccion solo retorna valor cuando no existe la venta, de lo contrario se considera que fue exitosa y se retorna true
    return sinVenta ?? true;
  } catch (error) {
    console.error("Error al actualizar cantidades en transacción:", error);
    return false;
  }
};
