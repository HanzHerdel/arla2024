import { updateTrasladoStatus } from "@/api/traslados";
import { db } from "@/configs/firebaseConfig";
import { useSession } from "@/providers/Session";
import { useElementos } from "@/store/elementosSlice";
import { Traslados } from "@/types";
import { EstadoTraslado } from "@/utils/constants";
import { globalStyles } from "@/utils/styles";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  List,
  Surface,
  Text,
  Title,
  useTheme,
} from "react-native-paper";
import VentaData from "../VentaData/VentaData";

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

const TrasladoCard = ({
  traslado,
  hideVentaData = false,
}: {
  traslado: Traslados;
  hideVentaData?: boolean;
}) => {
  const { user } = useSession();
  const { usuarios } = useElementos();
  const pendiente = traslado.estado === EstadoTraslado.pendiente;
  const btnProgresoEnabled =
    pendiente && user?.ubicacion === traslado.ubicacion;
  const enProgreso = traslado.estado === EstadoTraslado.enProgreso;
  const btnRecibirEnabled = enProgreso && user?.ubicacion === traslado.destino;
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
        <List.Section style={{ flexDirection: "row" }}>
          <List.Item
            title="Solicitado por"
            description={getUsuarioNombre(traslado.usuarioSolicitud)}
            left={(props) => <List.Icon {...props} icon="account" />}
            style={{ flex: 1 }}
          />
          {traslado.usuarioEnProgreso && (
            <List.Item
              title="En progreso por"
              description={getUsuarioNombre(traslado.usuarioEnProgreso)}
              left={(props) => <List.Icon {...props} icon="account-clock" />}
              style={{ flex: 1 }}
            />
          )}
        </List.Section>
        {!hideVentaData && traslado.venta && (
          <VentaData venta={traslado.venta} />
        )}

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
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
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

export default TrasladoCard;
