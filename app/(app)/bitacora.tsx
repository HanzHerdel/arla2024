import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { Timestamp } from "firebase/firestore";
import { getCollectionData } from "@/api/getGenericCollections";
import { db } from "@/configs/firebaseConfig";
import { AccionHistorial, Collections, TipoHistorial } from "@/utils/constants";
import { getRepuestos } from "../../api/getRepuestosVentas";
import { useElemento } from "@/store/elementosSlice";

export interface Historial {
  tipo: number;
  accion: number;
  usuario: string;
  fecha: Timestamp;
  idRepuesto?: string;
  ventaId?: string;
  unidades?: number;
  razon?: string;
  notas?: string;
  changes?: Record<string, string>;
}

const HistorialScreen: React.FC = () => {
  const usuarios = useElemento("usuarios");
  const [historialData, setHistorialData] = useState<Historial[]>([]);

  useEffect(() => {
    getCollectionData(db, Collections.historial, setHistorialData, "fecha");
  }, []);

  // Función para obtener el nombre del tipo de historial
  const getTipoHistorialNombre = (tipo: number): string => {
    return (
      Object.keys(TipoHistorial).find(
        (key) => TipoHistorial[key as keyof typeof TipoHistorial] === tipo
      ) || "Desconocido"
    );
  };

  // Función para obtener el nombre de la acción
  const getAccionHistorialNombre = (accion: number): string => {
    return (
      Object.keys(AccionHistorial).find(
        (key) => AccionHistorial[key as keyof typeof AccionHistorial] === accion
      ) || "Desconocido"
    );
  };

  // Función para obtener el nombre del usuario
  const getNombreUsuario = (userId: string): string => {
    const usuario = usuarios.find((u: any) => u.id === userId);
    return usuario ? usuario.nombre : userId;
  };

  return (
    <ScrollView>
      <Text>
        Muestra los movimientos de Repuestos Filtros Tipo historial Filtro
        Fechas construccion...
      </Text>
      <View style={styles.container}>
        {historialData.map((item, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.text}>
                <Text style={styles.bold}>Tipo:</Text>{" "}
                {getTipoHistorialNombre(item.tipo)}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.bold}>Acción:</Text>{" "}
                {getAccionHistorialNombre(item.accion)}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.bold}>Usuario:</Text>{" "}
                {getNombreUsuario(item.usuario)}
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
