import { getCreditos, pagarCredito } from "@/api/creditos";
import { Cliente, Venta } from "@/types";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { db } from "@/configs/firebaseConfig";
import { globalStyles } from "@/utils/styles";
import { SearchSelect } from "@/components/Select/SelectFinder";

const CreditosList: React.FC = () => {
  const [creditos, setCreditos] = useState<Venta[]>([]);
  const [clientes, setclientes] = useState<Cliente[]>([]);
  console.log("clientes: ", clientes);
  const [filteredCreditos, setfilteredCreditos] = useState<Venta[]>([]);
  const [clienteSelected, setClienteSelected] = useState<Cliente | null>(null);

  useEffect(() => {
    getCreditos(db, setCreditos);
  }, []);

  useEffect(() => {
    if (clienteSelected) {
      const creditosFiltered = creditos.filter(
        ({ cliente }) => cliente === clienteSelected
      );
      setfilteredCreditos(creditosFiltered);
    } else {
      setfilteredCreditos(creditos);
    }
  }, [clienteSelected, creditos]);

  useEffect(() => {
    const _clients = creditos.map(({ cliente }) => cliente).filter(Boolean);
    setclientes(_clients || []);
  }, [creditos]);

  const handlePagarCredito = (venta: Venta) => {
    pagarCredito(db, venta.id);
  };
  const eliminarCredito = (venta: Venta) => {
    console.log("pachar");
  };

  const renderItem = ({ item }: { item: Venta }) => {
    return (
      <View style={[styles.itemsCreditos, globalStyles.card]}>
        <View style={styles.rowInfoCliente}>
          <Text style={styles.col}>Nit: {item.cliente.nit} -</Text>
          <Text style={styles.col}>Nombre: {item.cliente.nombre}</Text>
          {!!item.cliente.apellido && (
            <Text style={styles.col}>{item.cliente.apellido}</Text>
          )}
          {!!item.cliente.telefono && (
            <Text style={styles.col}>Tel: {item.cliente.telefono}</Text>
          )}
          {!!item.cliente.direccion && (
            <Text style={styles.col}>Dir: {item.cliente.direccion}</Text>
          )}
        </View>
        <View>
          <FlatList
            data={item.items}
            renderItem={({ item }) => (
              <View style={styles.rowsItems}>
                <Text style={styles.col}>
                  {item.unidades} x {item.nombre}
                </Text>
                <Text style={styles.col}>{item.marca}</Text>
                <Text style={styles.col}>{item.linea}</Text>
                <Text style={styles.col}>Q.{item.precio}</Text>
              </View>
            )}
            keyExtractor={(item) => item.item}
            contentContainerStyle={styles.container}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.col}>Total Credito: Q{item.total}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.opsButton}
              onPress={() => handlePagarCredito(item)}
            >
              <Text>Credito Pago</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: "100%",
        marginTop: 8,
      }}
    >
      <SearchSelect<Cliente>
        placeholder="Buscar Cliente"
        items={clientes}
        onSelect={(cliente) => setClienteSelected(cliente)}
        valueField={"nit"}
      />
      {filteredCreditos && (
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            data={filteredCreditos}
            renderItem={(item) => renderItem(item)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.container}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    flex: 1,
    width: "100%",
  },
  itemsCreditos: {
    borderBottomWidth: 3,
    borderBottomColor: "#f4f4f4",
    borderRadius: 8,
    padding: 10,
    margin: 8,
    width: "100%",
  },
  rowInfoCliente: {
    borderBottomWidth: 1,
    borderBottomColor: "#2196F3",
    paddingVertical: 5,
  },
  rowsItems: {
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#9E9E9E",
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  col: {
    flex: 1,
  },
  opsButton: {
    fontSize: 12,
    marginTop: 15,
    paddingHorizontal: 12,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 15,
    marginRight: 5,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CreditosList;
