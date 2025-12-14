import * as SQLite from "expo-sqlite";

let db = null;

const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("focus_app.db");
  }
  return db;
};

export const initDB = async () => {
  const database = await getDB();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      duration INTEGER NOT NULL,
      category TEXT NOT NULL,
      distractions INTEGER DEFAULT 0
    );
  `);

  const result = await database.getAllAsync("SELECT * FROM categories LIMIT 1");
  if (result.length === 0) {
    await addDefaultCategories();
  }
};

const addDefaultCategories = async () => {
  const defaults = ["Ders Çalışma", "Kodlama", "Kitap Okuma"];
  for (const cat of defaults) {
    try {
      await addCategoryToStorage(cat);
    } catch (e) {
      console.log("Category already exists");
    }
  }
};

export const getCategories = async () => {
  const database = await getDB();
  const rows = await database.getAllAsync("SELECT name FROM categories");
  return rows.map((r) => r.name);
};

export const addCategoryToStorage = async (categoryName) => {
  const database = await getDB();
  await database.runAsync(
    "INSERT OR IGNORE INTO categories (name) VALUES (?)",
    categoryName
  );
  return await getCategories();
};

export const removeCategoryFromStorage = async (categoryName) => {
  const database = await getDB();
  await database.runAsync(
    "DELETE FROM categories WHERE name = ?",
    categoryName
  );
  return await getCategories();
};

export const saveSession = async (session) => {
  const database = await getDB();
  await database.runAsync(
    "INSERT INTO sessions (date, duration, category, distractions) VALUES (?, ?, ?, ?)",
    session.date,
    session.duration,
    session.category,
    session.distractions
  );
};

export const getSessions = async () => {
  const database = await getDB();
  return await database.getAllAsync("SELECT * FROM sessions ORDER BY id DESC");
};

export const deleteSessionsByCategory = async (categoryName) => {
  const database = await getDB();
  await database.runAsync(
    "DELETE FROM sessions WHERE category = ?",
    categoryName
  );
};
