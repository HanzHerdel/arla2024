import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ViewStyle,
  ListRenderItemInfo,
} from "react-native";
import {
  Searchbar,
  List,
  Surface,
  Text,
  useTheme,
  TouchableRipple,
  Divider,
  IconButton,
} from "react-native-paper";

// Tipo genérico para permitir cualquier objeto
type ItemType = Record<string, any>;

interface SearchSelectProps<T extends ItemType> {
  items: T[];
  onSelect: (item: T | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  maxHeight?: number;
  value?: T | null;
  labelField?: keyof T;
  valueField?: keyof T;
  allowDeselect?: boolean;
}

export const SearchSelect = <T extends ItemType>({
  items,
  onSelect,
  placeholder = "Buscar...",
  label,
  error,
  maxHeight = 400,
  value,
  labelField = "nombre" as keyof T,
  valueField = "id" as keyof T,
  allowDeselect = true,
}: SearchSelectProps<T>) => {
  const [searchText, setSearchText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const theme = useTheme();

  const filteredItems = items.filter((item) =>
    String(item[labelField]).toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = useCallback(
    (item: T) => {
      // Si el item seleccionado es el mismo que el valor actual y allowDeselect es true,
      // deseleccionamos el item
      if (allowDeselect && value && item[valueField] === value[valueField]) {
        setSearchText("");
        onSelect(null);
      } else {
        setSearchText(String(item[labelField]));
        onSelect(item);
      }
      setShowOptions(false);
    },
    [onSelect, value, labelField, valueField, allowDeselect]
  );

  const clearSelection = useCallback(() => {
    setSearchText("");
    onSelect(null);
  }, [onSelect]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<T>) => (
      <TouchableRipple
        onPress={() => handleSelect(item)}
        rippleColor={theme.colors.primary}
      >
        <List.Item
          title={String(item[labelField])}
          titleStyle={[
            styles.itemText,
            value?.[valueField] === item[valueField] && styles.selectedItemText,
          ]}
          style={[
            styles.item,
            value?.[valueField] === item[valueField] && {
              backgroundColor: theme.colors.primaryContainer,
            },
          ]}
          left={(props) =>
            value?.[valueField] === item[valueField] ? (
              <List.Icon {...props} icon="check" color={theme.colors.primary} />
            ) : null
          }
        />
      </TouchableRipple>
    ),
    [handleSelect, value, labelField, valueField, theme.colors]
  );

  const keyExtractor = useCallback(
    (item: T, idx: number) => String(item[valueField] + item[labelField] + idx),
    [valueField]
  );

  return (
    <View style={[styles.container]}>
      {label && (
        <Text
          variant="labelLarge"
          style={[
            styles.label,
            { color: error ? theme.colors.error : theme.colors.onSurface },
          ]}
        >
          {label}
        </Text>
      )}

      <Surface style={styles.inputContainer} elevation={1}>
        <Searchbar
          placeholder={placeholder}
          onChangeText={(text) => {
            setSearchText(text);
            setShowOptions(true);
          }}
          value={searchText}
          onFocus={() => setShowOptions(true)}
          style={[
            styles.searchbar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: error ? theme.colors.error : theme.colors.outline,
            },
          ]}
          right={() => (
            <View style={styles.rightIconsContainer}>
              {value && allowDeselect && (
                <IconButton
                  icon="close"
                  size={20}
                  onPress={clearSelection}
                  style={styles.clearButton}
                />
              )}
              <List.Icon
                icon={showOptions ? "chevron-up" : "chevron-down"}
                color={theme.colors.onSurface}
              />
            </View>
          )}
          iconColor={theme.colors.primary}
        />

        {showOptions && (
          <Surface style={[styles.dropdown, { maxHeight }]} elevation={2}>
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ItemSeparatorComponent={Divider}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={() => (
                <List.Item
                  title="No se encontraron resultados"
                  titleStyle={styles.emptyText}
                />
              )}
            />
          </Surface>
        )}
      </Surface>

      {error && (
        <Text
          variant="bodySmall"
          style={[styles.error, { color: theme.colors.error }]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginTop: 0,
    zIndex: 1,
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    borderRadius: 8,
    overflow: "visible",
  },
  searchbar: {
    elevation: 0,
    borderWidth: 1,
    borderRadius: 8,
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearButton: {
    margin: 0,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 2,
  },
  item: {
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 14,
  },
  selectedItemText: {
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
  },
  error: {
    marginTop: 4,
  },
});

export default SearchSelect;
