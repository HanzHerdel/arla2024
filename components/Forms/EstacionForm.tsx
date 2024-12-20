import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { db } from "@/configs/firebaseConfig";
import { Estacion, New } from "@/types";
import TextField from "../Fields/TextField";
import { Collections } from "@/utils/constants";
import { globalStyles } from "@/utils/styles";
import { createGenericDocument } from "@/api/genericActions";

interface EstacionFormProps {
  onSubmit?: (formData: Estacion) => void;
  action?: "ADD" | "UPDATE";
}

const EstacionForm: React.FC<EstacionFormProps> = ({
  onSubmit,
  action = "ADD",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const onSubmitForm = async (data: New<Estacion>) => {
    createGenericDocument<New<Estacion>>(db, Collections.estaciones, data);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={globalStyles.card}>
          <TextField
            name="nombre"
            label="Nombre"
            control={control}
            rules={{ required: "El campo Nombre es obligatorio" }}
            errors={errors}
            placeholder="Ingrese el nombre de la estación"
            required
          />

          <TextField
            name="descripcion"
            label="Descripción"
            control={control}
            rules={{ required: "El campo Descripción es obligatorio" }}
            errors={errors}
            placeholder="Ingrese notas o descripción de la estación"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmitForm)}
          >
            <Text style={styles.submitButtonText}>
              {action === "ADD" ? "Agregar Estación" : "Actualizar Estación"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EstacionForm;
