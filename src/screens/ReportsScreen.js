import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getSessions } from "../services/database";
import { useTheme } from "../context/ThemeContext";

import StatCard from "../components/reports/StatCard";
import WeeklyChart from "../components/reports/WeeklyChart";
import CategoryChart from "../components/reports/CategoryChart";
import ReportsHeader from "../components/reports/ReportsHeader";

export default function ReportsScreen() {
  const { themeColor } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    todayFocus: 0,
    totalFocus: 0,
    totalDistractions: 0,
  });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getLocalDateString = (dateObj = new Date()) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const loadData = async () => {
    const data = await getSessions();
    setSessions(data);
    calculateStats(data);
  };

  const calculateStats = (data) => {
    const todayLocal = getLocalDateString(new Date());
    let todayTime = 0;
    let totalTime = 0;
    let totalDist = 0;

    data.forEach((item) => {
      const sessionDateLocal = getLocalDateString(new Date(item.date));
      const durationInMinutes = item.duration / 60;

      totalTime += durationInMinutes;
      totalDist += item.distractions;

      if (sessionDateLocal === todayLocal) {
        todayTime += durationInMinutes;
      }
    });

    setStats({
      todayFocus: todayTime,
      totalFocus: totalTime,
      totalDistractions: totalDist,
    });
  };

  const getRandomColor = () => {
    const hex = Math.floor(Math.random() * 16777215).toString(16);
    return `#${hex}`;
  };

  const categoryData = (() => {
    const counts = {};
    sessions.forEach((s) => {
      const mins = s.duration / 60;
      counts[s.category] = (counts[s.category] || 0) + mins;
    });

    const fixedColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];

    return Object.keys(counts).map((key, index) => ({
      name: key,
      population: Math.round(counts[key]),
      color: index < fixedColors.length ? fixedColors[index] : getRandomColor(),
      legendFontColor: "#333",
      legendFontSize: 13,
    }));
  })();

  const weeklyData = (() => {
    const labels = [];
    const dataPoints = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = getLocalDateString(d);
      labels.push(dayLabel.slice(8));

      const totalMinutes = sessions
        .filter((s) => getLocalDateString(new Date(s.date)) === dayLabel)
        .reduce((sum, current) => sum + current.duration / 60, 0);

      dataPoints.push(Math.round(totalMinutes));
    }
    return { labels, datasets: [{ data: dataPoints }] };
  })();

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ReportsHeader />

        <View style={styles.statsRow}>
          <StatCard
            title="Bugün"
            value={`${Math.round(stats.todayFocus)} dk`}
            icon="timer-outline"
            color="#4A90E2"
          />
          <StatCard
            title="Toplam"
            value={`${Math.round(stats.totalFocus)} dk`}
            icon="bar-chart-outline"
            color="#66BB6A"
          />
          <StatCard
            title="Dikkat Dağ."
            value={`${stats.totalDistractions}`}
            icon="alert-circle-outline"
            color="#EF5350"
          />
        </View>

        <WeeklyChart data={weeklyData} />
        <CategoryChart data={categoryData} hasData={sessions.length > 0} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
});
