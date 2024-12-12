import { FlexStyle, Text, TouchableOpacity } from "react-native";
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
import {
  Collections,
  EstadoTraslado,
  PageKey,
  PageKeys,
} from "@/utils/constants";
import { Unsubscribe } from "firebase/firestore";
import { setTraslados, useTraslados } from "@/store/trasladosSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnimatedAlertIcon from "@/components/Icons/AlertIcon";
import { Traslados } from "@/types";
import { PAGES } from "../../utils/constants";

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
  }, [traslados, user]);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Cargando...</Text>;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  const isUserAllowed = (page: PageKey) => {
    const pageUsersAllowed = PAGES[page]["usuarios"];
    return pageUsersAllowed.some((userType) => userType === user?.ubicacion);
  };

  const getAccess = (page: PageKey): FlexStyle => {
    if (user.superUser) return { display: "flex" };
    console.log("user: ", user);

    const userIsAllowed = isUserAllowed(page);
    if (userIsAllowed) {
      return { display: "flex" };
    }
    return { display: "none" };
  };

  const needsRedirection = (page: PageKey): boolean => {
    console.log("user.sueprUser: ", user.superUser);
    if (user.superUser) return false;
    const needsRedirection = !isUserAllowed(page);
    return needsRedirection;
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            flex: 1,
          },
          headerRight: () => (
            <AnimatedAlertIcon
              hasAlert={!!filteredTraslados.length}
              onPress={() => {
                router.navigate("/traslados" as Href);
              }}
            />
          ),
        }}
      >
        <Drawer.Screen
          name="ventas"
          redirect={needsRedirection(PageKeys.ventas)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.ventas) },
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
          redirect={needsRedirection(PageKeys.creditos)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.creditos) },
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
          redirect={needsRedirection(PageKeys.reportes)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.reportes) },
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
          redirect={needsRedirection(PageKeys.creacion)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.creacion) },
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
          redirect={needsRedirection(PageKeys.inventario)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.inventario) },
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
          redirect={needsRedirection(PageKeys.bodega)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.bodega) },
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
          redirect={needsRedirection(PageKeys.bitacora)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.bitacora) },
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
