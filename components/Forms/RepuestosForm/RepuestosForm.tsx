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
import TextField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";
import { db } from "@/configs/firebaseConfig";
import { EstadoRepuesto, New, Repuesto } from "@/types";
import { globalStyles } from "../../../utils/styles";
import { useElementos } from "@/store/elementosSlice";
import SelectMultipleModal from "@/components/Fields/SelectMultipleModal";
import { useSession } from "@/providers/Session";
import { createGenericDocument } from "@/api/genericActions";
import { Collections } from "@/utils/constants";
import { getKeyWordsFromName } from "@/utils/keywords";

interface RepuestoFormProps {
  onSubmit?: (formData: Repuesto) => void;
  action?: "ADD" | "UPDATE";
  repuesto?: Repuesto | null;
  contentContainerStyle?: object;
}

const RepuestoForm: React.FC<RepuestoFormProps> = ({
  onSubmit,
  action = "ADD",
  repuesto,
  contentContainerStyle,
}) => {
  const defaultValues = {
    codigo: "",
    compatibilidadFinal: 0,
    compatibilidadInicial: 0,
    unidadesLimite: 0,
    linea: "",
    modelo: 0,
    nombre: "",
    descripcion: "",
    lado: [],
    estado: "" as EstadoRepuesto,
    proveedor: "",
    existencias: 0,
    estacion: "",
    marca: "",
    categoria: "",
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<New<Repuesto>>({
    defaultValues: repuesto || defaultValues,
  });
  const selectedMarcaId = watch("marca");
  const selectedFinalCompat = watch("compatibilidadFinal");
  const selectedInitialCompat = watch("compatibilidadInicial");
  const {
    marcas,
    categorias,
    proveedores,
    estaciones,
    lineas,
    modelos,
    estados,
    lados,
  } = useElementos();

  const [lineasFiltered, setLineasFiltered] = useState(lineas);

  useEffect(() => {
    if (selectedMarcaId) {
      const selectedMarca = marcas.find(
        // TODO: cambiar esto a id al migrar datos
        (marca) => marca.nombre === selectedMarcaId
      );
      const lineasFiltradas = lineas.filter(
        (linea) =>
          linea.marca === selectedMarca?.nombre ||
          linea.marcaId === selectedMarcaId
      );
      setLineasFiltered(lineasFiltradas);
    } else {
      setLineasFiltered(lineas);
    }
  }, [selectedMarcaId]);

  const { user } = useSession();
  const onSubmitForm = async (data: New<Repuesto>) => {
    data.nombre = data.nombre.toUpperCase();
    data.keyWords = getKeyWordsFromName(data.nombre);
    if (action === "ADD") {
      const newRepuesto = await createGenericDocument<New<Repuesto>>(
        db,
        Collections.repuestos,
        data
      );
    }
    if (action === "UPDATE") {
      console.log("data: ", data);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={[styles.formCard, contentContainerStyle]}>
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
            name="codigo"
            label="Código"
            control={control}
            rules={{ required: "El campo Código es obligatorio" }}
            errors={errors}
            placeholder="Ingrese el código"
            required
          />
          <SelectField
            name="categoria"
            label="Categoría"
            control={control}
            rules={{ required: "El campo Categoría es obligatorio" }}
            errors={errors}
            items={categorias} // Aquí irían las opciones de categoría
            required
          />

          <SelectField
            name="estacion"
            label="Estación"
            control={control}
            rules={{ required: "El campo Estación es obligatorio" }}
            errors={errors}
            items={estaciones} // Aquí irían las opciones de estación
            required
          />

          <SelectField
            name="modelo"
            label="Modelo"
            control={control}
            rules={{ required: "El campo Modelo es obligatorio" }}
            errors={errors}
            items={modelos} // Aquí irían las opciones de modelo
            required
          />

          <SelectField
            name="compatibilidadInicial"
            label="Compatibilidad Inicial"
            control={control}
            rules={{
              required: "El campo Compatibilidad Inicial es obligatorio",
              max: {
                value: selectedFinalCompat + 1,
                message: `El valor debe ser menor a ${selectedFinalCompat}`,
              },
            }}
            errors={errors}
            items={modelos} // Aquí irían las opciones de compatibilidad inicial
            required
          />

          <SelectField
            name="compatibilidadFinal"
            label="Compatibilidad Final"
            control={control}
            rules={{
              required: "El campo Compatibilidad Inicial es obligatorio",
              min: {
                value: selectedInitialCompat,
                message: `El valor debe ser igual o mayor a ${selectedInitialCompat}`,
              },
            }}
            errors={errors}
            items={modelos} // Aquí irían las opciones de compatibilidad final
            required
          />

          <SelectField
            name="marca"
            label="Marca"
            control={control}
            rules={{ required: "El campo Marca es obligatorio" }}
            errors={errors}
            items={marcas} // Aquí irían las opciones de marca
            required
          />

          <SelectField
            name="linea"
            label="Línea"
            control={control}
            rules={{ required: "El campo Línea es obligatorio" }}
            errors={errors}
            items={lineasFiltered} // Aquí irían las opciones de línea
            required
          />

          <TextField
            name="descripcion"
            label="Descripción"
            control={control}
            rules={{ required: "El campo Descripción es obligatorio" }}
            errors={errors}
            placeholder="Ingrese la descripción"
            required
          />

          <TextField
            name="unidadesLimite"
            label="Unidades limite"
            control={control}
            rules={{ required: "El campo Descripción es obligatorio" }}
            errors={errors}
            placeholder="Ingrese la cantidad"
            isNumeric
          />
          <SelectMultipleModal
            name="lado"
            label="Lado"
            control={control}
            rules={{ required: "El campo Lado es obligatorio" }}
            errors={errors}
            items={lados} // Aquí irían las opciones de lado
            required
          />

          <SelectField
            name="proveedor"
            label="Proveedores"
            control={control}
            rules={{ required: "El campo Lado es obligatorio" }}
            errors={errors}
            items={proveedores} // Aquí irían las opciones de lado
            required
            valueName="id"
          />

          <SelectField
            name="estado"
            label="Estado"
            control={control}
            rules={{ required: "El campo Estado es obligatorio" }}
            errors={errors}
            items={estados}
            required
          />

          {!!user?.superUser && (
            <TextField
              name="existencias"
              label="Existencias"
              control={control}
              rules={{
                required: "El campo Existencias es obligatorio",
                min: {
                  value: 0,
                  message: "Las existencias no pueden ser negativas",
                },
              }}
              errors={errors}
              placeholder="Ingrese la cantidad"
              isNumeric
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmitForm)}
        >
          <Text style={styles.submitButtonText}>
            {action === "ADD" ? "Agregar Repuesto" : "Actualizar Repuesto"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formCard: {
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
  },
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

export default RepuestoForm;