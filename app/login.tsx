import { loginWithFirebase, useSession } from "@/providers/Session";
import { setUser } from "@/store/userSlice";

import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useContext from "react";
import { getUsuarioById } from "@/api/user";
import { db } from "@/configs/firebaseConfig";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser } = useSession();

  const handleLogin = async () => {
    if (email && password) {
      const user = await loginWithFirebase(email, password);
      if (user) {
        setUser(user);
      }
      console.log("user: ", user);
    } else {
      console.log("Error", "Porfavor llene todos los campos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#87CEEB",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#fff",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
});

export default LoginScreen;
