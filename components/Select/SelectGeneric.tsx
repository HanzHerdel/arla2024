import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

type GenericSelectProps<T> = {
  data: T[]; // Datos de usuarios
  onChange: (usuario: T) => void; // Función para actualizar el usuario seleccionado
  selectedField?: string;
  selectLabel?: string;
  label?: string;
  defaultValue?: any;
  disabled?: boolean;
};

const GenericSelect = <T,>({
  data,
  onChange,
  selectedField = "nombre",
  selectLabel = "Seleccione un usuario",
  label = "Seleccion:",
  defaultValue,
  disabled = false,
}: GenericSelectProps<T>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <SelectDropdown
        data={data}
        onSelect={(selectedItem) => onChange(selectedItem)}
        defaultValue={defaultValue}
        disabled={disabled}
        renderButton={(selectedItem) => {
          return (
            <View style={styles.dropdownButton}>
              <Text style={styles.dropdownButtonText}>
                {selectedItem ? selectedItem[selectedField] : selectLabel}
              </Text>
            </View>
          );
        }}
        renderItem={(item, index) => (
          <TouchableOpacity style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Alinea elementos en una fila
    flexWrap: "wrap", // Permite el salto de línea si no hay suficiente espacio
    alignItems: "center", // Alinea los elementos verticalmente al centro
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
  },
  dropdownButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    minWidth: 148,
  },
  dropdownButtonText: {
    fontSize: 14,
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    minWidth: 128,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 14,
    color: "blue",
    marginLeft: 8,
  },
  buttonStyle: {
    width: 150, // Reducimos el ancho del select
    minWidth: 128,
  },
  rowStyle: {
    width: "100%",
  },
});

export default GenericSelect;
