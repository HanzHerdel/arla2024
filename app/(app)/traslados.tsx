import React from "react";
import { StyleSheet, ScrollView } from "react-native";

import { useTraslados } from "@/store/trasladosSlice";

import TrasladoCard from "@/components/Traslado/TrasladoCard";

const TrasladosListView = ({}: {}) => {
  const traslados = useTraslados();
  return (
    <ScrollView style={styles.container}>
      {traslados.map((traslado, index) => (
        <TrasladoCard key={index} traslado={traslado} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default TrasladosListView;
