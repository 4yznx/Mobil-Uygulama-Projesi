import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReportsHeader() {
  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.headerTitle}>Gelişmenizi Takip Edin</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#333",
    textAlign: "left",
  },
});
