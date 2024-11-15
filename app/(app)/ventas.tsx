// VentasScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ListRenderItem,
  Modal,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { FieldValue, serverTimestamp, Timestamp } from "firebase/firestore";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { db } from "@/configs/firebaseConfig";
import ResponsiveTable from "@/components/Table/Table";
import { Cliente, RepuestoCart, Repuesto } from "@/types";
import RepuestoDetail from "@/components/Details/Details";
import { columnsCart, columnsVentas } from "@/components/Table/utils/columns";
import ButtonGroupAgregar from "@/components/Buttons/ButtonGroupAgregar";
import useDebounce from "@/hooks/useDebounce";

import SearchBar from "@/components/SearchBar/SearchBar";
import ButtonGroupVender from "@/components/Buttons/ButtonGroupVender";
import ExpandableFooter from "@/components/Footer/Footer";
import ClientsFinder from "@/components/ClientsFinder/ClientsFinder";
import { proccessSell } from "@/api/processSell";
import LongBar from "@/components/LongBar/LongBar";
import ClientForm from "@/components/ClientForm/ClientForm";
import ClosableModal from "@/components/ClosableModal/ClosableModal";
import { useSession } from "@/providers/Session";
import useRepuestos from "@/hooks/useRepuestosFiltros";
import TrasladoModal from "@/components/ModalTraslado/ModalTraslado";
import { Ubicacion } from "@/utils/constants";

type RootStackParamList = {
  Ventas: { ventas?: boolean };
  // Add other screens as needed
};

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
  const nameQuery = useDebounce(nombre);
  const { user } = useSession();
  const [modelo, setModelo] = useState<string>("");
  const [linea, setLineaFilter] = useState<string>("");
  const [marca, setMarcaFilter] = useState<string>("");
  // const [modelo, setModeloFilter] = useState<number>(0);

  const [shopList, setShopList] = useState<RepuestoCart[]>([]);
  const [clientData, setClientData] = useState<Cliente | null>(null);
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
  const addToCartHandler = (
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
  };

  const addItemToCart = (item: RepuestoCart): void => {
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
  };
  const handleDecrement = (item: RepuestoCart) => {
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
  };

  /** Sales Functions */

  const processSale = async (isCredit: boolean = false): Promise<void> => {
    console.log("clientData: ", clientData);
    if (!clientData) {
      console.log("Error", "Debe agregar datos del cliente");
      return;
    }

    console.log("clientData: ", clientData);

    if (shopList.length < 1) {
      console.log("Error", "Nada que vender");
      return;
    }
    try {
      const ventaData = {
        aCredito: isCredit,
        total: total,
        nit: clientData?.nit,
        cliente: clientData,
        vendedor: user,
      };

      const result = await proccessSell(db, shopList, ventaData, user!);
      if (result) {
        console.log("Éxito", isCredit ? "Crédito Agregado" : "Venta Realizada");
        setClientData(null);
        setShopList([]);
        return;
      }
      console.log(
        "Error",
        isCredit ? "Crédito No Agregado" : "Venta No Realizada"
      );
    } catch (error) {
      console.error("Error processing sale:", error);
      console.log("Error", "Error al procesar la venta");
    }
  };

  const handleSelectItem = (item: Repuesto | null) => {
    setrepuestoSeleccionado(item);
  };

  /** Footer Functions */
  const handleTouchFooter = () => {
    console.log("qui");
    setShowFooter((p) => !p);
  };

  const handleClientSelect = (cliente: Cliente): void => {
    setClientData(cliente);
    setShowFooter(false);
  };
  console.log("clientData: ", clientData);

  console.log("repuestoSeleccionado: ", repuestoSeleccionado);
  return (
    <View style={{ flex: 1 }}>
      {repuestoSeleccionado && (
        <TrasladoModal
          visible={modalTraslado}
          onDismiss={() => setModalTrasladoVisible(false)}
          repuesto={repuestoSeleccionado}
          ubicacionOrigen={Ubicacion.ventas}
          closeModal={() => setModalTrasladoVisible(false)}
        />
      )}
      <View style={styles.container}>
        {/* Barra de busqueda y tabla de resultados */}
        <SearchBar
          searchText={nombre}
          setSearchText={setNombreFilter}
          compatibility={modelo}
          setCompatibility={setModelo}
          brand={marca}
          setBrand={setMarcaFilter}
          line={linea}
          setLine={setLineaFilter}
        />
        <ResponsiveTable
          items={searchResults}
          columns={columnsVentas}
          onIncrement={addToCartHandler}
          onDecrement={handleDecrement}
          handleSelect={handleSelectItem}
        />
        {/* Detalle Repuesto Seleccionado y bottones de agregar */}
        {repuestoSeleccionado && (
          <View>
            <RepuestoDetail
              repuesto={repuestoSeleccionado}
              onClose={() => setrepuestoSeleccionado(null)}
              setModalVisible={setModalTrasladoVisible}
            />
            <ButtonGroupAgregar
              onAddPress={addToCartHandler}
              onDiscountPress={() => addToCartHandler(null, ADD.descuento)}
              onSpecialDiscountPress={
                () => console.log("en contruccion...")
                // addToCartHandler(null, ADD.especial)
              }
            />
          </View>
        )}
        {/* Tabla de carrito y bottones de vender */}
        {Boolean(shopList.length) && (
          <View>
            <ResponsiveTable
              items={shopList}
              columns={columnsCart}
              onIncrement={addToCartHandler}
              onDecrement={handleDecrement}
              handleSelect={handleSelectItem}
            />
            <LongBar label={"Total:"} text={`Total: Q${total.toFixed(2)}`} />
            <ButtonGroupVender
              onSellPress={() => processSale(false)}
              onCreditPress={() => processSale(true)}
              onQuotePress={() => {}}
            />
          </View>
        )}
      </View>
      <ClosableModal
        onClose={() => setClientModal(false)}
        visible={clientModal}
        contentContainerStyle={{ width: "100%", maxWidth: 1200 }}
      >
        <ClientForm
          onSubmit={(cliente) => {
            setClientModal(false);
            setClientData(cliente);
            /** hacky fix to avoid title to break, not sure the reason behind it */
            /** it maybe get fixed if we use animations, who knows */
            setTimeout(() => {
              setShowFooter(false);
            }, 500);
          }}
        />
      </ClosableModal>
      <ExpandableFooter
        isExpanded={showFooter}
        handleTouchFooter={handleTouchFooter}
        title={
          clientData
            ? `${clientData.nombre} ${clientData.apellido} - ${clientData.nit}`
            : "Seleccionar Cliente"
        }
      >
        <ClientsFinder
          onSelect={handleClientSelect}
          onNewClient={() => {
            setClientModal(true);
          }}
        />
      </ExpandableFooter>
    </View>
  );
};

//////////////////////////////////////////////
// Styles
//////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 40,
  },
  searchSection: {
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  resultsList: {
    flex: 1,
  },
  searchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  cartSection: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  dropdown: {
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});

export default VentasScreen;
