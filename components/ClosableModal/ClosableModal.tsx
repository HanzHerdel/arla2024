import React, { ReactNode } from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface ClosableModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  // Opcional: props adicionales que podrías querer
  animationType?: "none" | "slide" | "fade";
  contentContainerStyle?: object;
}

const ClosableModal: React.FC<ClosableModalProps> = ({
  visible,
  onClose,
  children,
  animationType = "fade",
  contentContainerStyle,
}) => {
  const handleContentPress = (e: GestureResponderEvent): void => {
    e.stopPropagation();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={handleContentPress}>
            <View style={[styles.modalContent, contentContainerStyle]}>
              <ScrollView>{children}</ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    maxHeight: "90%",
    maxWidth: "90%",
    // Opcional: añadir sombras
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ClosableModal;
