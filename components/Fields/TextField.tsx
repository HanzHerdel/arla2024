import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import {
  Control,
  Controller,
  FieldValues,
  FieldErrors,
  UseControllerProps,
} from "react-hook-form";

type RulesType = UseControllerProps["rules"];
interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  rules?: RulesType;
  required?: boolean;
  errors: FieldErrors;
  keyboardType?: KeyboardTypeOptions;
  isNumeric?: boolean;
}
const TextField: React.FC<FormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  rules,
  required,
  errors,
  keyboardType = "default",
  isNumeric = false,
}) => {
  if (isNumeric) {
    rules = {
      ...rules,
      pattern: {
        value: /^[0-9]*$/,
        message: "Este campo debe ser numérico",
      },
    };
    keyboardType = "numeric";
  }
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>
        {label}
        {required ? "*" : ""}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            keyboardType={keyboardType}
            style={[styles.input, errors[name] && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
          />
        )}
      />
      {errors[name] && (
        /* @ts-ignore */
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: { margin: 20 },
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
});

export default TextField;
