import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Chip,
  List,
  Surface,
  Text,
  useTheme,
  Button,
} from "react-native-paper";
import { Timestamp, FieldValue } from "firebase/firestore";
import { EstadoTraslado } from "@/utils/constants";
import { Traslados } from "@/types";
import { useTraslados } from "@/store/trasladosSlice";
import { globalStyles } from "@/utils/styles";
import { useElementos } from "@/store/elementosSlice";
import { useSession } from "@/providers/Session";
import { updateTrasladoStatus } from "@/api/traslados";
import { db } from "@/configs/firebaseConfig";

const formatearFecha = (fecha: FieldValue | Timestamp) => {
  if (fecha instanceof Timestamp) {
    return fecha.toDate().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return "Fecha no disponible";
};

const getEstadoColor = (estado: EstadoTraslado) => {
  switch (estado) {
    case EstadoTraslado.pendiente:
      return "#FFA726"; // Naranja
    case EstadoTraslado.enProgreso:
      return "#42A5F5"; // Azul
    case EstadoTraslado.entregado:
      return "#66BB6A"; // Verde
    default:
      return "#757575"; // Gris
  }
};

const TrasladoCard = ({ traslado }: { traslado: Traslados }) => {
  const theme = useTheme();
  const { user } = useSession();
  console.log("user: ", user);
  const { usuarios } = useElementos();
  const pendiente = traslado.estado === EstadoTraslado.pendiente;
  const btnProgresoEnabled =
    pendiente && user?.ubicacion === traslado.ubicacion;
  console.log("btnProgresoEnabled: ", btnProgresoEnabled);
  const enProgreso = traslado.estado === EstadoTraslado.enProgreso;
  console.log("enProgreso: ", enProgreso);
  const btnRecibirEnabled = enProgreso && user?.ubicacion === traslado.destino;
  console.log("btnRecibirEnabled: ", btnRecibirEnabled);
  const getUsuarioNombre = (usuarioId: string) => {
    const usuario = usuarios.find((usr) => usr.id === usuarioId);
    return usuario?.nombre;
  };
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Title style={styles.title}>Traslado</Title>
          <Chip
            mode="flat"
            selectedColor="#FFFFFF"
            style={[
              styles.estadoChip,
              { backgroundColor: getEstadoColor(traslado.estado) },
            ]}
          >
            {traslado.estado}
          </Chip>
        </View>

        <Surface style={styles.infoContainer}>
          <List.Section>
            <List.Item
              title="Solicitado por"
              description={getUsuarioNombre(traslado.usuarioSolicitud)}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
            {traslado.usuarioEnProgreso && (
              <List.Item
                title="En progreso por"
                description={getUsuarioNombre(traslado.usuarioEnProgreso)}
                left={(props) => <List.Icon {...props} icon="account-clock" />}
              />
            )}
          </List.Section>

          <View style={[styles.ubicacionesContainer, globalStyles.flexBoxRow]}>
            <View style={styles.ubicacionItem}>
              <Text style={styles.ubicacionLabel}>Origen</Text>
              <Text style={styles.direccionText}>{traslado.ubicacion}</Text>
            </View>

            <View style={styles.ubicacionItem}>
              <Text style={styles.ubicacionLabel}>Destino</Text>
              <Text style={styles.direccionText}>{traslado.destino}</Text>
            </View>

            <View style={{ alignItems: "flex-end", flex: 1 }}>
              {traslado.estado === EstadoTraslado.pendiente && (
                <Button
                  mode={"contained-tonal"}
                  buttonColor="#66BB6A"
                  style={{ maxWidth: 200 }}
                  disabled={!btnProgresoEnabled}
                  onPress={() =>
                    updateTrasladoStatus(
                      db,
                      traslado,
                      EstadoTraslado.enProgreso,
                      user!.id
                    )
                  }
                >
                  Poner En Progreso
                </Button>
              )}
              {enProgreso && (
                <Button
                  mode={"contained-tonal"}
                  buttonColor="#66BB6A"
                  style={{ maxWidth: 200 }}
                  disabled={!btnRecibirEnabled}
                  onPress={() =>
                    updateTrasladoStatus(
                      db,
                      traslado,
                      EstadoTraslado.entregado,
                      user!.id
                    )
                  }
                >
                  Recibir
                </Button>
              )}
            </View>
          </View>

          {/*           <View style={styles.detallesContainer}>
            <Paragraph style={styles.unidades}>
              Unidades: {traslado.unidades}
            </Paragraph>

            <View style={styles.fechasContainer}>
              <Text style={styles.fechaLabel}>Inicio:</Text>
              <Text style={styles.fechaText}>
                {formatearFecha(traslado.fechaInicio)}
              </Text>

              {traslado.fechaEnProgreso && (
                <>
                  <Text style={styles.fechaLabel}>En Progreso:</Text>
                  <Text style={styles.fechaText}>
                    {formatearFecha(traslado.fechaEnProgreso)}
                  </Text>
                </>
              )}

              {traslado.fechaEntregado && (
                <>
                  <Text style={styles.fechaLabel}>Entregado:</Text>
                  <Text style={styles.fechaText}>
                    {formatearFecha(traslado.fechaEntregado)}
                  </Text>
                </>
              )}
            </View>
          </View> */}
        </Surface>
      </Card.Content>
    </Card>
  );
};

const TrasladosListView = ({}: {}) => {
  const traslados = useTraslados();
  return (
    <ScrollView style={styles.container}>
      {traslados.map((traslado, index) => (
        <TrasladoCard key={index} traslado={traslado} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    margin: 8,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  estadoChip: {
    borderRadius: 16,
  },
  infoContainer: {
    padding: 8,
    borderRadius: 8,
  },
  ubicacionesContainer: {
    marginTop: 8,
    padding: 8,
  },
  ubicacionItem: {
    marginBottom: 12,
    marginHorizontal: 8,
  },
  ubicacionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    // color: "#666",
    marginBottom: 4,
  },
  ubicacionText: {
    fontSize: 16,
    // color: "#000",
    marginBottom: 2,
  },
  direccionText: {
    fontSize: 14,
    // color: "#666",
  },
  detallesContainer: {
    marginTop: 8,
    padding: 8,
  },
  unidades: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  fechasContainer: {
    marginTop: 8,
  },
  fechaLabel: {
    fontSize: 14,
    fontWeight: "bold",
    // color: "#666",
    marginBottom: 2,
  },
  fechaText: {
    fontSize: 14,
    // color: "#000",
    marginBottom: 8,
  },
});

export default TrasladosListView;
