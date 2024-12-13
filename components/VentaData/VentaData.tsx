import React, { Component } from "react";
import { View } from "react-native";
import { Card, Text, DataTable } from "react-native-paper";

import { getDateString } from "@/utils/dates";
import { Venta } from "../../types";
import { ScrollView } from "react-native-gesture-handler";

import { Timestamp } from "firebase/firestore";
import { PropsWithChildren } from "react";

interface VentasListProps extends PropsWithChildren {
  venta: Venta;
}

const VentaData: React.FC<VentasListProps> = ({ venta }) => {
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title style={{ flex: 3 }}>Nombre</DataTable.Title>
        <DataTable.Title style={{ flex: 1 }}>Marca</DataTable.Title>
        <DataTable.Title style={{ flex: 1 }}>Línea</DataTable.Title>
        <DataTable.Title style={{ flex: 1 }}>Modelo</DataTable.Title>
        <DataTable.Title numeric style={{ flex: 0.5 }}>
          Unidades
        </DataTable.Title>
        <DataTable.Title numeric style={{ flex: 0.5 }}>
          Precio
        </DataTable.Title>
        <DataTable.Title numeric style={{ flex: 1 }}>
          Total
        </DataTable.Title>
      </DataTable.Header>

      {venta.items.map((item, itemIndex) => (
        <DataTable.Row key={itemIndex}>
          <DataTable.Cell style={{ flex: 3 }}>{item.nombre}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.marca}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.linea}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.modelo}</DataTable.Cell>
          <DataTable.Cell numeric style={{ flex: 0.5 }}>
            {item.unidades}
          </DataTable.Cell>
          <DataTable.Cell numeric style={{ flex: 0.5 }}>
            ${item.precio}
          </DataTable.Cell>
          <DataTable.Cell numeric style={{ flex: 1 }}>
            ${(item.unidades * item.precio).toFixed(2)}
          </DataTable.Cell>
        </DataTable.Row>
      ))}

      {/* Fila de Total Global */}
      <DataTable.Row>
        <DataTable.Cell numeric>
          <Text variant="titleMedium">Total: ${venta.total.toFixed(2)}</Text>
        </DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
};

export default VentaData;
