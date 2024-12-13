import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useElementos } from "@/store/elementosSlice";

interface SearchFilterProps {
  searchText: string;
  brand: string;
  line: string;
  compatibility: string;
  setBrand: (brand: string) => void;
  setCompatibility: (compat: string) => void;
  setSearchText: (name: string) => void;
  setLine: (linea: string) => void;
  setUbicacion?: (brand: string) => void;
  ubicacion?: string;
  setProveedor?: (compat: string) => void;
  proveedor?: string;
  fullSearch?: boolean;
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
  setUbicacion,
  ubicacion,
  setProveedor,
  proveedor,
  fullSearch = false,
}) => {
  // Datos de ejemplo para los selectores

  const { marcas, lineas, modelos, ubicaciones, proveedores } = useElementos();

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nombre Repuesto"
          value={searchText}
          onChangeText={setSearchText}
        />
        {fullSearch && (
          <View>
            <Picker
              selectedValue={ubicacion}
              onValueChange={(itemValue: any) => setUbicacion?.(itemValue)}
              style={{ ...styles.picker, flex: 1 }}
            >
              <Picker.Item label="Ubicacion" value="" />
              {ubicaciones.map((option, index) => (
                <Picker.Item key={index} label={option.id} value={option.id} />
              ))}
            </Picker>
            <Picker
              selectedValue={proveedor}
              onValueChange={(itemValue: any) => setProveedor?.(itemValue)}
              style={{ ...styles.picker, flex: 1 }}
            >
              <Picker.Item label="Proveedor" value="" />
              {proveedores.map((option, index) => (
                <Picker.Item
                  key={index}
                  label={option.nombre}
                  value={option.id}
                />
              ))}
            </Picker>
          </View>
        )}
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
    maxHeight: 200,
  },
  searchContainer: {
    marginBottom: 10,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    minWidth: 400,
    flexGrow: 1,
  },
  selectorsContainer: {
    //flexDirection: Dimensions.get("window").width > 768 ? "row" : "column",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    minWidth: 200,
    gap: 8,
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
