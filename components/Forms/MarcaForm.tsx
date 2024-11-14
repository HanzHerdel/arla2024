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
import { Marca, New } from "@/types";
import TextField from "../Fields/TextField";
import { Collections } from "@/utils/constants";
import { globalStyles } from "@/utils/styles";
import { createGenericDocument } from "@/api/genericActions";

interface LineaFormProps {
  onSubmit?: (formData: Marca) => void;
  action?: "ADD" | "UPDATE";
}

const MarcaForm: React.FC<LineaFormProps> = ({ onSubmit, action = "ADD" }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
    },
  });

  const onSubmitForm = async (data: New<Marca>) => {
    createGenericDocument<New<Marca>>(db, Collections.marcas, data);
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
            placeholder="Ingrese el nombre de la marca"
            required
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmitForm)}
          >
            <Text style={styles.submitButtonText}>
              {action === "ADD" ? "Agregar Marca" : "Actualizar Marca"}
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

export default MarcaForm;
