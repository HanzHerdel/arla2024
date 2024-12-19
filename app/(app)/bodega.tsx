import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import ResponsiveTable from "@/components/Table/Table";
import { Repuesto } from "@/types";
import { columnsVentas } from "@/components/Table/utils/columns";
import RepuestoForm from "@/components/Forms/RepuestosForm/RepuestosForm";
import SearchBarRepuestos from "@/components/SearchRepuestosBar/SearchRepuestosBar";
import RepuestoDetail from "@/components/Details/Details";
import TrasladoModal from "@/components/ModalTraslado/ModalTraslado";
import { Ubicacion } from "@/utils/constants";

const BodegaScreen: React.FC = ({}) => {
  const [searchResults, setsearchResults] = useState<Repuesto[]>([]);
  const [repuestoSeleccionado, setrepSelected] = useState<Repuesto | null>(
    null
  );
  console.log("repuestoSeleccionado: ", repuestoSeleccionado);
  const handleSelectItem = (item: Repuesto | null) => {
    console.log("item: ", item);
    setrepSelected(item);
  };
  const [modalTraslado, setModalTrasladoVisible] = useState<boolean>(false);

  const handleConfirm = (data: any): void => {
    console.log("Traslado:", data);
    // Manejar el traslado aquí
  };
  return (
    <View style={{ flex: 1 }}>
      <SearchBarRepuestos setRepuestos={setsearchResults}>
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
        {repuestoSeleccionado && (
          <View>
            <RepuestoDetail
              repuesto={repuestoSeleccionado}
              onClose={() => setrepSelected(null)}
              setModalVisible={setModalTrasladoVisible}
            />
          </View>
        )}
        {/*         <ClosableModal
          onClose={() => setrepSelected(null)}
          visible={!!repSelected}
        >
        </ClosableModal> */}
      </SearchBarRepuestos>

      {repuestoSeleccionado && (
        <TrasladoModal
          visible={modalTraslado}
          onDismiss={() => setModalTrasladoVisible(false)}
          repuesto={repuestoSeleccionado}
          ubicacionOrigen={Ubicacion.bodega}
          closeModal={() => setModalTrasladoVisible(false)}
        />
      )}
    </View>
  );
};

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

export default BodegaScreen;
