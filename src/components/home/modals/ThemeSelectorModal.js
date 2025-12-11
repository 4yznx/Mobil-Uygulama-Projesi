import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ThemeSelectorModal({
  visible,
  onClose,
  onSelect,
  currentTheme,
}) {
  const colorPalette = [
    "#A5D6A7",
    "#FFCC80",
    "#90CAF9",
    "#CE93D8",
    "#E6EE9C",
    "#EF9A9A",
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.colorModalContent}>
          <Text style={styles.modalTitle}>Themes</Text>
          <View style={styles.colorGrid}>
            {colorPalette.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: color,
                    borderWidth: currentTheme === color ? 3 : 1,
                    borderColor: currentTheme === color ? "#555" : "#ddd",
                  },
                ]}
                onPress={() => {
                  onSelect(color);
                  onClose();
                }}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  colorModalContent: {
    backgroundColor: "white",
    width: "80%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  colorCircle: { width: 45, height: 45, borderRadius: 25, elevation: 2 },
});
