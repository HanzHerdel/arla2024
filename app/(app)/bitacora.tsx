import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { Timestamp } from "firebase/firestore";
import { getCollectionData } from "@/api/getGenericCollections";
import { db } from "@/configs/firebaseConfig";
import { Collections } from "@/utils/constants";
import { getRepuestos } from "../../api/getRepuestosVentas";

export interface Historial {
  tipo: string;
  accion: string;
  usuario: string;
  fecha: Timestamp;
  idRepuesto?: string;
  ventaId?: string;
  unidades?: number;
  razon?: string; // Asumí que es un string para este ejemplo
  notas?: string;
  changes?: Record<string, string>;
}

const HistorialScreen: React.FC = () => {
  const [historialData, setHistorialData] = useState<Historial[]>([]);
  useEffect(() => {
    getCollectionData(db, Collections.historial, setHistorialData, "fecha");
  }, []);

  return (
    <ScrollView>
      Muestra los movimientos de Repuestos Filtros Tipo historial Filtro Fechas
      construccion...
      <View style={styles.container}>
        {historialData.map((item, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.text}>
                <Text style={styles.bold}>Tipo:</Text> {item.tipo}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.bold}>Acción:</Text> {item.accion}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.bold}>Usuario:</Text> {item.usuario}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.bold}>Fecha:</Text>{" "}
                {item.fecha.toDate().toLocaleDateString()}
              </Text>
              {item.idRepuesto && (
                <Text style={styles.text}>
                  <Text style={styles.bold}>ID Repuesto:</Text>{" "}
                  {item.idRepuesto}
                </Text>
              )}
              {item.ventaId && (
                <Text style={styles.text}>
                  <Text style={styles.bold}>Venta ID:</Text> {item.ventaId}
                </Text>
              )}
              {item.unidades !== undefined && (
                <Text style={styles.text}>
                  <Text style={styles.bold}>Unidades:</Text> {item.unidades}
                </Text>
              )}
              {item.razon && (
                <Text style={styles.text}>
                  <Text style={styles.bold}>Razón:</Text> {item.razon}
                </Text>
              )}
              {item.notas && (
                <Text style={styles.text}>
                  <Text style={styles.bold}>Notas:</Text> {item.notas}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
  card: {
    width: "48%",
    marginVertical: 4,
  },
  cardContent: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    flexBasis: "50%",
    fontSize: 12,
    marginVertical: 2,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default HistorialScreen;
