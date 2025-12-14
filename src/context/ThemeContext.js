import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#F5F7FA");

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

export const useTheme = () => useContext(ThemeContext);
