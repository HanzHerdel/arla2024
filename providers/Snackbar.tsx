import React, { createContext, useState, useContext, ReactNode } from "react";
import { Snackbar, SnackbarProps, Text } from "react-native-paper";
import { StyleProp, ViewStyle, TextStyle } from "react-native";

// Tipos de alerta
export enum SnackbarType {
  success = "success",
  error = "error",
  warning = "warning",
  info = "info",
  default = "default",
}

// Interfaz para las opciones del Snackbar
export interface SnackbarOptions {
  type?: SnackbarType;
  duration?: number;
  actionLabel?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// Interfaz para el contexto del Snackbar
interface SnackbarContextType {
  showSnackbar: (
    message: string,
    { type, duration, actionLabel, onPress, style, textStyle }?: SnackbarOptions
  ) => void;
  showError: (
    message: string,
    { type, duration, actionLabel, onPress, style, textStyle }?: SnackbarOptions
  ) => void;
  hideSnackbar: () => void;
}

// Crear el contexto para el Snackbar
const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

// Hook personalizado para usar el Snackbar
export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

// Proveedor del Snackbar
export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState<SnackbarOptions>({});

  // Configuraciones de color por tipo de alerta
  const getColorByType = (type: SnackbarType): string => {
    const colorMap: Record<SnackbarType, string> = {
      success: "#4CAF50",
      error: "#F44336",
      warning: "#FF9800",
      info: "#2196F3",
      default: "#333333",
    };
    return colorMap[type];
  };

  // Función para mostrar el Snackbar
  const showError = (message = "Error", snackOptions: SnackbarOptions = {}) => {
    const defaultOptions: SnackbarOptions = {
      type: SnackbarType.error,
      duration: 3000,
      actionLabel: "Cerrar",
      onPress: () => setVisible(false),
    };

    const mergedOptions = { ...defaultOptions, ...snackOptions };

    setMessage(message);
    setOptions(mergedOptions);
    setVisible(true);
  };

  const showSnackbar = (
    message = "Éxito",
    snackOptions: SnackbarOptions = {}
  ) => {
    const defaultOptions: SnackbarOptions = {
      type: SnackbarType.default,
      duration: 3000,
      actionLabel: "Cerrar",
      onPress: () => setVisible(false),
    };

    const mergedOptions = { ...defaultOptions, ...snackOptions };

    setMessage(message);
    setOptions(mergedOptions);
    setVisible(true);
  };

  // Función para ocultar el Snackbar
  const hideSnackbar = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar, showError }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={options.duration}
        style={[
          {
            backgroundColor: getColorByType(
              options.type || SnackbarType.default
            ),
          },
          options.style,
        ]}
        action={{
          label: options.actionLabel || "Cerrar",
          onPress: options.onPress,
        }}
        wrapperStyle={options.style}
      >
        <Text style={[{ color: "white", fontSize: 16 }, options.textStyle]}>
          {message}
        </Text>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
