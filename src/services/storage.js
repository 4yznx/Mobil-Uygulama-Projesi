import AsyncStorage from "@react-native-async-storage/async-storage";

const DATA_KEY = "@focus_sessions";

export const saveSession = async (sessionData) => {
  try {
    const existingData = await getSessions();
    const updatedData = [...existingData, sessionData];
    await AsyncStorage.setItem(DATA_KEY, JSON.stringify(updatedData));
    console.log("Data saved successfully:", sessionData);
  } catch (e) {
    console.error("Error saving data:", e);
  }
};

export const getSessions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading data:", e);
    return [];
  }
};

export const clearSessions = async () => {
  try {
    await AsyncStorage.removeItem(DATA_KEY);
    console.log("All data cleared successfully");
  } catch (e) {
    console.error("Error clearing data:", e);
  }
};
