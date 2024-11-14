import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
  UseControllerProps,
} from "react-hook-form";
type RulesType = UseControllerProps["rules"];
interface SelectFieldProps {
  name: string;
  label: string;
  control: any;
  rules?: RulesType;
  errors?: any;
  items: Array<any>;
  placeholder?: string;
  required?: boolean;
  labelName?: string;
  valueName?: string;
}

export const SelectField = ({
  name,
  label,
  control,
  rules,
  errors,
  items,
  required,
  placeholder = "Seleccione una opción",
  labelName = "nombre",
  // TODO: cambiar esto a id cuando se migren los datos
  valueName = "nombre",
}: SelectFieldProps) => {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <View
            style={[
              styles.pickerContainer,
              errors?.[name] && styles.pickerError,
            ]}
          >
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
            >
              <Picker.Item label={placeholder} value="" />
              {items.map((item, index) => (
                <Picker.Item
                  key={item[valueName] + index}
                  label={item[labelName]}
                  value={item[valueName]}
                />
              ))}
            </Picker>
          </View>
        )}
      />

      {errors?.[name] && (
        <Text style={styles.errorText}>{errors[name].message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        paddingVertical: 8,
      },
    }),
  },
  pickerError: {
    borderColor: "red",
  },
  picker: {
    height: Platform.OS === "ios" ? 150 : 50,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default SelectField;
