import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Modal,
  Portal,
  Button,
  Surface,
  TextInput,
  Text,
  Icon,
  IconButton,
  List,
  Chip,
} from "react-native-paper";

import { METHODOS_DE_PAGO, Ubicacion } from "@/utils/constants";

import GenericSelectFromObject from "../Select/SelectFromObject";
import { convertRepValuesToNumbers } from "../../api/utils";
import { useSnackbar } from "@/providers/Snackbar";
import {
  MethodoDePago,
  MetodoDePagoKey,
  MetodoDePagoValue,
  MetodosDePagoType,
  Venta,
} from "@/types";

interface MethodoPagoModalProps {
  visible: boolean;
  venta: Venta;
  onDismiss: () => void;
  onConfirm: (venta: Venta, metodosPago: MethodoDePago) => void;
}

const ModalMethodoPago: React.FC<MethodoPagoModalProps> = ({
  visible,
  onDismiss,
  venta,
  onConfirm,
}) => {
  const [metodo, setMetodoSelected] = useState<MetodoDePagoKey | null>(null);

  const { showError } = useSnackbar();
  const [metodosPago, setmetodosPago] = useState<MethodoDePago | null>(null);
  const [valor, setValor] = useState<string>("");

  const handleConfirm = () => {
    if (!metodosPago) {
      showError("Debe agregar almenos un metodo de pago");
      return;
    }
    console.log("metodosPago: ", metodosPago);

    const totalMetodos = Object.values(metodosPago).reduce(
      (acc, v) => Number(v) + acc
    );
    console.log("totalMetodos: ", totalMetodos);
    console.log("venta.total: ", venta.total);
    if (venta.total !== totalMetodos) {
      showError(
        "El total de los metodos de pago debe ser igual al total de la venta"
      );
      return;
    }
    onConfirm(venta, metodosPago);
    setValor("");
    setMetodoSelected(null);
    setmetodosPago(null);
  };
  const handleAddMetodoPago = () => {
    const value = Number(valor);
    if (!value || isNaN(value)) {
      console.log("value: ", value);
      showError("El valor debe ser un numero");
      return;
    }
    if (!metodo) {
      showError("Debe seleccionar un metodo");
      return;
    }

    const newMetodosPago = {
      ...metodosPago,
      [metodo]: value!,
    } as MethodoDePago;
    setmetodosPago(newMetodosPago);
    setValor("");
    setMetodoSelected(null);
  };

  const handleDeleteMetodo = (key: MetodoDePagoKey) => {
    const newMetodosPago = { ...metodosPago } as MethodoDePago;
    delete newMetodosPago[key];
    setmetodosPago(newMetodosPago);
  };
  return (
    <Portal>
      <Modal
        style={{ maxWidth: 880, margin: "auto" }}
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Surface style={styles.inputContainer}>
          <GenericSelectFromObject
            selectLabel="Seleccione Metodo De Pago"
            data={METHODOS_DE_PAGO}
            label="Tipo de pago"
            onChange={setMetodoSelected}
          />
          <TextInput
            style={{ flex: 0.5, minWidth: 80 }}
            label="Valor"
            value={valor}
            onChangeText={setValor}
            inputMode="decimal"
          />
          <IconButton
            style={{ flexGrow: 0, marginRight: 8 }}
            icon="plus-circle-outline"
            size={48}
            onPress={() => handleAddMetodoPago()}
          />
        </Surface>
        {metodosPago &&
          (Object.keys(metodosPago) as MetodoDePagoKey[]).map((key) => {
            return (
              <Chip
                key={key}
                style={{ margin: 8 }}
                icon="cash" // Icono de cash (debe estar disponible en los íconos de Material Design)
                closeIcon="close" // Icono de cerrar
                onClose={() => handleDeleteMetodo(key)} // Acción al presionar el closeIcon
                mode="outlined" // Puedes cambiar a "flat" si prefieres otro estilo
              >
                {key}: {metodosPago[key]}
              </Chip>
            );
          })}
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={onDismiss} style={styles.button}>
            Cancelar
          </Button>
          <Button
            mode="contained-tonal"
            onPress={handleConfirm}
            style={styles.button}
            buttonColor="#2196F3"
            textColor="#FFFFFF"
          >
            Confirmar Pago
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 4,
  },
  surface: {
    padding: 20,
  },
  inputContainer: {
    alignItems: "center",
    marginBottom: 20,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  button: {
    minWidth: 120,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  text: {
    flex: 1,
  },
  number: {
    marginHorizontal: 10,
    minWidth: 40,
    textAlign: "right",
  },
});

export default ModalMethodoPago;
