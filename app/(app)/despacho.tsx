import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { db } from "@/configs/firebaseConfig";
import { TiposVentaUsuario, Traslados, Venta } from "@/types";
import { finalizarVenta } from "@/api/processSell";
import { useSession } from "@/providers/Session";
import { useSnackbar } from "@/providers/Snackbar";
import { usePedidosSubscribe } from "@/hooks/useGenericSubscribe";
import { Card, Surface, Text } from "react-native-paper";
import { getDateString } from "@/utils/dates";
import { Timestamp } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import VentaData from "@/components/VentaData/VentaData";
import { useTraslados } from "@/store/trasladosSlice";
import TrasladoCard from "@/components/Traslado/TrasladoCard";
import { SIN_VENTA } from "@/utils/constants";
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
type VentaTraslado = Venta & { traslado: Traslados | undefined };

const DespachoScreen: React.FC = ({}) => {
  const { showSnackbar, showError } = useSnackbar();
  const { user } = useSession();
  const { data: pedidos } = usePedidosSubscribe<Venta>(db);
  const traslados = useTraslados();
  const [pedidosConTraslado, setPedidosConTraslado] = useState<VentaTraslado[]>(
    []
  );
  useEffect(() => {
    const pedidoConTraslado = pedidos.map((pedido) => {
      const trasladoDeVenta = traslados.find((t) => t.venta?.id === pedido.id);
      const pedidoHidrated = {
        ...pedido,
        traslado: trasladoDeVenta,
      };
      return pedidoHidrated;
    });
    console.log("pedidoConTraslado: ", pedidoConTraslado);
    setPedidosConTraslado(pedidoConTraslado);
    return () => {};
  }, [pedidos, traslados]);

  /** Sales Functions */
  const endSale = async (venta: VentaTraslado): Promise<void> => {
    if (venta.traslado) {
      showError("Error: Debe confirmar antes el traslado");
      return;
    }
    try {
      const result = await finalizarVenta(db, venta.id, user!);

      if (result) {
        if (result === SIN_VENTA) {
          showError("Venta aun no generada");
          return;
        }
        console.log("Éxito Venta Despachada");
        showSnackbar("Éxito: Venta Despachada");
        return;
      }
      console.log("Error: Venta No Despachada");
    } catch (error) {
      showError("Error al procesar");
      console.error("Error processing sale:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {pedidosConTraslado.map((venta, index) => (
          <Surface
            id={venta.id}
            style={{
              padding: 8,
              margin: 16,
              elevation: 4,
              flex: 1,
              borderRadius: 8,
              backgroundColor: "#aab8c2",
            }}
          >
            {venta.traslado && (
              <TrasladoCard traslado={venta.traslado} hideVentaData={true} />
            )}
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
                    Atendió: {venta[TiposVentaUsuario.vendedor].nombre} | Fecha:{" "}
                    {getDateString(venta.fecha as Timestamp)}
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => endSale(venta)}
                >
                  <Icon name="attach-money" size={16} color="white" />
                  <Text>Finalizar Venta</Text>
                </TouchableOpacity>
              </Card.Actions>
            </Card>
          </Surface>
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

export default DespachoScreen;
