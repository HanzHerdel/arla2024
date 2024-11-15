import { crearUsuario } from "@/api/configuracion";
import { useSession } from "@/providers/Session";
import React, { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

const CenteredButton = () => {
  const { signOut } = useSession();

  useEffect(() => {
    signOut();

    return () => {};
  }, []);

  return <View>Chau</View>;
};

const styles = StyleSheet.create({});

export default CenteredButton;
