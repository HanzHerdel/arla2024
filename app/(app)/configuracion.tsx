import { crearUsuario } from "@/api/configuracion";
import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

const CenteredButton = () => {
  const handlePress = () => {
    console.log("¡Botón presionado!");
    const usuario = {
      nombre: "Juan Pérez",
      email: "juan@ejemplo.com",
    };
    crearUsuario(usuario);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Crear Usuario</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CenteredButton;
