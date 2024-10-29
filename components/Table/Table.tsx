import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Animated,
  PanResponder,
  ScrollView,
  GestureResponderEvent,
  PanResponderGestureState,
  Pressable,
} from "react-native";
import { Icon, Text } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { RepuestoCart, Repuestos } from "@/types";
import { Column } from "./utils/columns";

interface ResponsiveTableProps {
  items: Repuestos[];
  columns: Column[];
  onIncrement?: (item: RepuestoCart | Repuestos) => void;
  onDecrement?: (item: RepuestoCart) => void;
  handleSelect?: (item: Repuestos) => void;
  style?: any;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  items,
  columns,
  onIncrement,
  onDecrement,
  handleSelect = () => {},
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isScrolling, setIsScrolling] = useState(false);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {columns.map((column) => (
        <View
          key={column.id}
          style={[
            styles.headerCell,
            column.flex ? { flex: column.flex } : {},
            column.width ? { width: column.width } : {},
          ]}
        >
          <Text style={styles.headerText}>{column.title}</Text>
        </View>
      ))}
      <View style={styles.actionsHeader}>
        <Text style={styles.headerText}>Acciones</Text>
      </View>
    </View>
  );

  const renderRow = (item: Repuestos, index: number) => (
    <View
      key={item.id + index}
      style={[
        styles.rowContainer,
        index % 2 === 0 ? styles.evenRow : styles.oddRow,
      ]}
    >
      <Pressable
        key={item.id}
        onPress={() => handleSelect(item)}
        // @ts-ignore: not sure why is showing error but display contents helps making the presable contain the fields without affecting the ui
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "darkblue" : "",
            padding: 0,
            display: "contents",
          },
        ]}
      >
        {columns.map((column) => (
          <View
            key={column.id}
            style={[
              styles.cell,
              {
                padding: 0,
                flex: column.flex,
                ...(column.flex ? { flex: column.flex } : {}),
                ...(column.width ? { width: column.width } : {}),
              },
            ]}
          >
            <Text style={styles.cellText} numberOfLines={2}>
              {column.render(item)}
            </Text>
          </View>
        ))}
      </Pressable>
      <View style={styles.actionsCell}>
        <TouchableOpacity
          onPress={() => onDecrement?.(item as RepuestoCart)}
          style={[styles.actionButton, styles.decrementButton]}
        >
          <Icon name="remove" type="material" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onIncrement?.(item)}
          style={[styles.actionButton, styles.incrementButton]}
        >
          <Icon name="add" type="material" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsScrolling(true);
      },
      onPanResponderMove: Animated.event([null, { dx: scrollX }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        setIsScrolling(false);
      },
    })
  ).current;

  return (
    <View
      style={[styles.container, { flex: 1, flexGrow: 1, maxHeight: "auto" }]}
    >
      {renderHeader()}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item, index) => renderRow(item, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 12,
  },
  rowContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
    alignItems: "center",
  },
  headerCell: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  actionsHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  cellText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  decrementButton: {
    backgroundColor: "#ff4444",
  },
  incrementButton: {
    backgroundColor: "#00C851",
  },
  evenRow: {
    backgroundColor: "#f9fff9",
  },
  oddRow: {
    backgroundColor: "#f0f8ff",
  },
});

export default ResponsiveTable;
