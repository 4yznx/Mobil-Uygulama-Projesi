import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ControlButtons({
  isRunning,
  onStart,
  onPause,
  onReset,
}) {
  return (
    <View style={styles.buttons}>
      <TouchableOpacity
        style={[styles.btn, styles.startBtn, isRunning && { opacity: 0.4 }]}
        onPress={onStart}
        disabled={isRunning}
      >
        <Ionicons name="play-circle" size={28} color="white" />
        <Text style={styles.btnText}>Başlat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.pauseBtn, !isRunning && { opacity: 0.4 }]}
        onPress={onPause}
        disabled={!isRunning}
      >
        <Ionicons name="pause-circle" size={28} color="white" />
        <Text style={styles.btnText}>Duraklat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.resetBtn]} onPress={onReset}>
        <Ionicons name="refresh-circle" size={28} color="white" />
        <Text style={styles.btnText}>Sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    gap: 3,
    marginTop: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 50,
    minWidth: 120,
    justifyContent: "center",
  },
  startBtn: { backgroundColor: "#4CAF50" },
  pauseBtn: { backgroundColor: "#FFB300" },
  resetBtn: { backgroundColor: "#F44336" },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
