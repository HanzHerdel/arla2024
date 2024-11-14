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
import { Proveedor, New } from "@/types";
import TextField from "../Fields/TextField";
import { Collections } from "@/utils/constants";
import { globalStyles } from "@/utils/styles";
import { createGenericDocument } from "@/api/genericActions";

interface ProveedorFormProps {
  onSubmit?: (formData: Proveedor) => void;
  action?: "ADD" | "UPDATE";
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({
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
      nit: "",
      telefono: "",
      empresa: "",
      email: "",
    },
  });

  const onSubmitForm = async (data: New<Proveedor>) => {
    createGenericDocument<New<Proveedor>>(db, Collections.proveedores, data);
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
            placeholder="Ingrese el nombre del proveedor"
            required
          />

          <TextField
            name="nit"
            label="NIT"
            control={control}
            rules={{ required: "El campo NIT es obligatorio" }}
            errors={errors}
            placeholder="Ingrese el NIT del proveedor"
          />

          <TextField
            name="telefono"
            label="Teléfono"
            control={control}
            rules={{ required: "El campo Teléfono es obligatorio" }}
            errors={errors}
            placeholder="Ingrese el teléfono del proveedor"
            keyboardType="phone-pad"
          />

          <TextField
            name="empresa"
            label="Empresa"
            control={control}
            rules={{ required: "El campo Empresa es obligatorio" }}
            errors={errors}
            placeholder="Ingrese el nombre de la empresa"
          />

          <TextField
            name="email"
            label="Email"
            control={control}
            rules={{
              required: "El campo Email es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            }}
            errors={errors}
            placeholder="Ingrese el email del proveedor"
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmitForm)}
          >
            <Text style={styles.submitButtonText}>
              {action === "ADD" ? "Agregar Proveedor" : "Actualizar Proveedor"}
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

export default ProveedorForm;
