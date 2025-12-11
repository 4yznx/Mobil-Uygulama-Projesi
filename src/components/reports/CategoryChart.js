import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export default function CategoryChart({ data, hasData }) {
  return (
    <View style={[styles.chartContainer, { marginBottom: 40 }]}>
      <Text style={styles.sectionTitle}>Kategori Dağılımı (dk)</Text>

      {hasData ? (
        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="pie-chart-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>Henüz veri yok</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    padding: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
  },
});
