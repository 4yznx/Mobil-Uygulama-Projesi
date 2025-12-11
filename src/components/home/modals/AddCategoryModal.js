import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function AddCategoryModal({ visible, onClose, onAdd }) {
  const [text, setText] = useState("");

  const handleSave = () => {
    if (text.trim().length > 0) {
      onAdd(text.trim());
      setText("");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Yeni Kategori Ekle</Text>

          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            autoFocus={visible}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelBtn]}
              onPress={onClose}
            >
              <Text style={styles.btnTxt}>İptal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.saveBtn]}
              onPress={handleSave}
            >
              <Text style={[styles.btnTxt, { color: "white" }]}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  modalButtons: { flexDirection: "row", gap: 10 },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  cancelBtn: { backgroundColor: "#eee" },
  saveBtn: { backgroundColor: "#4CAF50" },
  btnTxt: { fontWeight: "600" },
});
