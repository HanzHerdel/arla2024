import { Text, View } from "react-native";

import { useSession } from "../providers/Session";
import { useFirestore } from "@/providers/Data";
import { useEffect } from "react";

export default function Index() {
  const { signOut } = useSession();
  const { repuestos, loading } = useFirestore();

  const { user, isLoading } = useSession();
  console.log("user: ", user);
  /*   useEffect(() => {
    getRepuestos(); 
  }, []); */

  if (loading) {
    return <p>Loading articles...</p>;
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
