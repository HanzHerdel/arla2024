import "../gesture-handler";
import { Slot } from "expo-router";
import { SessionProvider } from "../providers/Session";
import { FirestoreProvider } from "../providers/Data";

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <FirestoreProvider>
        <Slot />
      </FirestoreProvider>
    </SessionProvider>
  );
}
