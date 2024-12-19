import { MetodoDePagoKey } from "@/types";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Chip, Text } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";

type GenericSelectProps = {
  data: Record<string, string>; // Cambio de T[] a Record<string, string>
  onChange: (key: MetodoDePagoKey) => void; // Actualizado para manejar key-value
  selectLabel?: string;
  label?: string;
  defaultValue?: string;
  disabled?: boolean;
};

const GenericSelectFromObject = ({
  data,
  onChange,
  selectLabel = "Seleccione una opción",
  label = "Selección:",
  defaultValue,
  disabled = false,
}: GenericSelectProps) => {
  // Convertimos el Record en un array de objetos para el dropdown
  const options = Object.entries(data).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}: </Text>
      <SelectDropdown
        data={options}
        onSelect={(selectedItem) => onChange(selectedItem.key)}
        defaultValue={options.find((option) => option.value === defaultValue)}
        disabled={disabled}
        renderButton={(selectedItem) => {
          return (
            <Chip style={styles.dropdownButton}>
              <Text style={styles.dropdownButtonText}>
                {selectedItem ? selectedItem.value : selectLabel}
              </Text>
            </Chip>
          );
        }}
        renderItem={(item) => (
          <TouchableOpacity style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.value}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 10,
    minWidth: 160,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  dropdownButton: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    minWidth: 148,
    flex: 1,
  },
  dropdownButtonText: {
    fontSize: 14,
  },
  dropdownItem: {
    padding: 10,
    minWidth: 128,
    width: "auto",
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
    width: 150,
    minWidth: 128,
  },
  rowStyle: {
    width: "100%",
  },
});

export default GenericSelectFromObject;
