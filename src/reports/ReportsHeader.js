import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReportsHeader({ onClear }) {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.headerTitle}>📊 İstatistikler</Text>
        <Text style={styles.headerSubtitle}>Gelişiminizi takip edin</Text>
      </View>
      <TouchableOpacity onPress={onClear} style={styles.trashButton}>
        <Ionicons name="trash-outline" size={24} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginTop: 20,
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2C3E50",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    marginTop: 5,
  },
  trashButton: {
    padding: 8,
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
  },
});
