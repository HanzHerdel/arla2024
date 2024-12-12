import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Modal, Portal, Button, Text, Surface, List } from "react-native-paper";
import GenericSelect from "../Select/SelectGeneric";
import { useElemento } from "@/store/elementosSlice";
import { GenericValue, Repuesto } from "@/types";
import { Ubicacion } from "@/utils/constants";
import { useSession } from "@/providers/Session";
import { createTraslado } from "@/api/traslados";
import { db } from "@/configs/firebaseConfig";

interface TrasladoData {
  origen: string;
  destino: string;
}

interface TrasladoModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm?: (data: TrasladoData) => void;
  repuesto: Repuesto;
  closeModal: Function;
  ubicacionOrigen?: Ubicacion;
}

const TrasladoModal: React.FC<TrasladoModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  repuesto,
  closeModal,
  ubicacionOrigen,
}) => {
  const [ubicacionDestino, setUbicacionDestino] = useState<GenericValue>();

  const [ubicacionActual, setUbicacionActual] = useState<GenericValue>();

  const { user } = useSession();

  const ubicaciones = useElemento("ubicaciones");

  useEffect(() => {
    const ubicacionSolicutud = ubicaciones.find(
      (ub) => ub.id === ubicacionOrigen
    );
    const ubicacionRepuesto = ubicaciones.find(
      (ub) => ub.id === repuesto?.ubicacion
    );
    setUbicacionDestino(ubicacionSolicutud);
    setUbicacionActual(ubicacionRepuesto);
  }, []);

  const handleConfirm = async () => {
    console.log("ubicacionSalida: ", ubicacionActual);
    console.log("ubicacionDestino: ", ubicacionDestino);
    if (
      !ubicacionActual ||
      !ubicacionDestino ||
      ubicacionActual.id === Ubicacion.indefinida ||
      ubicacionDestino.id === Ubicacion.indefinida
    ) {
      console.log("ambas ubicaciones deben ser definidas");
      return;
    }
    const res = await createTraslado(
      db,
      ubicacionActual.id,
      ubicacionDestino.id,
      repuesto!,
      user!
    );
    if (res) {
      closeModal();
    }
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
              onChange={setUbicacionActual}
              // disabled={!!ubicacionOrigen}
              defaultValue={ubicacionActual}
            />
          </View>

          <View style={styles.inputContainer}>
            <GenericSelect<any>
              selectLabel="Seleccione Destino"
              label="Destino"
              data={ubicaciones}
              selectedField="id"
              onChange={setUbicacionDestino}
              defaultValue={ubicacionDestino}
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
              Solicitar Traslado
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
