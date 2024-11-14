// VentasScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { db } from "@/configs/firebaseConfig";
import ResponsiveTable from "@/components/Table/Table";
import { Repuesto } from "@/types";
import RepuestoDetail from "@/components/Details/Details";
import { columnsVentas } from "@/components/Table/utils/columns";

import useDebounce from "@/hooks/useDebounce";
import { getRepuestosVentas } from "@/api/getRepuestosVentas";
import SearchBar from "@/components/SearchBar/SearchBar";

import { useSession } from "@/providers/Session";
import ClosableModal from "@/components/ClosableModal/ClosableModal";
import RepuestoForm from "@/components/Forms/RepuestosForm/RepuestosForm";

//////////////////////////////////////////////
// Main Component
//////////////////////////////////////////////

const VentasScreen: React.FC = ({}) => {
  // States
  const [nombre, setNombreFilter] = useState<string>("");
  const nameQuery = useDebounce(nombre);
  const { user } = useSession();
  const [modelo, setModelo] = useState<string>("");
  const [linea, setLineaFilter] = useState<string>("");
  const [marca, setMarcaFilter] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Repuesto[]>([]);
  const [repuestoModal, setRepuestoModal] = useState(false);

  const [repuestoSeleccionado, setrepuestoSeleccionado] =
    useState<Repuesto | null>();

  /** Effects */

  useEffect(() => {
    performSearch();
  }, [nameQuery, linea, marca, modelo]);

  /** Search Functions */

  const performSearch = async (): Promise<void> => {
    const nombre = nameQuery.toUpperCase();

    try {
      console.log("modelo: ", modelo, typeof modelo);
      const results = await getRepuestosVentas(db, {
        marca,
        linea,
        nombre,
        modelo,
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      console.log("Error", "Error al buscar repuestos");
    }
  };

  const handleSelectItem = (item: Repuesto | null) => {
    console.log("item: ", item);
    setrepuestoSeleccionado(item);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Barra de busqueda y tabla de resultados */}
        <SearchBar
          searchText={nombre}
          setSearchText={setNombreFilter}
          compatibility={modelo}
          setCompatibility={setModelo}
          brand={marca}
          setBrand={setMarcaFilter}
          line={linea}
          setLine={setLineaFilter}
        />
        <ResponsiveTable
          items={searchResults}
          columns={columnsVentas}
          onIncrement={(item) => {
            console.log(item);
          }}
          onDecrement={(item) => {
            console.log(item);
          }}
          handleSelect={handleSelectItem}
          salesVersion={false}
        />
        {/* Detalle Repuesto Seleccionado y bottones de agregar */}
      </View>
      <ClosableModal
        onClose={() => setrepuestoSeleccionado(undefined)}
        visible={!!repuestoSeleccionado}
      >
        <RepuestoForm repuesto={repuestoSeleccionado} action="UPDATE" />
      </ClosableModal>
    </View>
  );
};

//////////////////////////////////////////////
// Styles
//////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 40,
  },
  searchSection: {
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  resultsList: {
    flex: 1,
  },
  searchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  cartSection: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  dropdown: {
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});

export default VentasScreen;
