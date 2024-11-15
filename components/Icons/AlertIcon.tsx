import React, { useEffect, useRef } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AnimatedAlertIconProps {
  onPress: (event: GestureResponderEvent) => void;
  hasAlert?: boolean;
}

const AnimatedAlertIcon: React.FC<AnimatedAlertIconProps> = ({
  onPress,
  hasAlert = false,
}) => {
  // Valor de la animación para el signo de exclamación
  const alertAnimation = useRef(new Animated.Value(1)).current;

  // Efecto para iniciar la animación cuando hasAlert cambia
  useEffect(() => {
    if (hasAlert) {
      // Secuencia de animación: zoom in -> zoom out
      Animated.sequence([
        Animated.timing(alertAnimation, {
          toValue: 1.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(alertAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [hasAlert]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
        <MaterialCommunityIcons name="transfer" size={24} color="black" />

        {hasAlert && (
          <Animated.View
            style={[
              styles.alertContainer,
              {
                transform: [{ scale: alertAnimation }],
              },
            ]}
          >
            <MaterialCommunityIcons
              name="exclamation"
              size={16}
              color="white"
            />
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
  iconContainer: {
    position: "relative",
  },
  alertContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "red",
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AnimatedAlertIcon;
