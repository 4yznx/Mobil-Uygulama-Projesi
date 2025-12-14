import React, { useEffect } from "react"; // أضف useEffect
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import TabNavigator from "./src/navigation/TabNavigator";
import { ThemeProvider } from "./src/context/ThemeContext";

// 👇 استيراد دالة التهيئة
import { initDB } from "./src/services/database";

export default function App() {
  // 👇 تشغيل قاعدة البيانات عند فتح التطبيق
  useEffect(() => {
    initDB()
      .then(() => console.log("Database initialized successfully"))
      .catch((err) => console.log("Database error: ", err));
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <TabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
