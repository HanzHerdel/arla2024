import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface ButtonGroupProps {
  onSellPress: () => void;
  onCreditPress: () => void;
  onQuotePress: () => void;
}

const ButtonGroupVender: React.FC<ButtonGroupProps> = ({
  onSellPress,
  onCreditPress,
  onQuotePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Botón Vender */}
      <TouchableOpacity style={styles.button} onPress={onSellPress}>
        <Icon name="attach-money" size={24} color="white" />
        <Text style={styles.buttonText}>Vender</Text>
      </TouchableOpacity>

      {/* Botón Al Crédito */}
      <TouchableOpacity style={styles.button} onPress={onCreditPress}>
        <Icon name="credit-card" size={24} color="white" />
        <Text style={styles.buttonText}>Al Crédito</Text>
      </TouchableOpacity>

      {/* Botón Cotizar */}
      <TouchableOpacity style={styles.button} onPress={onQuotePress}>
        <Icon name="receipt" size={24} color="white" />
        <Text style={styles.buttonText}>Cotizar</Text>
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
    backgroundColor: "#28A745", // Verde
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

export default ButtonGroupVender;
