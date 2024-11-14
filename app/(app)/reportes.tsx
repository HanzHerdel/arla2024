import { processRevertSell } from "@/api/processRevertSell";
import { getUsuarios } from "@/api/user";
import { getVentas } from "@/api/ventas";
import DatePickerComponent, {
  TiempoPicker,
} from "@/components/DatePickers/RangePickers";
import GenericSelect from "@/components/Select/SelectGeneric";
import { db } from "@/configs/firebaseConfig";
import { Usuario, Venta } from "@/types";
import { getDateString } from "@/utils/dates";
import { globalStyles } from "@/utils/styles";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSession } from "../../providers/Session";

const Reporte: React.FC = () => {
  /** estados del datePicker */
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [horaInicio, setHorasInicio] = useState<TiempoPicker>({
    hours: 0,
    minutes: 0,
  });
  const { user } = useSession();
  const [usuarios, setusuarios] = useState<Usuario[]>([]);

  const [horaFin, setHorasFin] = useState<TiempoPicker>({
    hours: 23,
    minutes: 59,
  });

  /** Fin estados del picker */
  const [ventas, setVentas] = useState<Venta[] | null>(null);
  const [selectedUser, setselectedUser] = useState<Usuario | null>(null);

  const handleSelectUser = (user: Usuario | null) => {
    setselectedUser(user);
  };

  const obtenerFechas = () => {
    const dateTimeInicio = new Date(fechaInicio);
    dateTimeInicio.setHours(horaInicio.hours);
    dateTimeInicio.setMinutes(horaInicio.minutes);
    const dateTimeFin = new Date(fechaFin);
    dateTimeFin.setHours(horaFin.hours);
    dateTimeFin.setMinutes(horaFin.minutes);
    return { dateTimeInicio, dateTimeFin };
  };
  useEffect(() => {
    const { dateTimeInicio, dateTimeFin } = obtenerFechas();
    getVentas(db, setVentas, dateTimeInicio, dateTimeFin, selectedUser?.id);
  }, [fechaFin, fechaFin, horaInicio, horaFin, selectedUser]);

  useEffect(() => {
    getUsuarios(db, setusuarios);
  }, []);

  const onEliminarVenta = async (venta: Venta) => {
    if (!user) {
      console.log("no es posible eliminar venta sin usuario");
      return;
    }
    const success = await processRevertSell(db, venta.id, user);
    if (success) {
      const { dateTimeInicio, dateTimeFin } = obtenerFechas();
      getVentas(db, setVentas, dateTimeInicio, dateTimeFin, selectedUser?.id);
    }
  };

  const renderItem = ({ item }: { item: Venta }) => {
    return (
      <View style={globalStyles.card}>
        {item.cliente && (
          <View style={styles.rowInfoCliente}>
            <Text style={styles.col}>
              <Text style={styles.label}>Cliente Id:</Text> {item.cliente.nit}
            </Text>
            <Text style={styles.col}>
              <Text style={styles.label}>Nombre:</Text> {item.cliente.nombre}
            </Text>
            <Text style={styles.col}>{item.cliente.apellido}</Text>
            <Text style={styles.col}>
              <Text style={styles.label}>Tel:</Text> {item.cliente.telefono}
            </Text>
            <Text style={styles.col}>
              <Text style={styles.label}>Dir:</Text> {item.cliente.direccion}
            </Text>
          </View>
        )}
        {item.items.map((item, itemIndex) => (
          <View key={itemIndex} style={styles.rowsItems}>
            <Text style={styles.colLarge}>{item.nombre}</Text>
            {item.modelo && (
              <Text style={styles.hiddenSm}>Modelo: {item.modelo}</Text>
            )}
            <Text style={styles.colSmall}>{item.marca}</Text>
            <Text style={styles.colSmall}>{item.linea}</Text>
            <Text style={styles.colMedium}>
              Q. {item.precio} x {item.unidades}
            </Text>
            <Text style={styles.colMedium}>
              = {item.precio * item.unidades}
            </Text>
          </View>
        ))}
        <View style={styles.row}>
          <Text style={styles.rowInfoCliente}>
            <Text style={styles.label}>Vendedor:</Text>{" "}
            {item.vendedor?.nombre || "NA"}
            <Text style={styles.label}> Fecha:</Text>{" "}
            {getDateString(item.fecha as Timestamp)}
          </Text>
          <TouchableOpacity
            onPress={() => onEliminarVenta(item)}
            style={{
              backgroundColor: "#841584",
              padding: 10,
              marginHorizontal: 16,
              borderRadius: 5,
              marginVertical: 8,
              alignItems: "center",
            }}
            activeOpacity={0.7} // Opacidad al presionar
          >
            <Text style={{ color: "white", fontSize: 16 }}>Eliminar</Text>
          </TouchableOpacity>

          <Text style={styles.total}>
            <Text style={styles.label}>Total: Q.</Text> {item.total}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <GenericSelect<Usuario>
          data={usuarios}
          onChange={(e) => handleSelectUser(e)}
        />
        <DatePickerComponent
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
          horaInicio={horaInicio}
          setHorasInicio={setHorasInicio}
          horaFin={horaFin}
          setHorasFin={setHorasFin}
        />
      </View>
      <FlatList
        data={ventas}
        renderItem={(item) => renderItem(item)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  rowInfoCliente: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#b6cbdc",
    paddingBottom: 8,
    color: "gray",
    fontStyle: "italic",
  },
  rowsItems: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#b6cbdc",
    fontSize: 12,
    paddingVertical: 4,
  },
  col: {
    flex: 1,
    marginHorizontal: 2,
  },
  colLarge: {
    flex: 2,
  },
  hiddenSm: {
    flex: 1,
    display: "none", // Personaliza esta propiedad si quieres que se oculte en pantallas pequeñas
  },
  colSmall: {
    flex: 0.7,
  },
  colMedium: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    fontWeight: "bold",
    fontSize: 12,
  },
  total: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
  },
});

export default Reporte;
