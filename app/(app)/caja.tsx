import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { db } from "@/configs/firebaseConfig";
import { MetodosDePagoType, Venta } from "@/types";

import { processSell } from "@/api/processSell";
import { useSession } from "@/providers/Session";
import { useSnackbar } from "@/providers/Snackbar";
import {
  FiltrosPedidos,
  usePedidosSubscribe,
} from "@/hooks/useGenericSubscribe";
import { Card, Text } from "react-native-paper";
import { getDateString } from "@/utils/dates";
import { Timestamp } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import VentaData from "@/components/VentaData/VentaData";
import ModalMethodoPago from "@/components/Ventas/ModalMethodoPago";
import { MethodoDePago } from "../../types";
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

const CajaScreen: React.FC = ({}) => {
  const { showSnackbar, showError } = useSnackbar();
  const { user } = useSession();
  const { data: pedidos } = usePedidosSubscribe<Venta>(
    db,
    FiltrosPedidos.noCobrado
  );
  const [modalMetodoPago, setModalMetodoPago] = useState(false);
  const [ventaSelected, setVentaSelected] = useState<Venta | null>(null);
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

  const handleShowModalPagos = (venta: Venta, credito = false) => {
    setVentaSelected(venta);
    setModalMetodoPago(true);
  };

  const handleHideModalPagos = () => {
    setVentaSelected(null);
    setModalMetodoPago(false);
  };
  const handleConfirmPagos = (venta: Venta, metodosPago: MethodoDePago) => {
    const newVenta = { ...venta, metodosPago };
    handleHideModalPagos();
    processSale(newVenta);
  };
  return (
    <View style={{ flex: 1 }}>
      {ventaSelected && (
        <ModalMethodoPago
          venta={ventaSelected}
          visible={modalMetodoPago}
          onDismiss={handleHideModalPagos}
          onConfirm={handleConfirmPagos}
        />
      )}
      <ScrollView>
        {pedidos.map((venta, index) => (
          <Card key={index} style={{ margin: 10 }}>
            <Card.Content>
              {/* Cliente */}
              <Text variant="titleLarge" style={{ marginBottom: 10 }}>
                {venta.cliente.nombre}
              </Text>
              {/* Items */}
              <VentaData venta={venta} />
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
                onPress={() => handleShowModalPagos(venta)}
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

export default CajaScreen;
