import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Control, Controller, UseControllerProps } from "react-hook-form";

type RulesType = UseControllerProps["rules"];

interface SelectFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  rules?: RulesType;
  errors?: any;
  items: Array<any>;
  placeholder?: string;
  required?: boolean;
  labelName?: string;
  valueName?: string;
  defaultValue?: Array<any>; // Nueva prop para valores preseleccionados
}

export const SelectMultipleModal = ({
  name,
  label,
  control,
  rules,
  errors,
  items,
  required,
  placeholder = "Seleccione una opción",
  labelName = "nombre",
  valueName = "id",
  defaultValue = [], // Valor por defecto vacío
}: SelectFieldProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // Efecto para inicializar los items seleccionados
  useEffect(() => {
    if (defaultValue.length > 0) {
      // Encontrar los items completos basados en los IDs preseleccionados
      const preselectedItems = items.filter((item) =>
        defaultValue.includes(item[valueName])
      );
      setSelectedItems(preselectedItems);
    }
  }, [defaultValue, items, valueName]);

  const toggleSelection = (item: any) => {
    setSelectedItems((prev) =>
      prev.some((i) => i[valueName] === item[valueName])
        ? prev.filter((i) => i[valueName] !== item[valueName])
        : [...prev, item]
    );
  };

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue} // Establecer valor por defecto en el Controller
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              style={[
                styles.selectButton,
                errors?.[name] && styles.pickerError,
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.selectButtonText}>
                {selectedItems.length > 0
                  ? selectedItems.map((item) => item[labelName]).join(", ")
                  : placeholder}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={modalVisible}
              style={styles.modal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.dropdown}>
                  <FlatList
                    data={items}
                    keyExtractor={(item) => item[valueName]}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => toggleSelection(item)}
                      >
                        <Text
                          style={{
                            color: selectedItems.some(
                              (i) => i[valueName] === item[valueName]
                            )
                              ? "blue"
                              : "black",
                          }}
                        >
                          {item[labelName]}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => {
                      onChange(selectedItems.map((item) => item[valueName]));
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
      />

      {errors?.[name] && (
        <Text style={styles.errorText}>{errors[name].message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: "auto",
  },
  formGroup: {
    margin: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
    color: "#333",
  },
  required: {
    color: "red",
  },
  selectButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    minWidth: 224,
  },
  selectButtonText: {
    fontSize: 16,
    color: "#333",
  },
  pickerError: {
    borderColor: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdown: {
    width: 224,
  },
  item: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {
    padding: 15,
    backgroundColor: "blue",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default SelectMultipleModal;
