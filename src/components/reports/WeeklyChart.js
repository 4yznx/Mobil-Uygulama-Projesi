import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function WeeklyChart({ data }) {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>📅 Son 7 Günlük Aktivite</Text>

      <BarChart
        data={data}
        width={screenWidth - 60}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" dk"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
          barPercentage: 0.7,
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#f0f0f0",
          },
        }}
        style={styles.chartStyle}
        showValuesOnTopOfBars={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495E",
    marginBottom: 15,
  },
  chartStyle: {
    borderRadius: 16,
    paddingRight: 30,
  },
});
