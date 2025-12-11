import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatCard({ title, value, icon, color }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={18} color={color} />
        <Text style={styles.statLabel}>{title}</Text>
      </View>

      <View style={[styles.valueBox, { backgroundColor: color + "15" }]}>
        <Text style={[styles.statValue, { color: color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    width: "31%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
    justifyContent: "space-between",
    height: 110,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginLeft: 4,
  },
  valueBox: {
    width: "100%",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
