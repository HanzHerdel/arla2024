import { Text, TouchableOpacity } from "react-native";
import { Href, Redirect, router } from "expo-router";

import { useSession } from "../../providers/Session";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Drawer from "expo-router/drawer";
import { useEffect, useState } from "react";
import { subscribeDataForRedux } from "@/api/getGenericCollections";
import { db } from "@/configs/firebaseConfig";
import { useDispatch } from "react-redux";
import {
  setCategorias,
  setEstaciones,
  setLineas,
  setMarcas,
  setProveedores,
  setUsuarios,
} from "@/store/elementosSlice";
import { Collections, EstadoTraslado } from "@/utils/constants";
import { Unsubscribe } from "firebase/firestore";
import { setTraslados, useTraslados } from "@/store/trasladosSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnimatedAlertIcon from "@/components/Icons/AlertIcon";
import { Traslados } from "@/types";

export default function AppLayout() {
  const { user, isLoading } = useSession();
  console.log("user: ", user?.ubicacion);
  const [filteredTraslados, setFilteredTraslados] = useState<Traslados[]>([]);

  const dispatch = useDispatch();
  /** Effect to get all elementos (not repuestos nor ventas) */
  useEffect(() => {
    const unsubs: Array<Unsubscribe> = [];
    unsubs.push(
      subscribeDataForRedux(db, Collections.users, setUsuarios, dispatch)
    );
    unsubs.push(
      subscribeDataForRedux(db, Collections.estaciones, setEstaciones, dispatch)
    );
    unsubs.push(
      subscribeDataForRedux(db, Collections.marcas, setMarcas, dispatch)
    );
    unsubs.push(
      subscribeDataForRedux(db, Collections.categorias, setCategorias, dispatch)
    );
    unsubs.push(
      subscribeDataForRedux(db, Collections.lineas, setLineas, dispatch)
    );
    unsubs.push(
      subscribeDataForRedux(
        db,
        Collections.solicitudTraslado,
        setTraslados,
        dispatch,
        "fechaInicio"
      )
    );
    unsubs.push(
      subscribeDataForRedux(
        db,
        Collections.proveedores,
        setProveedores,
        dispatch
      )
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  const traslados = useTraslados();
  console.log("traslados: ", traslados);

  useEffect(() => {
    const trasladosPendientes = traslados.filter(
      (t) => t.estado === EstadoTraslado.pendiente
    );
    if (!user?.ubicacion) {
      setFilteredTraslados(trasladosPendientes);
      return;
    }
    const trasladosDeUbicacion = trasladosPendientes.filter(
      (t) => t.ubicacion === user.ubicacion
    );
    setFilteredTraslados(trasladosDeUbicacion);
  }, [traslados]);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }
  const [showAlert, setShowAlert] = useState(true);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            flex: 1,
          },
          headerRight: () => (
            /*             <TouchableOpacity
              onPress={() => { }}
              style={{ marginRight: 15 }}
            >
              <MaterialCommunityIcons name="transfer" size={24} color="black" />
            </TouchableOpacity> */
            <AnimatedAlertIcon
              hasAlert={!!filteredTraslados.length}
              onPress={() => {
                router.navigate("/traslados" as Href);
                // Tu lógica aquí
                // setShowAlert(false);
              }}
            />
          ),
        }}
      >
        <Drawer.Screen
          name="ventas"
          options={{
            drawerLabel: "Ventas",
            title: "Ventas",
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="cash-register"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="creditos"
          options={{
            drawerLabel: "Creditos",
            title: "Creditos",
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="credit-card"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="reportes"
          options={{
            drawerLabel: "Reportes",
            title: "Reportes",
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="file-chart"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="creacion"
          options={{
            drawerLabel: "Creacion",
            title: "Creacion de Elementos",
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="plus-circle"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="inventario"
          options={{
            drawerLabel: "Inventario y edicion",
            title: "Edicion de Elementos",
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="clipboard-list"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="bodega"
          options={{
            drawerLabel: "Bodega",
            title: "Bodega",
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="warehouse"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="traslados"
          options={{
            drawerLabel: "Traslados",
            title: "Traslados",
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="transfer"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="bitacora"
          options={{
            drawerLabel: "BItacora",
            title: "Bitacora",
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="history"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="logout"
          options={{
            title: "Salir",
            drawerLabel: "Salir",
            drawerIcon: ({ focused, color, size }) => (
              <TouchableOpacity
                onPress={() => {
                  console.log("logout");
                }}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={size}
                  color={color}
                />
              </TouchableOpacity>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
