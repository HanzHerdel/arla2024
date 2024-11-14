import React, { useEffect, useState } from "react";
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
import { Linea, Marca, New } from "@/types";
import SelectField from "../Fields/SelectField";
import TextField from "../Fields/TextField";
import { getCollectionData } from "@/api/getGenericCollections";
import { Collections } from "@/utils/constants";
import { globalStyles } from "@/utils/styles";
import { createGenericDocument } from "@/api/genericActions";
import { useStore } from "react-redux";
import { Elementos, useElemento, useElementos } from "@/store/elementosSlice";

interface LineaFormProps {
  onSubmit?: (formData: Linea) => void;
  action?: "ADD" | "UPDATE";
}

const LineaForm: React.FC<LineaFormProps> = ({ onSubmit, action = "ADD" }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      marca: "",
      nombre: "",
    },
  });

  /*   const [marcas, setmarcas] = useState<Marca[]>([]);
  useEffect(() => {
    getCollectionData(db, Collections.marcas, setmarcas);
  }, []); */

  const marcas = useElemento(Elementos.marcas);

  const onSubmitForm = async (data: New<Linea>) => {
    const marca = marcas.find((item) => item.nombre === data.marca);
    if (!marca) {
      console.log("la marca no existe");
      return;
    }
    createGenericDocument<New<Linea>>(db, Collections.lineas, {
      ...data,
      marca: marca.nombre,
      marcaId: marca.id,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={globalStyles.card}>
          <SelectField
            name="marca"
            label="Marca"
            control={control}
            rules={{ required: "El campo Marca es obligatorio" }}
            errors={errors}
            items={marcas}
            placeholder="Seleccione una marca"
            required
          />

          <TextField
            name="nombre"
            label="Nombre"
            control={control}
            rules={{ required: "El campo Nombre es obligatorio" }}
            errors={errors}
            placeholder="Ingrese el nombre de la línea"
            required
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmitForm)}
          >
            <Text style={styles.submitButtonText}>
              {action === "ADD" ? "Agregar Línea" : "Actualizar Línea"}
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

export default LineaForm;
