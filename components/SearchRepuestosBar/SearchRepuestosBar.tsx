import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import ResponsiveTable from "@/components/Table/Table";
import { Repuesto } from "@/types";
import { columnsVentas } from "@/components/Table/utils/columns";

import useDebounce from "@/hooks/useDebounce";
import SearchBar from "@/components/SearchBar/SearchBar";

import { useSession } from "@/providers/Session";
import ClosableModal from "@/components/ClosableModal/ClosableModal";
import RepuestoForm from "@/components/Forms/RepuestosForm/RepuestosForm";
import useRepuestos from "@/hooks/useRepuestosFiltros";
import { PropsWithChildren } from "react";

interface SearchRepuestosBarProps {
  setRepuestos: (repuestos: Repuesto[]) => void;

  children?: React.ReactNode;
}

const SearchBarRepuestos: React.FC<SearchRepuestosBarProps> = ({
  children,
  setRepuestos,
}) => {
  const [nombre, setNombreFilter] = useState<string>("");
  const nameQuery = useDebounce(nombre);
  const [modelo, setModelo] = useState<string>("");
  const [linea, setLineaFilter] = useState<string>("");
  const [marca, setMarcaFilter] = useState<string>("");

  const [ubicacion, setUbicacion] = useState<string>("");
  const [proveedor, setProveedor] = useState<string>("");
  const { repuestos: searchResults } = useRepuestos({
    marca,
    linea,
    nombre: nameQuery.toUpperCase(),
    modelo,
    proveedor,
    ubicacion,
  });

  useEffect(() => {
    setRepuestos(searchResults);
  }, [searchResults]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar
          searchText={nombre}
          setSearchText={setNombreFilter}
          compatibility={modelo}
          setCompatibility={setModelo}
          brand={marca}
          setBrand={setMarcaFilter}
          line={linea}
          setLine={setLineaFilter}
          ubicacion={ubicacion}
          setUbicacion={setUbicacion}
          proveedor={proveedor}
          setProveedor={setProveedor}
          fullSearch
        />
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  childrenContainer: {
    padding: 16,
  },
});

export default SearchBarRepuestos;
