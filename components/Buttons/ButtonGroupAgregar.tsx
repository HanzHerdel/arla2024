import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface ButtonGroupProps {
  onAddPress: () => void;
  onDiscountPress: () => void;
  onSpecialDiscountPress: () => void;
}

const ButtonGroupAgregar: React.FC<ButtonGroupProps> = ({
  onAddPress,
  onDiscountPress,
  onSpecialDiscountPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Botón Agregar */}
      <TouchableOpacity style={styles.button} onPress={onAddPress}>
        <Icon name="add-shopping-cart" size={24} color="white" />
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>

      {/* Botón Con descuento */}
      <TouchableOpacity style={styles.button} onPress={onDiscountPress}>
        <Icon name="local-offer" size={24} color="white" />
        <Text style={styles.buttonText}>Con descuento</Text>
      </TouchableOpacity>

      {/* Botón Descuento especial */}
      <TouchableOpacity style={styles.button} onPress={onSpecialDiscountPress}>
        <Icon name="star" size={24} color="white" />
        <Text style={styles.buttonText}>Descuento especial</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 16,
  },
});

export default ButtonGroupAgregar;
