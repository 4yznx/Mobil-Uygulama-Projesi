// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // اللون الافتراضي (أبيض فاتح)
  const [themeColor, setThemeColor] = useState("#F5F7FA");

  // تحميل اللون المحفوظ عند فتح التطبيق
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedColor = await AsyncStorage.getItem("@app_theme");
        if (savedColor) setThemeColor(savedColor);
      } catch (e) {
        console.log("Error loading theme", e);
      }
    };
    loadTheme();
  }, []);

  // دالة تغيير اللون وحفظه
  const updateTheme = async (color) => {
    setThemeColor(color);
    await AsyncStorage.setItem("@app_theme", color);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook بسيط لاستخدام الثيم في أي مكان
export const useTheme = () => useContext(ThemeContext);
