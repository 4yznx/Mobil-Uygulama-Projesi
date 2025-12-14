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
        style={[styles.btn, isRunning && styles.disabledBtn]}
        onPress={onStart}
        disabled={isRunning}
      >
        <Ionicons name="play" size={20} color="#4CAF50" />
        <Text style={[styles.btnText, { color: "#4CAF50" }]}>Başlat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, !isRunning && styles.disabledBtn]}
        onPress={onPause}
        disabled={!isRunning}
      >
        <Ionicons name="pause" size={20} color="#FFB300" />
        <Text style={[styles.btnText, { color: "#FFB300" }]}>Duraklat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onReset}>
        <Ionicons name="refresh" size={20} color="#F44336" />
        <Text style={[styles.btnText, { color: "#F44336" }]}>Sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    width: "100%",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,

    flex: 1,
    maxWidth: 110,
  },
  disabledBtn: {
    opacity: 0.5,
    backgroundColor: "#f9f9f9",
  },
  btnText: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 5,
  },
});
