import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  card: {
    borderBottomWidth: 3,
    borderBottomColor: "#f4f4f4",
    borderRadius: 8,
    padding: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    margin: 8,
    width: "96%",
  },
  flexBoxRow: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
