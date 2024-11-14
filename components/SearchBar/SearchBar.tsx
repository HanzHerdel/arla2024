import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { db } from "@/configs/firebaseConfig";
import { getCollectionData } from "@/api/getGenericCollections";
import { Linea, Marca, Modelo } from "@/types";

interface SearchFilterProps {
  searchText: string;
  brand: string;
  line: string;
  compatibility: string;
  setBrand: (brand: string) => void;
  setCompatibility: (compat: string) => void;
  setSearchText: (name: string) => void;
  setLine: (linea: string) => void;
}

const SearchBar: React.FC<SearchFilterProps> = ({
  searchText,
  setSearchText,
  compatibility,
  setCompatibility,
  brand,
  setBrand,
  line,
  setLine,
}) => {
  // Datos de ejemplo para los selectores
  const [lineas, setLineas] = useState<Linea[]>([]);

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);

  useEffect(() => {
    getCollectionData<Linea>(db, "lineas", setLineas);

    getCollectionData<Marca>(db, "marcas", setMarcas);

    getCollectionData<Modelo>(db, "modelos", setModelos, "modelo");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Búsqueda"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.selectorsContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={compatibility}
            onValueChange={(itemValue: any) => setCompatibility(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Compatibilidad" value="" />
            {modelos.map((option, index) => (
              <Picker.Item key={index} label={option.id} value={option.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={brand}
            onValueChange={(itemValue: any) => setBrand(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Marca" value="" />
            {marcas.map((option, index) => (
              <Picker.Item
                key={index}
                label={option.nombre}
                value={option.nombre}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={line}
            onValueChange={(itemValue: any) => setLine(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Línea" value="" />
            {lineas.map((option, index) => (
              <Picker.Item
                key={index}
                label={option.nombre}
                value={option.nombre}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  selectorsContainer: {
    flexDirection: Dimensions.get("window").width > 768 ? "row" : "column",
    justifyContent: "space-between",
    gap: 10,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    height: 40,
  },
});

export default SearchBar;
