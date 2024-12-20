import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { FieldValue, Timestamp } from "firebase/firestore";
import { Repuesto } from "../../types";
import { Icon } from "react-native-elements";

import { Button } from "react-native-paper";
import { globalStyles } from "@/utils/styles";
import { Ubicacion } from "@/utils/constants";
interface RepuestoDetailProps {
  repuesto: Repuesto;
  setModalVisible?: Function;
  onClose?: Function;
}

const RepuestoDetail: React.FC<RepuestoDetailProps> = ({
  repuesto,
  onClose,
  setModalVisible,
}) => {
  const formatDate = (fieldValue: FieldValue | undefined) => {
    if (!fieldValue) return "-";
    // Assuming fieldValue is a Timestamp
    const timestamp = fieldValue as Timestamp;
    return timestamp.toDate().toLocaleDateString();
  };

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <View style={styles.detailItem}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, globalStyles.flexBoxRow, { marginTop: 8 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Detalle Repuesto: {repuesto.nombre}</Text>
        </View>
        <View style={{ alignItems: "flex-end", flex: 1 }}>
          <Button
            mode={"contained-tonal"}
            style={{ maxWidth: 200, marginHorizontal: 48 }}
            onPress={() => setModalVisible?.(true)}
          >
            Trasladar
          </Button>
        </View>
      </View>
      <Pressable
        style={styles.closeButton}
        onPress={() => onClose?.()}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Icon name="close" size={24} color="#666" />
      </Pressable>
      <View style={styles.detailsContainer}>
        <DetailItem label="Descripción" value={repuesto.descripcion || "-"} />
        <DetailItem label="Existencias" value={repuesto.existencias} />
        <DetailItem label="Estación" value={repuesto.estacion} />
        <DetailItem label="Categoría" value={repuesto.categoria} />
        <DetailItem label="Línea" value={repuesto.linea} />
        <DetailItem label="Marca" value={repuesto.marca} />
        <DetailItem label="Modelo" value={repuesto.modelo} />
        {/*         <DetailItem
          label="Ubicacion"
          value={repuesto.ubicacion || Ubicacion.indefinida}
        />
        <DetailItem
          label="Bodega"
          value={repuesto.unidadesBodega || "Sin definir"}
        />
        <DetailItem
          label="Despacho"
          value={repuesto.unidadesDespacho || "Sin definir"}
        />
        <DetailItem
          label="Caja"
          value={repuesto.unidadesCaja || "Sin definir"}
        />
        <DetailItem
          label="Sala de Ventas"
          value={repuesto.unidadesSalaVentas}
        />
        <DetailItem
          label="En Traslado"
          value={repuesto.unidadesEnTraslado || 0}
        /> */}
        <DetailItem
          label="Compatibilidad"
          value={`${repuesto.compatibilidadInicial} - ${repuesto.compatibilidadFinal}`}
        />
        <DetailItem label="Precio" value={`Q${repuesto.precio}`} />

        {repuesto.precioDescuento && (
          <DetailItem
            label="Precio con descuento"
            value={`Q${repuesto.precioDescuento}`}
          />
        )}

        <DetailItem
          label="Última modificación"
          value={formatDate(repuesto.fechaDeModificacion)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 4,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
    marginBottom: 16,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a73e8",
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    flexBasis: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    color: "#666",
    marginRight: 8,
  },
  value: {
    color: "#333",
    flex: 1,
  },
});

export default RepuestoDetail;
