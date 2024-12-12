import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { db } from "@/configs/firebaseConfig";
import ResponsiveTable from "@/components/Table/Table";
import { Cliente, RepuestoCart, Repuesto, Venta } from "@/types";
import RepuestoDetail from "@/components/Details/Details";
import { columnsCart, columnsVentas } from "@/components/Table/utils/columns";
import ButtonGroupAgregar from "@/components/Buttons/ButtonGroupAgregar";
import useDebounce from "@/hooks/useDebounce";

import SearchBar from "@/components/SearchBar/SearchBar";
import ButtonGroupVender from "@/components/Buttons/ButtonGroupVender";
import ExpandableFooter from "@/components/Footer/Footer";
import ClientsFinder from "@/components/ClientsFinder/ClientsFinder";
import { processSell } from "@/api/processSell";
import LongBar from "@/components/LongBar/LongBar";
import ClientForm from "@/components/ClientForm/ClientForm";
import ClosableModal from "@/components/ClosableModal/ClosableModal";
import { useSession } from "@/providers/Session";
import useRepuestos from "@/hooks/useRepuestosFiltros";
import TrasladoModal from "@/components/ModalTraslado/ModalTraslado";
import { Collections, Ubicacion } from "@/utils/constants";
import { SnackbarType, useSnackbar } from "@/providers/Snackbar";
import { useGenericSubscribe } from "@/hooks/useGenericSubscribe";
import { Card, DataTable, List, Text } from "react-native-paper";
import { getDateString } from "@/utils/dates";
import { Timestamp } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
//////////////////////////////////////////////
// Constants
//////////////////////////////////////////////

export const ADD = {
  descuento: "descuento",
  especial: "especial",
};

//////////////////////////////////////////////
// Main Component
//////////////////////////////////////////////

const VentasScreen: React.FC = ({}) => {
  // States
  const [nombre, setNombreFilter] = useState<string>("");
  const { showSnackbar, showError } = useSnackbar();
  const nameQuery = useDebounce(nombre);
  const { user } = useSession();
  const [modelo, setModelo] = useState<string>("");
  const [linea, setLineaFilter] = useState<string>("");
  const [marca, setMarcaFilter] = useState<string>("");
  // const [modelo, setModeloFilter] = useState<number>(0);
  const { data: pedidos } = useGenericSubscribe<Venta>(db, Collections.pedidos);
  console.log("data: ", pedidos);
  //const [itemsVenta, setItemsVenta] = useState<RepuestoCart[]>([]);
  //const [clientData, setClientData] = useState<Cliente | null>(null);
  const [repuestoSeleccionado, setrepuestoSeleccionado] =
    useState<Repuesto | null>(null);

  const [showFooter, setShowFooter] = useState<boolean>(false);

  const [clientModal, setClientModal] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const { repuestos: searchResults } = useRepuestos({
    marca,
    linea,
    nombre: nameQuery.toUpperCase(),
    modelo,
  });

  const [modalTraslado, setModalTrasladoVisible] = useState<boolean>(false);
  /** Shopping Cart Functions */
  /*   const addToCartHandler = (
    _repuesto?: Repuesto | null,
    descuento?: string
  ): void => {
    const repuesto = _repuesto || repuestoSeleccionado;

    if (!repuesto) {
      console.log("Error", "Debe seleccionar un artículo para agregar");
      return;
    }

    if (repuesto.existencias < 1) {
      console.log("Error", "No hay más existencias de este repuesto");
      return;
    }

    const itemToAdd = repuesto as RepuestoCart;
    console.log("descuento: ", descuento);
    switch (descuento) {
      case ADD.descuento:
        // TODO:
        itemToAdd.costo = itemToAdd.precioDescuento || itemToAdd.precio;
        break;
      case ADD.especial:
        // TODO: requestSpecialPassword(itemToAdd);
        break;
      default:
        itemToAdd.costo = itemToAdd.precio;
    }
    console.log("itemToAdd: ", itemToAdd);
    addItemToCart(itemToAdd);
  }; */

  /*   const addItemToCart = (item: RepuestoCart): void => {
    setShopList((prevList) => {
      const existingIndex = prevList.findIndex((i) => i.id === item.id);
      console.log("existingIndex: ", existingIndex);
      let newList;
      // si hay seleccion
      if (existingIndex > -1) {
        // si se esta agregando mas de lo que existe
        if (
          prevList[existingIndex].cantidad >=
          prevList[existingIndex].existencias
        ) {
          console.log(
            "Error",
            "Repuestos insuficientes para agregar al carrito"
          );
          return prevList;
        }

        newList = [...prevList];
        newList[existingIndex].cantidad += 1;
        console.log("newList: ", newList);
      } else {
        newList = [...prevList, { ...item, cantidad: 1 }];
        console.log("newList: ", newList);
      }
      const _total = newList.reduce((result, item) => {
        item.costo;
        result += item.cantidad * item.costo;
        return result;
      }, 0);
      setTotal(_total);
      return newList;
    });
  }; */
  /*   const handleDecrement = (item: RepuestoCart) => {
    const index = shopList.indexOf(item);
    // TODO: fix no borra desde la tabla de ventas
    if (index < 0) {
      console.log("Error", "Debe seleccionar un artículo para agregar");
      return;
    }
    setShopList((prevList) => {
      const newList = [...prevList];
      if (newList[index].cantidad > 1) {
        newList[index].cantidad -= 1;
        return newList;
      } else {
        newList.splice(index, 1);
        return newList;
      }
    });
  }; */

  /** Sales Functions */

  const processSale = async (
    venta: Venta,
    isCredit: boolean = false
  ): Promise<void> => {
    console.log("isCredit: ", isCredit);
    const itemsVenta = venta.items;
    const clientData = venta.cliente;
    console.log("clientData: ", clientData);
    if (!clientData) {
      showError("Debe agregar datos del cliente");
      console.log("Error", "Debe agregar datos del cliente");
      return;
    }

    if (itemsVenta.length < 1) {
      console.log("Error", "Nada que vender");
      return;
    }
    try {
      const result = await processSell(db, venta, user!);
      console.log("isCredit: ", isCredit);
      if (result) {
        console.log("Éxito", isCredit ? "Crédito Agregado" : "Venta Realizada");
        showSnackbar(
          `"Éxito: "${isCredit ? "Crédito Agregado" : "Venta Realizada"}`
        );
        return;
      }
      console.log(
        "Error",
        isCredit ? "Crédito No Agregado" : "Venta No Realizada"
      );
    } catch (error) {
      showError("Error al procesar");
      console.error("Error processing sale:", error);
      console.log("Error", "Error al procesar la venta");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {pedidos.map((venta, index) => (
          <Card key={index} style={{ margin: 10 }}>
            <Card.Content>
              {/* Cliente */}
              <Text variant="titleLarge" style={{ marginBottom: 10 }}>
                {venta.cliente.nombre}
              </Text>
              {/* Items */}
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={{ flex: 3 }}>Nombre</DataTable.Title>
                  <DataTable.Title style={{ flex: 1 }}>Marca</DataTable.Title>
                  <DataTable.Title style={{ flex: 1 }}>Línea</DataTable.Title>
                  <DataTable.Title style={{ flex: 1 }}>Modelo</DataTable.Title>
                  <DataTable.Title numeric style={{ flex: 0.5 }}>
                    Unidades
                  </DataTable.Title>
                  <DataTable.Title numeric style={{ flex: 0.5 }}>
                    Precio
                  </DataTable.Title>
                  <DataTable.Title numeric style={{ flex: 1 }}>
                    Total
                  </DataTable.Title>
                </DataTable.Header>

                {venta.items.map((item, itemIndex) => (
                  <DataTable.Row key={itemIndex}>
                    <DataTable.Cell style={{ flex: 3 }}>
                      {item.nombre}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1 }}>
                      {item.marca}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1 }}>
                      {item.linea}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1 }}>
                      {item.modelo}
                    </DataTable.Cell>
                    <DataTable.Cell numeric style={{ flex: 0.5 }}>
                      {item.unidades}
                    </DataTable.Cell>
                    <DataTable.Cell numeric style={{ flex: 0.5 }}>
                      ${item.precio}
                    </DataTable.Cell>
                    <DataTable.Cell numeric style={{ flex: 1 }}>
                      ${(item.unidades * item.precio).toFixed(2)}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}

                {/* Fila de Total Global */}
                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <Text variant="titleMedium">
                      Total: ${venta.total.toFixed(2)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>

              {/* Fecha y Vendedor en la misma línea */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text variant="bodyMedium">
                  Atendió: {venta.vendedor.nombre} | Fecha:{" "}
                  {getDateString(venta.fecha as Timestamp)}
                </Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#007AFF" }]}
                onPress={() => {}}
              >
                <Icon name="credit-card" size={16} color="white" />
                <Text>Realizar Credito</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => processSale(venta)}
              >
                <Icon name="attach-money" size={16} color="white" />
                <Text>Realizar Venta</Text>
              </TouchableOpacity>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

//////////////////////////////////////////////
// Styles
//////////////////////////////////////////////

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745", // Verde
    padding: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 5,
  },
});

export default VentasScreen;
