import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TotalDisplayProps {
  text: string;
  label: string;
}

const LongBar: React.FC<TotalDisplayProps> = ({ label, text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.totalValue}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50", // Cambia el color según tus necesidades
  },
});

export default LongBar;
