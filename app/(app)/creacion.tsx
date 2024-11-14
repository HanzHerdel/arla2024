import CategoriaForm from "@/components/Forms/CategoriaForm";
import EstacionForm from "@/components/Forms/EstacionForm";
import LineaForm from "@/components/Forms/LineaForm";
import MarcaForm from "@/components/Forms/MarcaForm";
import ProveedorForm from "@/components/Forms/ProveedorForm";
import RepuestoForm from "@/components/Forms/RepuestosForm/RepuestosForm";
import { globalStyles } from "@/utils/styles";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
enum VIEWS {
  Repuestos = "Repuestos",
  Linea = "Linea",
  Marca = "Marca",
  Categoria = "Categoria",
  Proveedor = "Proveedor",
  Estacion = "Estacion",
  //Estanteria = "Estanteria",
}
const TabbedView = () => {
  const [selectedTab, setSelectedTab] = useState(VIEWS.Repuestos);
  console.log("selectedTab: ", selectedTab);

  const renderContent = () => {
    switch (selectedTab) {
      case VIEWS.Repuestos:
        return (
          <View style={styles.contentContainer}>
            <RepuestoForm contentContainerStyle={globalStyles.card} />
          </View>
        );
      case VIEWS.Linea:
        return (
          <View style={styles.contentContainer}>
            <LineaForm />
          </View>
        );
      case VIEWS.Marca:
        return (
          <View style={styles.contentContainer}>
            <MarcaForm />
          </View>
        );
      case VIEWS.Categoria:
        return (
          <View style={styles.contentContainer}>
            <CategoriaForm />
          </View>
        );
      case VIEWS.Proveedor:
        return (
          <View style={styles.contentContainer}>
            <ProveedorForm />
          </View>
        );
      case VIEWS.Estacion:
        return (
          <View style={styles.contentContainer}>
            <EstacionForm />
          </View>
        );
      /*  case VIEWS.Estanteria:
        return (
          <View style={styles.contentContainer}>
            <Text>Contenido de la Vista 5</Text>
          </View>
        ); */
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {Object.values(VIEWS).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.button,
              selectedTab === tab && styles.selectedButton,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedTab === tab && styles.selectedButtonText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  button: {
    padding: 10,
    marginHorizontal: 12,
    marginTop: 24,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    minWidth: 124,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#000000",
  },
  selectedButtonText: {
    color: "#ffffff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TabbedView;
