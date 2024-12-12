import "../gesture-handler";
import { Slot } from "expo-router";
import { SessionProvider } from "../providers/Session";
import { FirestoreProvider } from "../providers/Data";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Provider as PaperProvider, Snackbar } from "react-native-paper";
import { useState } from "react";
import { SnackbarProvider } from "@/providers/Snackbar";

export default function Root() {
  const [visible, setVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <FirestoreProvider>
          <Provider store={store}>
            <PaperProvider>
              <SnackbarProvider>
                <Slot />
              </SnackbarProvider>
            </PaperProvider>
          </Provider>
        </FirestoreProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
