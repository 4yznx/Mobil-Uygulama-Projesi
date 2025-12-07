import React from "react";
import { Text, StyleSheet } from "react-native";

export default function TimerDisplay({ time }) {
  return <Text style={styles.timer}>{time}</Text>;
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 100,
    fontWeight: "700",
    color: "grey",
    marginBottom: 30,
    textAlign: "center",
  },
});
