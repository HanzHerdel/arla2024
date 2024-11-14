import "../gesture-handler";
import { Slot } from "expo-router";
import { SessionProvider } from "../providers/Session";
import { FirestoreProvider } from "../providers/Data";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Provider as PaperProvider } from "react-native-paper";
export default function Root() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <SessionProvider>
          <FirestoreProvider>
            <PaperProvider>
              <Slot />
            </PaperProvider>
          </FirestoreProvider>
        </SessionProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
