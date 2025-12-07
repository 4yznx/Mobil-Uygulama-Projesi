import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  AppState,
  ImageBackground,
} from "react-native";

import TimerDisplay from "../components/home/TimerDisplay";
import TimeAdjustButtons from "../components/home/TimeAdjustButtons";
import CategorySelector from "../components/home/CategorySelector";
import ControlButtons from "../components/home/ControlButtons";
import { saveSession } from "../services/storage";

const bgImage = require("../../assets/background.jpg");

export default function HomeScreen() {
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const [isRunning, setIsRunning] = useState(false);
  const [category, setCategory] = useState(null);
  const [distractions, setDistractions] = useState(0);

  const categories = ["Ders Çalışma", "Kodlama", "Kitap Okuma"];

  const appState = useRef(AppState.currentState);
  const pausedByDistraction = useRef(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isRunning) {
      handleStop(true);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState.match(/inactive|background/) && isRunningRef.current) {
        setDistractions((p) => p + 1);
        handleStop(false);
        pausedByDistraction.current = true;
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        if (pausedByDistraction.current) {
          Alert.alert(
            "Dikkat Dağınıklığı Algılandı!",
            "Devam etmek ister misiniz?",
            [
              {
                text: "Hayır",
                onPress: () => {
                  pausedByDistraction.current = false;
                  handleReset();
                },
                style: "cancel",
              },
              {
                text: "Evet",
                onPress: () => {
                  setIsRunning(true);
                  pausedByDistraction.current = false;
                },
              },
            ]
          );
        }
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const increaseTime = () => {
    if (!isRunning) {
      setSessionMinutes((p) => p + 1);
      setTimeLeft((p) => p + 60);
    }
  };

  const decreaseTime = () => {
    if (!isRunning && sessionMinutes > 1) {
      setSessionMinutes((p) => p - 1);
      setTimeLeft((p) => p - 60);
    }
  };

  const handleStart = () => {
    if (!category) {
      Alert.alert("Kategori Seçiniz!", "Kategori seçmeden başlayamazsınız.");
      return;
    }
    setIsRunning(true);
  };

  const handleStop = async (finished = false) => {
    setIsRunning(false);

    if (finished) {
      const sessionData = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: sessionMinutes * 60,
        category: category,
        distractions: distractions,
      };

      await saveSession(sessionData);
      showSummary();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionMinutes * 60);
    setDistractions(0);
  };

  const showSummary = () => {
    const mins = sessionMinutes;

    Alert.alert(
      "Seans Özeti",
      `Süre: ${mins} dakika\nKategori: ${category}\nDikkat Dağınıklığı: ${distractions}`,
      [{ text: "Tamam", onPress: () => handleReset() }]
    );
  };

  return (
    <ImageBackground
      source={bgImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TimerDisplay time={formatTime(timeLeft)} />

        <TimeAdjustButtons
          disabled={isRunning}
          onIncrease={increaseTime}
          onDecrease={decreaseTime}
        />

        <CategorySelector
          categories={categories}
          selected={category}
          onSelect={setCategory}
          disabled={isRunning}
        />

        <ControlButtons
          isRunning={isRunning}
          onStart={handleStart}
          onPause={() => handleStop(false)}
          onReset={handleReset}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
