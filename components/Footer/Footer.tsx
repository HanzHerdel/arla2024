import React, { useState, ReactNode, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

interface ExpandableFooterProps {
  isExpanded?: boolean;
  title?: string;
  children: ReactNode;
  handleTouchFooter: () => void;
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ExpandableFooter: React.FC<ExpandableFooterProps> = ({
  isExpanded = false,
  title = "Seleccionar Cliente",
  children,
  handleTouchFooter,
}) => {
  const [contentHeight, setContentHeight] = useState(isExpanded ? 400 : 36);
  console.log("contentHeight: ", contentHeight);

  useEffect(() => {
    setContentHeight(isExpanded ? 400 : 36);
  }, [isExpanded]);

  return (
    <View
      style={[styles.container, { height: contentHeight }]}
      pointerEvents="box-none"
    >
      <TouchableHighlight
        id={"touchableHeaderFooter123"}
        style={styles.header}
        onPress={handleTouchFooter}
      >
        <Text style={styles.headerText}>{title}</Text>
      </TouchableHighlight>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#40B3DF",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
});

export default ExpandableFooter;
