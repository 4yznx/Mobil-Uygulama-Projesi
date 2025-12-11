import AsyncStorage from "@react-native-async-storage/async-storage";

const DATA_KEY = "@focus_sessions";
const CAT_KEY = "@custom_categories";

export const saveSession = async (sessionData) => {
  try {
    const existingData = await getSessions();
    const updatedData = [...existingData, sessionData];
    await AsyncStorage.setItem(DATA_KEY, JSON.stringify(updatedData));
  } catch (e) {
    console.error("Error saving session:", e);
  }
};

export const getSessions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const deleteSessionsByCategory = async (categoryToDelete) => {
  try {
    const existingSessions = await getSessions();
    const filteredSessions = existingSessions.filter(
      (session) => session.category !== categoryToDelete
    );
    await AsyncStorage.setItem(DATA_KEY, JSON.stringify(filteredSessions));
  } catch (e) {
    console.error("Error deleting category sessions:", e);
  }
};

export const getCategories = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CAT_KEY);
    const defaultCats = ["Ders Çalışma", "Kitap Okuma", "Kodlama"];
    return jsonValue != null ? JSON.parse(jsonValue) : defaultCats;
  } catch (e) {
    return ["Ders Çalışma", "Kitap Okuma", "Kodlama"];
  }
};

export const addCategoryToStorage = async (newCat) => {
  try {
    const currentCats = await getCategories();
    if (!currentCats.includes(newCat)) {
      const updatedCats = [...currentCats, newCat];
      await AsyncStorage.setItem(CAT_KEY, JSON.stringify(updatedCats));
      return updatedCats;
    }
    return currentCats;
  } catch (e) {
    console.error("Error adding category:", e);
    return [];
  }
};

export const removeCategoryFromStorage = async (categoryToRemove) => {
  try {
    const currentCats = await getCategories();
    const updatedCats = currentCats.filter((c) => c !== categoryToRemove);
    await AsyncStorage.setItem(CAT_KEY, JSON.stringify(updatedCats));
    return updatedCats;
  } catch (e) {
    console.error("Error removing category:", e);
    return [];
  }
};
