import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getCollectionData } from "@/api/getGenericCollection";
import { db } from "@/configs/firebaseConfig";
import { Clientes } from "@/types";
import useFindClientes from "@/hooks/useFindClientes";

interface ClientsFinderProps {
  onEdit?: (cliente: Clientes) => void;
  onSelect?: (cliente: Clientes) => void;
  onNewClient?: () => void;
}

const ClientsFinder: React.FC<ClientsFinderProps> = ({
  onEdit,
  onSelect,
  onNewClient,
}) => {
  const [searchName, setSearchName] = useState("");
  const [searchNit, setSearchNit] = useState("");
  const clientes = useFindClientes(searchName, searchNit);

  const renderItem = ({ item }: { item: Clientes }) => (
    <View style={styles.clientCard}>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.nombre}</Text>
        <Text style={styles.clientName}>{item.apellido}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Nit: </Text>
          <Text style={styles.value}>{item.nit}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Teléfono: </Text>
          <Text style={styles.value}>{item.telefono}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Dirección: </Text>
          <Text style={styles.value}>{item.direccion}</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        {/* TODO: agregar edicion de clientes        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => onEdit?.(item)}
        >
          <Icon name="edit" size={20} color="#000" />
          <Text style={styles.buttonText}>EDITAR</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.button, styles.selectButton]}
          onPress={() => onSelect?.(item)}
        >
          <Text style={styles.selectButtonText}>SELECCIONAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Nombre"
            value={searchName}
            onChangeText={setSearchName}
          />
        </View>

        <View style={styles.searchBox}>
          <Icon name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Nit Cliente"
            value={searchNit}
            onChangeText={setSearchNit}
          />
        </View>

        <TouchableOpacity style={styles.newButton} onPress={onNewClient}>
          <Text style={styles.newButtonText}>NUEVO</Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={clientes}
        renderItem={(item) => renderItem(item)}
        estimatedItemSize={120}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  newButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  newButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
  clientCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    display: "flex",
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  label: {
    color: "#666",
    fontWeight: "500",
  },
  value: {
    color: "#333",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 5,
  },
  editButton: {
    backgroundColor: "#FFF59D",
  },
  selectButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#000",
    fontWeight: "500",
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default ClientsFinder;
