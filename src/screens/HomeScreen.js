import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  AppState,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useKeepAwake } from "expo-keep-awake";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

import TimerDisplay from "../components/home/TimerDisplay";
import CategorySelector from "../components/home/CategorySelector";
import ControlButtons from "../components/home/ControlButtons";
import TimeWheel from "../components/home/TimeWheel";

import AddCategoryModal from "../components/home/modals/AddCategoryModal";
import ThemeSelectorModal from "../components/home/modals/ThemeSelectorModal";

import {
  saveSession,
  getCategories,
  addCategoryToStorage,
  removeCategoryFromStorage,
  deleteSessionsByCategory,
} from "../services/database";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen() {
  const { themeColor, updateTheme } = useTheme();
  useKeepAwake();

  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [category, setCategory] = useState(null);
  const [distractions, setDistractions] = useState(0);
  const [categories, setCategories] = useState([]);

  const sessionMinutesRef = useRef(sessionMinutes);

  const [sound, setSound] = useState();

  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);

  const appState = useRef(AppState.currentState);
  const pausedByDistraction = useRef(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    sessionMinutesRef.current = sessionMinutes;
  }, [sessionMinutes]);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (e) {
        console.log("Audio config error", e);
      }
    };
    configureAudio();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAlarmSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/alarm.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log("Alarm error", error);
    }
  };

  const playAlertSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/alert.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log("Alert error", error);
    }
  };

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(sessionMinutes * 60);
    }
  }, [sessionMinutes]);

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
        playAlertSound();
        handleStop(false);
        pausedByDistraction.current = true;
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        if (pausedByDistraction.current) {
          Alert.alert(
            "Dikkat!",
            "Odaklanma bozuldu. Devam etmek istiyor musunuz?",
            [
              {
                text: "Hayır",
                onPress: () => {
                  pausedByDistraction.current = false;
                  setIsRunning(false);
                  setTimeLeft(sessionMinutesRef.current * 60);
                  setDistractions(0);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  const handleAddCategory = async (catName) => {
    const updatedCats = await addCategoryToStorage(catName);
    setCategories(updatedCats);
    setCategory(catName);
    setAddModalVisible(false);
  };

  const handleDeleteCategory = (cat) => {
    Alert.alert("Kategori İşlemleri", `"${cat}" için işlem seçiniz:`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Verileri Temizle",
        onPress: async () => {
          Alert.alert("Emin misiniz?", `"${cat}" geçmiş verileri silinecek.`, [
            { text: "Vazgeç", style: "cancel" },
            {
              text: "Temizle",
              onPress: async () => {
                await deleteSessionsByCategory(cat);
              },
            },
          ]);
        },
      },
      {
        text: "Kategoriyi Sil",
        style: "destructive",
        onPress: async () => {
          Alert.alert("Tamamen Sil?", `"${cat}" ve tüm verileri silinecek.`, [
            { text: "Vazgeç", style: "cancel" },
            {
              text: "Sil",
              style: "destructive",
              onPress: async () => {
                const updated = await removeCategoryFromStorage(cat);
                setCategories(updated);
                await deleteSessionsByCategory(cat);
                if (category === cat) setCategory(null);
              },
            },
          ]);
        },
      },
    ]);
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60) < 10 ? "0" : ""}${Math.floor(s / 60)}:${
      s % 60 < 10 ? "0" : ""
    }${s % 60}`;

  const handleStart = () => {
    if (!category) {
      Alert.alert("Hata", "Kategori seçiniz.");
      return;
    }
    setTimePickerVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(true);
  };

  const handleStop = async (finished) => {
    setIsRunning(false);
    if (finished) {
      await playAlarmSound();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      await saveSession({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: sessionMinutes * 60,
        category,
        distractions,
      });
      showSummary();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(false);
    setTimeLeft(sessionMinutes * 60);
    setDistractions(0);
  };

  const showSummary = () => {
    Alert.alert(
      "Seans Tamamlandı!",
      `Süre: ${sessionMinutes} dakika\nKategori: ${category}\nDikkat Dağınıklığı: ${distractions}`,
      [{ text: "Tamam", onPress: handleReset }]
    );
  };

  const toggleTimeEdit = () => {
    if (!isRunning) {
      Haptics.selectionAsync();
      setTimePickerVisible(!isTimePickerVisible);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.themeButton}
          onPress={() => setThemeModalVisible(true)}
        >
          <Ionicons name="color-palette" size={24} color="#555" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.content}>
        <View style={styles.fixedTimeContainer}>
          {isRunning ? (
            <TimerDisplay time={formatTime(timeLeft)} />
          ) : isTimePickerVisible ? (
            <TimeWheel
              selectedMinutes={sessionMinutes}
              onTimeChange={setSessionMinutes}
              onClose={() => setTimePickerVisible(false)}
            />
          ) : (
            <TouchableOpacity
              onPress={toggleTimeEdit}
              style={styles.clickableTimer}
            >
              <TimerDisplay time={formatTime(timeLeft)} />
            </TouchableOpacity>
          )}
        </View>

        <CategorySelector
          categories={categories}
          selected={category}
          onSelect={setCategory}
          onAddPress={() => setAddModalVisible(true)}
          onDeletePress={handleDeleteCategory}
          disabled={isRunning}
        />

        <ControlButtons
          isRunning={isRunning}
          onStart={handleStart}
          onPause={() => handleStop(false)}
          onReset={handleReset}
        />
      </View>

      <AddCategoryModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAddCategory}
      />
      <ThemeSelectorModal
        visible={isThemeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        onSelect={updateTheme}
        currentTheme={themeColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
    left: 20,
    zIndex: 10,
  },
  themeButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 50,
    elevation: 3,
  },
  content: {
    flex: 1,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  fixedTimeContainer: {
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  clickableTimer: {
    alignItems: "center",
    padding: 10,
  },
});
