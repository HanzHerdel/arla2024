import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Modal, Portal, Button, Text, Surface, List } from "react-native-paper";
import GenericSelect from "../Select/SelectGeneric";
import { useElemento } from "@/store/elementosSlice";
import { Repuesto } from "@/types";
import { Ubicacion } from "@/utils/constants";

interface TrasladoData {
  origen: string;
  destino: string;
}

interface TrasladoModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm?: (data: TrasladoData) => void;
  repuesto: Repuesto | null;

  ubicacionOrigen?: Ubicacion;
}

const TrasladoModal: React.FC<TrasladoModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  repuesto = null,
  ubicacionOrigen,
}) => {
  const [ubicacionDestino, setUbicacionDestino] = useState<string>("");

  const ubicaciones = useElemento("ubicaciones");

  const ubicacionSolicutud = ubicaciones.find(
    (ub) => ub.id === ubicacionOrigen
  );

  const ubicacionRep = ubicaciones.find((ub) => ub.id === repuesto?.ubicacion);
  const handleConfirm = (): void => {
    console.log("crear traslado", ubicacionDestino, ubicacionSolicutud);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Surface style={styles.surface}>
          <View style={styles.inputContainer}>
            <GenericSelect<any>
              selectLabel="Seleccione salida"
              data={ubicaciones}
              label="Salida"
              selectedField="id"
              onChange={setUbicacionDestino}
              disabled
              defaultValue={ubicacionRep}
            />
          </View>

          <View style={styles.inputContainer}>
            <GenericSelect<any>
              selectLabel="Seleccione Destino"
              label="Destino"
              data={ubicaciones}
              selectedField="id"
              onChange={setUbicacionDestino}
              defaultValue={ubicacionSolicutud}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={onDismiss}
              style={styles.button}
              textColor="#666666"
            >
              Cancelar
            </Button>
            <Button
              mode="contained-tonal"
              onPress={handleConfirm}
              style={styles.button}
              buttonColor="#2196F3"
              textColor="#FFFFFF"
            >
              Confirmar Traslado
            </Button>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 4,
  },
  inputContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  button: {
    minWidth: 120,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default TrasladoModal;
