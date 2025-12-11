import React from "react";
import { Text, StyleSheet } from "react-native";

export default function TimerDisplay({ time }) {
  return <Text style={styles.timer}>{time}</Text>;
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 90,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 0,
    textAlign: "center",
    letterSpacing: 2,
  },
});
