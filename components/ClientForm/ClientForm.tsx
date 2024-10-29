import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import TextField from "../Forms/TextField";
import { db } from "@/configs/firebaseConfig";
import { addCliente } from "@/api/addCliente";
import { Clientes, New } from "@/types";

interface AddClientFormProps {
  onSubmit: (formData: Clientes) => void;
  action?: "ADD" | "UPDATE";
}

const ClientForm: React.FC<AddClientFormProps> = ({
  onSubmit,
  action = "ADD",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<New<Clientes>>({
    defaultValues: {
      nombre: "",
      telefono: "",
      nit: "",
      correo: "",
      direccion: "",
      notas: "",
    },
  });

  const onSubmitForm = async (data: New<Clientes>) => {
    const newCliente = await addCliente(db, data);
    if (newCliente) onSubmit(newCliente);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <TextField
          name="nombre"
          label="Nombre"
          control={control}
          rules={{ required: "El campo Nombre es obligatorio" }}
          errors={errors}
          placeholder="Ingrese el nombre"
          required
        />

        <TextField
          name="nit"
          label="Nit"
          control={control}
          rules={{ required: "El campo Nit es obligatorio" }}
          errors={errors}
          placeholder="Ingrese el Nit"
          required
        />

        <TextField
          name="telefono"
          label="Teléfono"
          control={control}
          errors={errors}
          placeholder="Ingrese el teléfono"
        />

        <TextField
          name="correo"
          label="Correo"
          control={control}
          errors={errors}
          placeholder="Ingrese el correo"
        />
        <TextField
          name="direccion"
          label="Dirección"
          control={control}
          errors={errors}
          placeholder="Ingrese el dirección"
        />
        <TextField
          name="notas"
          label="Notas"
          control={control}
          errors={errors}
          placeholder="Ingrese notas adicionales"
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmitForm)}
        >
          <Text style={styles.submitButtonText}>
            {action === "ADD" ? "Agregar Cliente" : "Actualizar Cliente"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ClientForm;
