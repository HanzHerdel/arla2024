import { Venta } from "@/types";
import { getDateString } from "@/utils/dates";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { List } from "react-native-paper";

interface SalesListProps {
  sale: Venta;
}

const SalesList: React.FC<SalesListProps> = ({ sale }) => {
  console.log("sale: ", sale);

  return (
    <List.Section>
      {/* Cliente Name */}
      <List.Subheader>Cliente: {sale.cliente.nombre}</List.Subheader>

      {/* Items List */}
      <List.Accordion
        title="Items"
        left={(props) => <List.Icon {...props} icon="folder" />}
      >
        {sale.items.map((item, index) => (
          <List.Item key={index} title={item.nombre} />
        ))}
      </List.Accordion>

      {/* Additional Details */}
      <List.Item
        title="Fecha"
        description={getDateString(sale.fecha as Timestamp)}
        left={(props) => <List.Icon {...props} icon="calendar" />}
      />
      <List.Item
        title="Vendedor"
        description={sale.vendedor.nombre}
        left={(props) => <List.Icon {...props} icon="account" />}
      />
    </List.Section>
  );
};

export default SalesList;
