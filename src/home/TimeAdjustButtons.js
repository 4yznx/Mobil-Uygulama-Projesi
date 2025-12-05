import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TimeAdjustButtons({
  onIncrease,
  onDecrease,
  disabled,
}) {
  return (
    <View style={styles.adjustRow}>
      <TouchableOpacity
        style={[styles.adjustBtn, disabled && { opacity: 0.5 }]}
        onPress={onDecrease}
        disabled={disabled}
      >
        <Ionicons name="remove-circle-outline" size={36} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.adjustBtn, disabled && { opacity: 0.5 }]}
        onPress={onIncrease}
        disabled={disabled}
      >
        <Ionicons name="add-circle-outline" size={36} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  adjustRow: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 30,
  },
  adjustBtn: {
    backgroundColor: "#e9e9e9",
    padding: 15,
    borderRadius: 50,
  },
});
