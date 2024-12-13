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
import { subscribeTraslados } from "@/api/subscribeTrasladosForRedux";

export default function AppLayout() {
  const { user, isLoading } = useSession();

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
    unsubs.push(subscribeTraslados(db, dispatch));
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

  useEffect(() => {
    if (!user) return;
    if (user?.superUser) {
      setFilteredTraslados(traslados);
      return;
    }
    const trasladosPendientes = traslados.filter(
      (t) => t.estado === EstadoTraslado.pendiente
    );
    const trasladosEnProgreso = traslados.filter(
      (t) => t.estado === EstadoTraslado.enProgreso
    );

    const trasladosDesdeUbicacionUrs = trasladosPendientes.filter(
      (t) => t.ubicacion === user.ubicacion
    );

    const trasladosPorRecebirUsr = trasladosEnProgreso.filter(
      (t) => t.destino === user.ubicacion
    );
    setFilteredTraslados([
      ...trasladosDesdeUbicacionUrs,
      ...trasladosPorRecebirUsr,
    ]);
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
          name={PAGES.ventas.nombre}
          redirect={needsRedirection(PageKeys.ventas)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.ventas) },
            drawerLabel: PAGES.ventas.title,
            title: PAGES.ventas.title,
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cart" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name={PAGES.caja.nombre}
          redirect={needsRedirection(PageKeys.caja)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.caja) },
            drawerLabel: PAGES.caja.title,
            title: PAGES.caja.title,
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
          name={PAGES.creditos.nombre}
          redirect={needsRedirection(PageKeys.creditos)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.creditos) },
            drawerLabel: PAGES.creditos.title,
            title: PAGES.creditos.title,
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
          name={PAGES.reportes.nombre}
          redirect={needsRedirection(PageKeys.reportes)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.reportes) },
            drawerLabel: PAGES.reportes.title,
            title: PAGES.reportes.title,
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
          name={PAGES.creacion.nombre}
          redirect={needsRedirection(PageKeys.creacion)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.creacion) },
            drawerLabel: PAGES.creacion.title,
            title: PAGES.creacion.title,
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
          name={PAGES.inventario.nombre}
          redirect={needsRedirection(PageKeys.inventario)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.inventario) },
            drawerLabel: PAGES.inventario.title,
            title: PAGES.inventario.title,
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
          name={PAGES.despacho.nombre}
          redirect={needsRedirection(PageKeys.despacho)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.despacho) },
            drawerLabel: PAGES.despacho.title,
            title: PAGES.despacho.title,
            swipeEnabled: true,
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="package-up"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name={PAGES.bodega.nombre}
          redirect={needsRedirection(PageKeys.bodega)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.bodega) },
            drawerLabel: PAGES.bodega.title,
            title: PAGES.bodega.title,
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
          name={PAGES.traslados.nombre}
          options={{
            drawerLabel: PAGES.traslados.title,
            title: PAGES.traslados.title,
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
          name={PAGES.bitacora.nombre}
          redirect={needsRedirection(PageKeys.bitacora)}
          options={{
            drawerItemStyle: { ...getAccess(PageKeys.bitacora) },
            drawerLabel: PAGES.bitacora.title,
            title: PAGES.bitacora.title,
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
