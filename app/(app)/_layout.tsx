import { Text } from "react-native";
import { Redirect, router, Slot, Stack } from "expo-router";

import { useSession } from "../../providers/Session";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Drawer from "expo-router/drawer";

export default function AppLayout() {
  const { user, isLoading } = useSession();
  console.log("isLoading: ", isLoading);
  console.log("session: ", user);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  console.log("user: ", user);
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="/ventas" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Ventas",
            title: "overview",
          }}
        />
        <Drawer.Screen
          name="config" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "User",
            title: "overview",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
