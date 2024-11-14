import { Text } from "react-native";
import { Redirect } from "expo-router";

import { useSession } from "../../providers/Session";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Drawer from "expo-router/drawer";
import { useEffect } from "react";
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
import { Collections } from "@/utils/constants";
import { Unsubscribe } from "firebase/firestore";

export default function AppLayout() {
  const { user, isLoading } = useSession();

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
        Collections.proveedores,
        setProveedores,
        dispatch
      )
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            flex: 1,
          },
        }}
      >
        <Drawer.Screen
          name="ventas"
          options={{
            drawerLabel: "Ventas",
            title: "Ventas",
            swipeEnabled: true,
          }}
        />
        <Drawer.Screen
          name="creditos"
          options={{
            drawerLabel: "Creditos",
            title: "Creditos",
            swipeEnabled: true,
          }}
        />

        <Drawer.Screen
          name="reportes"
          options={{
            drawerLabel: "Reportes",
            title: "Reportes",
            swipeEnabled: true,
          }}
        />
        <Drawer.Screen
          name="creacion"
          options={{
            drawerLabel: "Creacion",
            title: "Creacion de Elementos",
            swipeEnabled: true,
          }}
        />
        <Drawer.Screen
          name="inventario"
          options={{
            drawerLabel: "Inventario y edicion",
            title: "Edicion de Elementos",
            swipeEnabled: true,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
